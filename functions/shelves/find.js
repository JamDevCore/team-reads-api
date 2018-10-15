import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Shelf from '../../models/Shelf';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;

  const shelfId = event.pathParameters.id;

  connectToDatabase()
    .then(async () => {
        const shelf = await Shelf.findOne({ _id: shelfId });
        callback(null, success(shelf))
        .catch(err => {
          console.log(err);
          callback(null, failure({
            status: false,
            error: err.message
          }))
        });
    })
    .catch(err => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message
      }))
    });
}
