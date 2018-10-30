import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Discussion from '../../models/Discussion';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(async () => {
        const discussionId = event.pathParameters.id;
        const discussion = await Discussion.findOne({ _id: discussionId });
        callback(null, success(discussion));
    })
    .catch(err => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
