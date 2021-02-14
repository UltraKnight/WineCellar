const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const cellarSchema = new Schema ({

    name: String,
    place: String,
    capacity: String,
    wines: [String]

});

module.exports = model('Cellar', cellarSchema);