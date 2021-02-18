const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const wineSchema = new Schema ({
    name: {
        type: String,
        required: [true, 'You need to give a name to your wine']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User' //Relates to the User model
    },
    country: String,
    year: Number,
    annotations:{
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['red', 'white', 'rose', 'sparkling', 'dessert', 'green', 'porto'],
        required: [true, 'Your wine must have a type']
    },
    blend: String,
    abv: {
        type: Number,
        min: 3,
        max: 90
    },
    drinkUntil: Date,
    bottleSize: Number,
    closure: String
});

module.exports = model('Wine', wineSchema);