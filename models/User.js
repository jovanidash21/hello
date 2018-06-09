var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var timestamps = require('mongoose-timestamp');

mongoose.Promise = Promise;

var userChatRoomSchema = new Schema (
  {
    data: {
      type: Schema.Types.ObjectId,
      ref: 'ChatRoom',
    },
    unReadMessages: {
      type: Number,
      default: 0,
    },
    isKick: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id : false,
  },
);

var userBlockMuteSchema = new Schema (
  {
    data: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id : false,
  },
);

var userSchema = new Schema (
  {
    name: String,
    email: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: [
        '',
        'male',
        'female',
      ],
      default: '',
    },
    profilePicture: {
      type: String,
      default: 'https://raw.githubusercontent.com/jovanidash21/chat-app/master/public/images/default-profile-picture.jpg',
    },
    chatRooms: [userChatRoomSchema],
    accountType: {
      type: String,
      enum: [
        'local',
        'facebook',
        'google',
        'twitter',
        'instagram',
        'linkedin',
        'github',
        'guest'
      ],
      default: 'local',
    },
    role: {
      type: String,
      enum: [
        'owner',
        'admin',
        'moderator',
        'vip',
        'ordinary',
      ],
      default: 'ordinary',
    },
    block: userBlockMuteSchema,
    mute: userBlockMuteSchema,
    isOnline: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    socketID: {
      type: String,
      default: '',
    },
  },
  {
    collection: 'User',
  },
);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(timestamps);

module.exports = mongoose.model('User', userSchema);
