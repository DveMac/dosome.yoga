import { getPracticePlaylist } from '../../../../lib/model';
import restful from '../../../../lib/restful';

export default restful(
  'api/practices/[key]/playlist',
  {},
  {
    get: async (req) => {
      const { key } = req.query;
      return getPracticePlaylist(key as string);
    },
  },
);
