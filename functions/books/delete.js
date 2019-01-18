import { connectToDatabase } from '../../utility/db-connect';
import { success, failure } from '../../utility/db-response';
import Book from '../../models/Book';
import Discussion from '../../models/Discussion';
import Comment from '../../models/Comment';

const removeDiscussions = async (discussions) => {
  try {
    await discussions.forEach(async (discussionId) => {
      console.log(discussionId)
      const discussion = await Discussion.findOneAndDelete({ _id: discussionId });
      discussion.comments.forEach(async (commentId) => {
        await Comment.findOneAndDelete({ _id: commentId })
      });
    })
  } catch (exception) {
    console.log(exception);
    throw new Error(exception);
  }
}

export function main(event, context, callback) {
  // /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }
  context.callbackWaitsForEmptyEventLoop = false;
  // // Request body is passed in as a JSON encoded string in 'event.body'

  const bookId = event.pathParameters.id;
  connectToDatabase()
    .then(async () => {
      const book = await Book.findOneAndDelete({ _id: bookId });
      if (book && book.discussions && book.discussions.length > 0) {
        await removeDiscussions(book.discussions);
      }
      callback(null, success(book));
    })
    .catch((err) => {
      console.log(err);
      callback(null, failure({
        status: false,
        error: err.message
      }))
    });
}
export default main;
