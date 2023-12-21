const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://serbitdba:JOJVSd4Bng2ISekM@serbitems.dgapd4l.mongodb.net/SerbitVKEMS',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('conectando a la base de datos... ')
}).catch((error) => {
    console.log('algo salio mal', error)
});


const connection = mongoose.connection;

connection.once('open', ()=> {
    console.log('la conexión a la base de datos esta abierta');
});
