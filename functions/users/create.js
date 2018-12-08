import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import createAccount from '../../utility/create-account';
import { userLimits } from '../../utility/limits';
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
  const data = JSON.parse(event.body);

  const user = data;

  connectToDatabase()
    .then(async () => {
      if (user.invitation && user.email && user.teamId) {
          const team = await Team.findOne({ _id: user.teamId });
          if (team.numberOfUsers < userLimits.basic) {
            const account = await createAccount({ email: user.email });
            let userId = account.data.user_id;
            userId = userId.substring(userId.indexOf('|') + 1, userId.length);
            user._id = userId;
            user.teamInvites = [user.teamId];
            user.role = "user";
            user.username = account.data.username;
            await Team.findOneAndUpdate({ _id: user.teamId }, {
              $addToSet: {
                sentInvitations: userId,
              },
              $inc: {
                numberOfUsers: 1,
              },
            });
            delete user.teamId;
            delete user.invitation;
            const newUser = await User.create(user)
            callback(null, success(newUser))
        } else {
          callback(null, failure({
            status: false,
            error: 'You have reached your user limit'
          }));
        }
      } else {
        const newUser = await User.create(user);
        callback(null, success(newUser))
      }
    })

    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
