const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const profile = require('../../models/Profile');
const user = require('../../models/User');
const Profile = require('../../models/Profile');

let profileBuild = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    location,
    mainInstrument,
    level,
    otherInstruments,
    genres,
    bio,
    bandcamp,
    soundcloud,
    twitter,
    instagram,
    facebook,
    youtube,
    linkedin,
  } = req.body;

  // Build profile object
  const profileFileds = {};
  profileFileds.user = req.user.id;
  if (location) profileFileds.location = location;
  if (mainInstrument) profileFileds.mainInstrument = mainInstrument;
  if (level) profileFileds.level = level;
  if (otherInstruments) {
    profileFileds.otherInstruments = otherInstruments
      .split(',')
      .map((otherInstrument) => otherInstrument.trim());
  }
  if (genres) profileFileds.genres = genres;
  if (bio) profileFileds.bio = bio;

  //Build social object
  profileFileds.social = {};
  if (bandcamp) profileFileds.bandcamp = bandcamp;
  if (soundcloud) profileFileds.soundcloud = soundcloud;
  if (twitter) profileFileds.twitter = twitter;
  if (instagram) profileFileds.instagram = instagram;
  if (facebook) profileFileds.facebook = facebook;
  if (youtube) profileFileds.youtube = youtube;
  if (linkedin) profileFileds.linkedin = linkedin;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    // Update
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFileds },
        { new: true }
      );

      return res.json(profile);
    }
    // Create
    profile = new Profile(profileFileds);

    await Profile.save();
    res.json(profile);
  } catch {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = profileBuild;
