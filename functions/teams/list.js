import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Team from '../../models/Team';

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
        const params = event.queryStringParameters;
        if(params.search) {
         const teams = await Team.find({ $text: { $search: params.search } });
         callback(null, success({
           object: 'list',
           url: event.path,
           count: teams.length,
           data: teams,
         }));
       } else {
        const teams = await Team.find(params);
        callback(null, success({
          object: 'list',
          url: event.path,
          count: teams.length,
          data: teams,
        }));
      }
    })
    .catch(err => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
