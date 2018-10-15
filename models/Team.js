import mongoose from 'mongoose';

delete mongoose.connection.models['Team'];

const TeamSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  teamAdmins: {
    type: [String],
    default: []
  },
  teamMembers: {
    type: [String],
    default: []
  },
  numberOfUsers: {
    type: Number,
    default: 0
  },
  teamName: {
    type: String,
    required: true
  },
  books: {
    type: [String],
    default: []
  },
  shelves: {
    type: [String],
    default: []
  }
});

export default mongoose.model('Team', TeamSchema);
