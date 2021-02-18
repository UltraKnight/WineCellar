//test adding comment
const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const userSchema = new Schema ({
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required'],
        unique: true
      },
      
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true
      },
      
      password: {
        type: String,
        require: [true, 'Password is required']
      },
      
      imageURL: String,
      
      switch: Boolean //for the switch on profile page 
});

     module.exports = model('User', userSchema);