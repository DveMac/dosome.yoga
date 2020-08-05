import { addFeedback } from '../../../../lib/model';
import restful, { AppError } from '../../../../lib/restful';

const tryParse = (s: string) => {
  try {
    return JSON.parse(s);
  } catch (e) {
    return {};
  }
};

export default restful(
  'api/videos/[videoId]/feedback',
  {},
  {
    post: async (req) => {
      const { videoId } = req.query;
      const { rate, position, key } = req.body;
      if (!videoId || typeof rate === 'undefined' || typeof position === 'undefined')
        throw new AppError(400, 'Bad Request');
      await addFeedback(videoId as string, key, rate, position);
      return;
    },
  },
);
