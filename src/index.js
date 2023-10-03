require('./db/connection')
const devicesModel = require('./db/models/cat_devices')
const consumptionsModel = require('./db/models/consumptions')

const fecha = "30/09/2023"
const cuadrarMirrow = async () => {
    
    try{
        //const elmirrow =  await devicesModel.find({iddevices: '010161'});
        const devices_pol =  await devicesModel.find({idtypedevice : {$ne : "3"}, idfacility : "1"}).exec();

        let consumoxdia, sumaconsumo = 0, adicional
        let consumptions

        for(let i=0; i<devices_pol.length; i++){
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
                
                console.log("inicial: " + inicial + " final: " + final)
                consumoxdia = final - inicial
            }else{
                consumoxdia = 0
            }

            (consumoxdia < 0) ? consumoxdia*-1 : consumoxdia;
            console.log(devices_pol[i].iddevices + " ->> " + consumoxdia)
            sumaconsumo += consumoxdia
        }

        console.log("total del consumo= " + sumaconsumo)
        adicional = sumaconsumo * 0.017
        sumaconsumo = sumaconsumo + adicional
        console.log("total del consumo mas el 0.017% = " + sumaconsumo)

        const mirrowconsumptions = await consumptionsModel.find({id: "010161", fecha: fecha}).exec();



    } catch (error) {
        console.log(error)
    }

}  



cuadrarMirrow();