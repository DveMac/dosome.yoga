import { getTags } from '../../lib/model';
import restful from '../../lib/restful';

export default restful(
  'api/tags',
  { ttl: 86400 },
  {
    get: async () => {
      return getTags();
    },
  },
);
