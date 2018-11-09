import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Shelf from '../../models/Shelf';
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
        const shelf = data;

        const newShelf = await Shelf.create(shelf);
        await User.updateOne({ _id: shelf.ownerId }, {
          $addToSet: {
            shelves: newShelf._id,
          },
        })
        callback(null, success(newShelf));
    })
    .catch(err => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message
      }))
    });
}
