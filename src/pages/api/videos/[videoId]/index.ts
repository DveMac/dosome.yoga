import { getVideo } from '../../../../lib/model';
import restful, { AppError } from '../../../../lib/restful';

export default restful(
  'api/videos/[videoId]',
  { ttl: 3600 },
  {
    get: async (req) => {
      const { videoId } = req.query;
      if (!videoId) throw new AppError(400, 'Bad Request');
      return getVideo(videoId as string);
    },
  },
);
