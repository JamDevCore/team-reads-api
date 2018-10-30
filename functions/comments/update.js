import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Comment from '../../models/Comment';

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
        const commentId = event.pathParameters.id;
        const updates = data;
        console.log(commentId)
        const updatedComment = await Comment.findOneAndUpdate(commentId, updates, { new: true });
        callback(null, success(updatedComment))
    })
    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
