import axios from 'axios';
import generateUserToken from './generate-user-token';
let modulePromise;

const emailTrim = email => email.substring(0, email.indexOf('@'));


const createAccount = async ({ email }, promise) => {
  modulePromise = promise;
  try {
    const accessToken = await generateUserToken();
    const user = {
    "user_id": "",
    "connection": "Username-Password-Authentication",
    "email": email,
    "username": emailTrim(email),
    "name": emailTrim(email),
    "password": "p@ssw0rd"
  };
  axios({
    method: 'POST',
    url:`https://${process.env.AUTH_0_DOMAIN}/api/v2/users`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'content-type': 'application/json'
    },
    data: user,
    json: true
  })
  .then(res => modulePromise.resolve(res))
  .catch(err => {
    console.log(err)
    modulePromise.reject(err)
  });
  } catch (exception) {
    modulePromise.reject({
      type: 'handleCreateAccount.createAccount',
      reason: exception,
    });
  }
};

const handleCreateAccount = ({ email }) => new Promise((resolve, reject) => {
  createAccount({ email }, { resolve, reject });
});

export default handleCreateAccount;
