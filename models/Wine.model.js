const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const wineSchema = new Schema ({
    name: String,
    country: String,
    year: Number,
    annotations: String,
    type: {
        type: String,
        enum: [ 'red', 'white', 'rose', 'sparkling', 'dessert', 'green' ]
    },
    blend: String, 
    abv: Number, 
    drinkUntil: Date,
    bottleSize: Number,
    closure: String
});

module.exports = model('Wine', wineSchema);