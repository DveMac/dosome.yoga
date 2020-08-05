import { getVideos } from '../../../lib/model';
import restful, { AppError } from '../../../lib/restful';

export default restful(
  'api/videos',
  { ttl: 3600 },
  {
    get: async (req) => {
      const { tags, duration } = req.query;
      if (isNaN(Number(duration))) throw new AppError(400, 'Invalid duration specified');
      return getVideos(Array.isArray(tags) ? tags : tags ? [tags] : [], Number(duration));
    },
  },
);
