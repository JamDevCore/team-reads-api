import request from 'request'

const generateUserToken = () => {
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
       scope: 'create:users'
     },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log('recieved', body.access_token)
    return resolve(body.access_token);
  });
})
}

export default generateUserToken;
