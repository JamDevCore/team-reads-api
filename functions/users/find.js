import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import User from '../../models/User';
import Discussion from '../../models/Discussion';
import Book from '../../models/Book';

const getUserTotals = async ({ user }) => {
  const id = user._id;

  const bookTotal = await Book.find({ ownerId: id }).count();
  const query = await Discussion.aggregate([
    {
      $match: {
        userId: id,
      },
    },
    {
      $group: {
        _id: null,
        discussions: { $sum: 1 },
        totalIdeas: { $sum: '$ideas' },
      },
    },
  ]);
  return {
    discussionTotal: query[0].discussions,
    bookTotal,
    insightTotal: query[0].totalIdeas,
  };
};
export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return callback(null, 'Lambda is warm!');
  }

  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(async () => {
      const userId = event.pathParameters.id;
      const user = await User.findOne({ _id: userId });
      const totals = await getUserTotals({ user });
      console.log(totals);
      callback(null, success({
        totals,
        user,
      }));
    })
    .catch((err) => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message
      }));
    });
}
