import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Team from '../../models/Team';
import User from '../../models/User';

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;
  // // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const team = data;
  const user = team.userId;
  delete team.userId;
  team.createdAt = Date.now();

  connectToDatabase()
    .then(async () => {
        const newTeam = await Team.create(team);
        await User.findOneAndUpdate({ _id: user }, {
          $addToSet: {
            teams: newTeam._id,
          }
        })
        callback(null, success(newTeam));
    })
    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
