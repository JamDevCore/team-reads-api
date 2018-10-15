import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Highlight from '../../models/Highlight';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(async () => {
        const highlightId = event.pathParameters.id;
        const highlight = await Highlight.findOneAndDelete({ _id: highlightId });
        callback(null, success(highlight));
    })
    .catch(err => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message
      }))
    });
}
