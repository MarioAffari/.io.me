// User model
import mongoose, { Schema } from 'mongoose';

const User = new Schema({
  chatId: { type: String, required: true },
  username: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  role: { type: String, default: 'user' },
  keys: { type: [String], default: [] },
  language: { type: String, default: 'en' },
  banned: { type: Boolean, default: false },
  scripts: { type: [String], default: [] },
});

export default mongoose.model('User', User, 'users');
