const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  links: [
    {
      title: String,
      url: String,
    }
  ],
  balance: Number,
});

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });

  if (!user.links || user.links.length === 0) {
    user.links = [{
      title: 'Unique Link',
      url: generateUniqueLink(),
    }];
  }

  user.balance = 0;
});

function generateUniqueLink() {
  const uniqueLink = `user-${Math.random().toString(36).substring(2, 15)}`;
  return uniqueLink;
}

module.exports = mongoose.model('User', userSchema);
