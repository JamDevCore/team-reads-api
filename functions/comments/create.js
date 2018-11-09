import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Comment from '../../models/Comment';
import Discussion from '../../models/Discussion';


export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;
  // // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const comment = data;

  connectToDatabase()
    .then(async () => {
        const newComment = await Comment.create(comment);
        await Discussion.updateOne({ _id: comment.discussionId }, {
          $addToSet: {
            comments: newComment._id,
          },
        })
        callback(null, success(newComment))
    })
    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
