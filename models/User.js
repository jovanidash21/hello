const mongoose = require('mongoose');
const Promise = require('bluebird');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const timestamps = require('mongoose-timestamp');

mongoose.Promise = Promise;

const userEndDateSchema = new Schema (
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

const userChatRoomSchema = new Schema (
  {
    data: {
      type: Schema.Types.ObjectId,
      ref: 'ChatRoom',
    },
    unReadMessages: {
      type: Number,
      default: 0,
    },
    kick: userEndDateSchema,
    trash: userEndDateSchema,
  },
  {
    _id : false,
  },
);

const userSchema = new Schema (
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
      default: '',
    },
    chatRooms: [userChatRoomSchema],
    connectedChatRoom: {
      type: Schema.Types.ObjectId,
      ref: 'ChatRoom',
    },
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
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    mute: userEndDateSchema,
    ban: userEndDateSchema,
    isOnline: {
      type: Boolean,
      default: false,
    },
    isLiveVideoActive: {
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
