const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const wineSchema = new Schema ({
    name: String,
    country: String,
    year: Number,
    annotations: String,
    type: [ 'red', 'white', 'rose', 'sparkling', 'dessert', 'green' ],
    blend: String, //add % on the input
    alcoholicPercentage: Number,
    grapes: String,
    abv: String, //check the type
    drinkUntil: Number, //or String? 
    bottleSize: String, //it has numbers and letters
    closure: String
});

module.exports = model('Wine', wineSchema); 