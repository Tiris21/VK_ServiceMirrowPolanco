const {Schema , model} = require('mongoose');

const consumptionSchema = new Schema(
    {
        id:
        {
            type : String
        },
        value:
        {
            type : String
        },
        variable:
        {
            type : String
        },
        fecha: {
            type : String
        },
        hora:
        {
            type : String
        }
    }
);

module.exports = model('Consumption' , consumptionSchema);