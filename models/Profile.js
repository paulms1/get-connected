const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  mainInstrument: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  otherInstruments: {
    type: [String],
    required: true,
  },
  genres: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  experience: [
    {
      name: {
        type: String,
        required: true,
      },
      genre: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    bandcamp: {
      type: String,
    },
    soundcloud: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    facebook: {
      type: String,
    },
    youtube: {
      type: String,
    },
    linkedin: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
