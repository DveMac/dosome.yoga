import { getTags } from '../../lib/model';
import restful from '../../lib/restful';

export default restful('api/tags', {
  get: async (req, res) => {
    const items = await getTags();
    res.statusCode = 200;
    res.json(items);
  },
});
