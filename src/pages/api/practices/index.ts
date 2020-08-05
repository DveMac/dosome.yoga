import { createPractice } from '../../../lib/model';
import restful from '../../../lib/restful';

export default restful(
  'api/practices',
  {},
  {
    post: async (req) => {
      const { tags, duration } = req.body;
      return await createPractice(tags, duration);
    },
  },
);
