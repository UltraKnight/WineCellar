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
      
      red: Boolean, //for the switch on profile page
      
      white: Boolean,
      
      rose: Boolean, 
      
      sparkling: Boolean, 
      
      dessert: Boolean, 
      
      green: Boolean, 
      
      porto: Boolean,

    
      createdWines: {
        red: {
          type: Number,
          default: 0
        },
        white: {
          type: Number,
          default: 0
        },
        rose: {
          type: Number,
          default: 0
        },
        sparkling: {
          type: Number,
          default: 0
        },
        dessert: {
          type: Number,
          default: 0
        },
        green: {
          type: Number,
          default: 0
        },
        porto: {
          type: Number,
          default: 0
        },
        total: {
          type: Number,
          default: 0
        },
      },

      createdCellars: {
        type: Number,
        default: 0
      },

      picChanged: {
        type: Boolean,
        default: false
      },

      addedFirst: {
        type: Boolean,
        default: false
      }
  });

module.exports = model('User', userSchema);
