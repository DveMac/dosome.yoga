import { getVideos } from '../../../lib/model';
import restful, { AppError } from '../../../lib/restful';

export default restful(
  'api/videos',
  { ttl: 3600 },
  {
    get: async (req) => {
      const { tags, duration, filter } = req.query;
      const filterArr = JSON.parse((filter as string) || '[]');
      if (isNaN(Number(duration))) throw new AppError(400, 'Invalid duration specified');
      return getVideos(Array.isArray(tags) ? tags : tags ? [tags] : [], Number(duration), filterArr || []);
    },
  },
);
