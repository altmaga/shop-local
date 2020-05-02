/*
Import
*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt');
//


/*
Definition
*/
const userSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: 1,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

// Hash password
userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Generate token
// userSchema.methods.generateAuthToken = async function() {
//     // Generate an auth token for the user
//     const user = this
//     const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
//     user.tokens = user.tokens.concat({token})
//     await user.save()
//     return token
// }
// userSchema.methods.generateToken = function(cb){
//     var user = this;
//     var token = jwt.sign(user._id.toHexString(),process.env.JWT_KEY)
//     user.token = token;
//     user.save(function(err,user){
//         if(err) return cb(err);
//         cb(null,user);
//     })
// };

// Compare password
userSchema.methods.comparePassword = function(candidatePassword, checkPassword) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) {
            return checkPassword(err);
        }
        else {
            checkPassword(null, isMatch);
        }
    })
}

/*
Export
*/
const User = mongoose.model('user', userSchema);
module.exports = User;
//