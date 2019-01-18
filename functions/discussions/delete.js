import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Discussion from '../../models/Discussion';
import Book from '../../models/Book';
import Comment from '../../models/Comment';

const removeComments = async (comments) => {
  try {
    await comments.forEach(async (commentId) => {
      await Comment.findOneAndDelete({ _id: commentId });
    })
  } catch (exception) {
    console.log(exception);
    throw new Error(exception);
  }
};

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(async () => {
      const discussionId = event.pathParameters.id;
      const discussion = await Discussion.findOneAndDelete({ _id: discussionId });
      await Book.findOneAndUpdate({ _id: discussion.bookId }, {
        $pull: {
          discussions: discussionId,
        },
      });
      if (discussion && discussion.comments && discussion.comments.length > 0) {
        await removeComments(discussion.comments);
      }
      callback(null, success(discussion))
    })
    .catch((err) => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message,
      }));
    });
}
