const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const openedSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    event: {
      type: String
    },
    year: {
      type: Number
    },
    openingDate: {
      type: Date
    },
    type: {
      type: String,
      enum: ['red', 'white', 'rose', 'sparkling', 'dessert', 'green', 'porto']
  },
});

module.exports = model('Opened', openedSchema);