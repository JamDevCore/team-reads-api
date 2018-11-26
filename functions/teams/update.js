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

  connectToDatabase()
    .then(async () => {
        const data = JSON.parse(event.body);
        const updates = data;
        const teamId = event.pathParameters.id;

        if (updates.joinRequest) {
          await Team.findOneAndUpdate({ _id: teamId }, {
            $addToSet: {
              joinRequests: updates.joinRequest,
            }
          });
          delete updates.joinRequest;
        }

        if (updates.declineRequest) {
          await Team.findOneAndUpdate({ _id: teamId }, {
            $pull: {
              joinRequests: updates.declineRequest,
            }
          });
          await User.findOneAndUpdate({ _id: updates.declineRequest }, {
            $pull: {
              teams: teamId,
            }
          });
          delete updates.declineRequest;
        }

        if (updates.newUser) {
          await Team.findOneAndUpdate({ _id: teamId }, {
            $addToSet: {
              teamMembers: updates.newUser,
            },
            $pull: {
              joinRequests: updates.newUser,
            }
          });
          await User.findOneAndUpdate({ _id: updates.newUser }, {
            $addToSet: {
              teams: teamId,
            }
          });
          delete updates.newUser;
        }
        const updatedTeam = await Team.findOneAndUpdate({ _id: teamId }, updates, { new: true });
        callback(null, success(updatedTeam));
    })
    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
