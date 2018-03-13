import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, trim: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  role: String,
  country: String,
  wallet: { type: Number, default: 100 },
  winCount: { type: Number, default: 0 },
  lossCount: { type: Number, default: 0 },
  birthday: Date,
  joinDate: { type: Date, default: Date.now },
  referralEmail: String
});

// Before saving the user, hash the password
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, function(error, hash) {
      if (error) { return next(error); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

// Omit the password, referralEmail when returning a user
userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.referralEmail;
    delete ret.joinDate;
    delete ret.birthday;
    delete ret.country;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
