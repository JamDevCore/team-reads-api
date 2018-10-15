import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
let isConnected;

export function connectToDatabase() {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve()
  }
  console.log('=> using new database connection');
  return mongoose.connect(process.env.MONGO_URI, { autoIndex: false, useNewUrlParser: true })
    .then(db => {
      isConnected = db.connections[0].readyState;
      return Promise.resolve(isConnected)
    })
    .catch(err => Promise.reject(err));
};
