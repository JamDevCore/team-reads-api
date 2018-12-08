import mongoose from 'mongoose';
import User from './User';
import Book from './Book';

const Schema = mongoose.Schema;
delete mongoose.connection.models['Team'];

const TeamSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  numberOfUsers: {
    type: Number,
    default: 1
  },
  teamAdmins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  teamMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  numberOfUsers: {
    type: Number,
    default: 0
  },
  teamName: {
    type: String,
    required: true
  },
  joinRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  sentInvitations: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

export default mongoose.model('Team', TeamSchema);
