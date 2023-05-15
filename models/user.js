const mongoose = require("mongoose")
const validator = require("validator")
const bycrypt = require("bycryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your correct email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (pass) {
        return pass === this.password
        
      },
      message:"Passwords are not the same"
    }
  },
});

UserSchema.pre("save", async (next) => {
  if (!this.isModified("password")) return next()
  
  const salt = await bycrypt.genSalt(10)
  this.password = await bycrypt.hash(this.password, salt)
  this.confirmPassword = undefined
  next()
})

UserSchema.methods.signJwtToken = () => {
  return jwt.sign({
    id:this._id
  }, process.env.JWT_SECRECT_KEY, {
    expiresIn:process.env.JWT_EXPIRES_IN
  })
}

UserSchema.methods.correctPassword = async () => {
  return await bycrypt.compare(userPassword,this.password)
}

module.exports = mongoose.model('User',UserSchema)