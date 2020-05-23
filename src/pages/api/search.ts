import { searchVideos } from '../../lib/model';
import restful, { AppError } from '../../lib/restful';

export default restful('api/search', {
  get: async (req, res) => {
    throw new Error('Unauthorized');
    const { query } = req.query;
    if (!query) throw new AppError(400, 'Invalid query specified');
    const items = await searchVideos(query);
    res.statusCode = 200;
    res.json(items);
  },
});
