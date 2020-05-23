import { getVideos } from '../../../lib/model';
import restful, { AppError } from '../../../lib/restful';

export default restful('api/videos', {
  get: async (req, res) => {
    const { tags, duration = 15 } = req.query;
    if (isNaN(Number(duration))) throw new AppError(400, 'Invalid duration specified');
    const items = await getVideos(Array.isArray(tags) ? tags : (tags ? [tags] : []), Number(duration));
    res.statusCode = 200;
    res.json(items);
  },
});
