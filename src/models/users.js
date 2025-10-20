const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Users = new Schema(
  {
    name: { type: String, trim: true },
    phoneNumber: { type: String, trim: true, index: true },
    profileImage: {
      type: String,
      default:
        'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
    },
    about: { type: String, default: '' },
    selectedCountry: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('users', Users);