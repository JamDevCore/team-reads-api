import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import User from '../../models/User';
import Discussion from '../../models/Discussion';
import Book from '../../models/Book';

const getUserTotals = async ({ user }) => {
  const id = user._id;

  const query = await Book.aggregate([
    {
      $match: { ownerId: id },
    },
    {
      $project: {
        numberOfDiscussions: { $size: '$discussions' },
      },
    },
    {
      $project: {
        discussions: { $sum: '$numberOfDiscussions' },
      },
    },
  ]);
  const insightQuery = await Discussion.aggregate([
    {
      $match: {
        userId: id,
      },
    },
    {
      $project: {
        totalIdeas: { $sum: 'lighbulbs' },
      },
    },
  ]);

  return {
    totalDiscussions: query.length > 0 ? query[0].discussions : 0,
    bookTotal: query.length,
    totalInsights: insightQuery > 0 ? insightQuery[0].totalIdeas : 0,
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
