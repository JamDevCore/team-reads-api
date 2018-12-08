import request from 'request'
import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import User from '../../models/User';

const updateUserEmail = async ({ userId, email }) => {
  return new Promise((resolve) => {
    const options = {
    method: 'POST',
    url: `https://${process.env.AUTH_0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    body:
     { grant_type: 'client_credentials',
       client_id: process.env.AUTH_0_CLIENT_ID,
       client_secret: process.env.AUTH_0_CLIENT_SECRET,
       audience: `https://${process.env.AUTH_0_DOMAIN}/api/v2/`,
       scope: 'update:users update:users_app_metadata'
     },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body)
    var opts = {
    method: 'PATCH',
    url: `https://${process.env.AUTH_0_DOMAIN}/api/v2/users/${userId}`,
    headers: {
      'Authorization': `Bearer ${body.access_token}`,
      'content-type': 'application/json'
    },
    body: {
      email,
    },
    json: true
    };
    request(opts, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      resolve()
    });
  });
})
}

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
        const userId = event.pathParameters.id;
        const updates = data;

        if (updates.email && updates.userSub) {
          await updateUserEmail({ userId: updates.userSub, email: updates.email });
        }
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updates, { new: true });
        callback(null, success(updatedUser))
    })
    .catch(err => {
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
