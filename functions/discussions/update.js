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
  // // Request body is passed in as a JSON encoded string in 'event.body'

  connectToDatabase()
    .then(async () => {
        const data = JSON.parse(event.body);
        const discussionId = event.pathParameters.id;
        const updates = data;
        console.log(discussionId)
        const updatedDiscussion = await Discussion.findOneAndUpdate(discussionId, updates, { new: true });
        callback(null, success(updatedDiscussion))
    })
    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
