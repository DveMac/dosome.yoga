// Import built-in types for API routes
import { NextApiRequest, NextApiResponse } from 'next';
import { EnumChangefreq, SitemapStream } from 'sitemap';
import { createGzip } from 'zlib';
import { TIME_INTERVALS } from '../../lib/constants';
import { fetchApiData } from '../../lib/fetchApiData';
import { buildUrl } from '../../lib/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!res) return {};
  try {
    // Set response header
    res.setHeader('content-type', 'application/xml');
    res.setHeader('Content-Encoding', 'gzip');

    const smStream = new SitemapStream({
      hostname: 'https://www.dosome.yoga',
    });

    const pipeline = smStream.pipe(createGzip());

    smStream.write({ url: '/', lastmod: process.env.siteUpdatedAt, changefreq: EnumChangefreq.WEEKLY });
    smStream.write({ url: '/practice/new', lastmod: process.env.siteUpdatedAt, changefreq: EnumChangefreq.MONTHLY });

    const [tags] = await Promise.all([fetchApiData(req, `tags`)]);
    TIME_INTERVALS.forEach((duration) => {
      tags.forEach((tag) => {
        smStream.write({
          url: buildUrl(duration, tag.name),
          changefreq: EnumChangefreq.WEEKLY,
        });
      });
    });

    smStream.end();

    // cache the response
    // streamToPromise
    // streamToPromise(pipeline).then(sm => {
    //   res.send(sm);
    // });
    // stream the response
    pipeline.pipe(res).on('error', (e) => {
      throw e;
    });
  } catch (e) {
    res.status(500).end();
  }
};
