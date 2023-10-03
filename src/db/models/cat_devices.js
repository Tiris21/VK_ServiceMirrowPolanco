const {Schema , model} = require('mongoose');

const cat_devicesSchema = new Schema(
    {
        iddevices: {
            type:String,
            required : true,
            trim : true
        },
        name:
        {
            type:String,
            required: true,
            trim:true
        },
        description:
        {
            type:String,
            required:true,
            trim:true
        },
        idfacility: {
            type:String,
            required : true,
            trim : true
        },
        idtypedevice:
        {
            type:String,
            required:true,
            trim:true
        },
        active:
        {
            type:Boolean,
            required:true,
            trim:true
        },
        hour_begin:
        {
            type:Number,
            required:true,
            trim:true
        },
        hour_end:
        {
            type:Number,
            required:true,
            trim:true
        }
    },
    {
        timestamps : true
    }
);

module.exports = model('Cat_Devices' , cat_devicesSchema);