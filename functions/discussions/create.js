import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Discussion from '../../models/Discussion';
import Book from '../../models/Book';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;
  // // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const discussion = data;

  connectToDatabase()
    .then(async () => {
        const newDiscussion = await Discussion.create(discussion);
        await Book.updateOne({ _id: discussion.bookId }, {
          $addToSet: {
            discussions: newDiscussion._id,
          },
        })
        callback(null, success(newDiscussion))
    })
    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
