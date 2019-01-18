import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import User from '../../models/User';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(async () => {
      const userId = event.pathParameters.id;
      const user = await User.findOneAndDelete({ _id: userId });
      callback(null, success(user));
    })
    .catch((err) => {
      console.log(err);
      callback((null), failure({
        status: false,
        error: err.message,
      }));
    });
}
