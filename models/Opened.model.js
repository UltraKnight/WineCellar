const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const openedSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User' //Relates to the User model
    },
    event: {
      type: String
    },
    year: {
      type: Number
    },
    openingDate: {
      type: Date,
      default: Date.now()
    },
    type: {
      type: String,
      enum: ['red', 'white', 'rose', 'sparkling', 'dessert', 'green', 'porto']
  },
});

module.exports = model('Opened', openedSchema);