import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Note from '../../models/Note';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(async () => {
        const data = JSON.parse(event.body);
        const updates = data;
        const noteId = event.pathParameters.id;
        
        const updatedNote = await Note.findOneAndUpdate({ _id: noteId }, updates, { new: true });
        callback(null, success(updatedNote));
    })
    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
