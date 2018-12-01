import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import User from '../../models/User';
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
      if (params && params.teamId) {
        const team = await Team.findOne({ _id: params.teamId });
        const teamIds = team.teamMembers;
        const users = await User.find({ _id: { $in: teamIds } });
        callback(null, success({
          object: 'list',
          url: event.path,
          count: users.length,
          data: users,
        }));
      } else if (params && params.search) {
          const users = await User.find({ email: { $regex: params.search } }).limit(20);
          callback(null, success({
            object: 'list',
            url: event.path,
            count: users.length,
            data: users,
          }));
      } else {
        const users = await User.find(params);
        callback(null, success({
          object: 'list',
          url: event.path,
          count: users.length,
          data: users,
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
