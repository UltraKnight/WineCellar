const mongoose = require ('mongoose');
const { Schema, model } = mongoose; 

const achievementSchema = new Schema ({

    name: {
        type: String,
        required: [true, 'You need to give a name to your achievement.'],
        unique: true
    },
    users: [{ //Those who achieved that
        type: Schema.Types.ObjectId,
        ref: 'User' //Relates to the User model
    }],
    description: String,
    imageURL: {
        type: String,
        required: true
    }
});

module.exports = model('Achievement', achievementSchema);