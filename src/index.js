require('./db/connection')
const moment = require('moment-timezone')
const cron = require('node-cron')
const devicesModel = require('./db/models/cat_devices')
const consumptionsModel = require('./db/models/consumptions')
const {enviarNotificacionEmail} = require('./notification')

//const fecha = "30/09/2023"
//moment().tz("America/Mexico_City").format() NO SIRVE :C
//const fecha = moment(new Date()).format('DD/MM/YYYY').toString()

const main = async () =>
{
    try{
        cron.schedule('0 2 * * *', async() => {
        //cron.schedule('*/5 * * * *', async() => {
            console.log("#################################");
            console.log("INICIALIZANDO SERIVICIO");
            console.log("#################################");

            const today = new Date()
            const yesterday = new Date(today.setDate(today.getDate() - 1))
            const beforeyesterday = new Date(today.setDate(today.getDate() - 1))

            const fecha = moment(yesterday).format('DD/MM/YYYY').toString()
            const fechaayer = moment(beforeyesterday).format('DD/MM/YYYY').toString()

            console.log('############ FECHA DEL PROCESO: ' + fecha + ' ################');
            await cuadrarMirrow(fecha, fechaayer);
            console.log('########### FIN DE PROCESO #################');
        },{
            timezone: "America/Mexico_City"
        });   
    }catch(error){
        enviarNotificacionEmail(fecha, error);
        console.log(error)
    }
           
}

main();

const cuadrarMirrow = async (fecha, fechaayer) => {
    try{
        // OBTIENE LOS DEVICES QUE FORMARAN PARTE DE LA SUMATORIA
        const devices_pol =  await devicesModel.find({idtypedevice : {$ne : "3"}, idfacility : "1"}).exec();

        let consumoxdia, sumaconsumo = 0
        let consumptions

        for(let i=0; i<devices_pol.length; i++){
            //OBTIENE LOS CONSUMOS POR DIA DE CADA UNO DE LOS DEVICES
            consumptions = await consumptionsModel.find({id: devices_pol[i].iddevices, fecha: fecha}).exec();

            if(consumptions.length == 2){
                consumoxdia = consumptions[1].value - consumptions[0].value;
            }else if (consumptions.length > 2){
                let inicial, final;
                for(let z=0; z<consumptions.length; z++){
                    if(consumptions[z].hora.startsWith("00")){
                        inicial = consumptions[z].value
                    }
                    if(consumptions[z].hora.startsWith("23")){
                        final = consumptions[z].value
                    }
                }
                
                //console.log("inicial: " + inicial + " final: " + final)
                consumoxdia = final - inicial
            }else{
                consumoxdia = 0
            }

            (consumoxdia < 0) ? consumoxdia*-1 : consumoxdia;
            console.log(devices_pol[i].iddevices + " device consumió Kw -> " + consumoxdia)
            sumaconsumo += consumoxdia
        }

        // la suma del consumo se le suma 0.017% de su valor
        console.log("total del consumo= " + sumaconsumo)
        sumaconsumo = sumaconsumo * 1.017
        console.log("total del consumo mas el 0.017% = " + sumaconsumo)

        // obtener la lectura final de un dia anterior
        const mirrowconsumptionsayer = await consumptionsModel.findOne({id: "010161", fecha: fechaayer, hora: {$regex: '^23.*$'}}).exec();
        const lecturafinal = parseFloat(mirrowconsumptionsayer.value) + parseFloat(sumaconsumo)

        // EJECUTA EL UPDATE A LOS REGISTROS DEL MIRROW 
        await consumptionsModel.updateMany({id: "010161", fecha: fecha, hora: {$regex: '^00.*$'}}, { $set: { value:  mirrowconsumptionsayer.value} }).exec();
        await consumptionsModel.updateMany({id: "010161", fecha: fecha, hora: {$regex: '^23.*$'}}, { $set: { value:  lecturafinal} }).exec();
        console.log('lectura inicial mirrow -> ' + mirrowconsumptionsayer.value)
        console.log('lectura final mirrow-> ' + lecturafinal)


    } catch (error) {
        // enviar correo 
        enviarNotificacionEmail(fecha, error);
        console.log(error)
    }

}  