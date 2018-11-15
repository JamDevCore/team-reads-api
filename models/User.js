import mongoose from 'mongoose';

delete mongoose.connection.models['User'];

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  books: {
    type: [String],
    default: []
  },
  shelves: {
    type: [String],
    default: ['My first shelf']
  },
  teams: {
    type: [String],
    default: []
  },
  role: {
    type: String,
    default: 'user',
    required: true
  }
});

export default mongoose.model('User', UserSchema);
