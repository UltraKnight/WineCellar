const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const cellarSchema = new Schema ({

    name: {
        type: String,
        required: [true, 'You need to give a name to your cellar.'],
        unique: true
    },
    place: String,
    capacity: {
        Number,
        max: 900,
        default: 30
    },
    wines: [{
        type: Schema.Types.ObjectId,
        ref: 'Wine' //Relates to the Wine model
    }]
});

module.exports = model('Cellar', cellarSchema);