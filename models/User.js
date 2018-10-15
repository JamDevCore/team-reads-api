import mongoose from 'mongoose';

delete mongoose.connection.models['Book'];

const UserSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
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
    default: []
  },
  teams: {
    type: [String],
    default: []
  }
});

export default mongoose.model('User', UserSchema);
