import { createPractice } from '../../../lib/model';
import restful from '../../../lib/restful';

export default restful('api/practices', {
  post: async (req, res) => {
    const { tags, duration } = req.body;
    const schedule = await createPractice(tags, duration);
    res.statusCode = 200;
    res.json(schedule);
  },
});
