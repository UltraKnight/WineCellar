const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const requestSchema = new Schema ({
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    }
});

module.exports = model('Request', requestSchema);