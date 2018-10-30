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
  connectToDatabase()
    .then(async () => {
        const commentId = event.pathParameters.id;
        const comment = await Comment.findOne({ _id: commentId });
        callback(null, success(comment));
    })
    .catch(err => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
