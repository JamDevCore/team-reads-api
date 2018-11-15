import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import User from '../../models/User';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;
  // // Request body is passed in as a JSON encoded string in 'event.body'

  connectToDatabase()
    .then(async () => {
        const data = JSON.parse(event.body);
        const userId = event.pathParameters.id;
        const updates = data;
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updates, { new: true });
        callback(null, success(updatedUser))
    })
    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
