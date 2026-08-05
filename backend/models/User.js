/**
 * User Mongoose Model Schema
 * Hackathon Management Platform
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude password field from queries by default for security
    },
    role: {
      type: String,
      enum: {
        values: ['Admin', 'Organizer', 'Participant', 'Judge'],
        message: '{VALUE} is not a valid role. Allowed: Admin, Organizer, Participant, Judge'
      },
      default: 'Participant'
    },
    college: {
      type: String,
      trim: true,
      default: ''
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    bio: {
      type: String,
      maxlength: [250, 'Bio cannot exceed 250 characters'],
      default: ''
    },
    profileImage: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    }
  },
  {
    timestamps: true
  }
);

/**
 * Pre-Save Hook: Hash password before saving user to MongoDB database
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified or is new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Custom Instance Method: Match entered password with hashed password in database
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
