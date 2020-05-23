import { getPracticePlaylist } from '../../../../lib/model';
import restful from '../../../../lib/restful';

export default restful('api/practices/[key]/playlist', {
  get: async (req, res) => {
    const { key } = req.query;
    const plan = await getPracticePlaylist(key as string);
    res.statusCode = 200;
    res.json(plan);
  },
});
