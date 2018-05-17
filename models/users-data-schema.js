var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var timestamps = require('mongoose-timestamp');

mongoose.Promise = Promise;

var usersDataSchema = new Schema
(
  {
    name: String,
    gender: {
      type: String,
      enum: [
        'male',
        'female'
      ],
      default: 'male'
    },
    email: {
      type: String,
      default: ''
    },
    profilePicture: {
      type: String,
      default: 'https://raw.githubusercontent.com/jovanidash21/chat-app/master/public/images/default-profile-picture.jpg'
    },
    chatRooms: [{
      type: Schema.Types.ObjectId,
      ref: 'chatRoomsData'
    }],
    role: {
      type: String,
      enum: [
        'owner',
        'admin',
        'moderator',
        'vip',
        'registered',
        'guest'
      ],
      default: 'guest'
    },
    socketID: String
  },
  {
    collection: 'usersData'
  }
);

usersDataSchema.plugin(passportLocalMongoose);
usersDataSchema.plugin(timestamps);

module.exports = mongoose.model('usersData', usersDataSchema);
