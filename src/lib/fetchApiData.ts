import { IncomingMessage } from 'http';

const prod = process.env.NODE_ENV === 'production';

export const fetchApiData = async (req: IncomingMessage, path) => {
  const domain = req ? `${prod ? 'https' : 'http'}://${req.headers.host}` : '';
  const url = `${domain}/api/${path}`;
  const opts: any = { credentials: 'same-origin' };
  try {
    const resp = await fetch(url, opts);
    const json = await resp.json();
    return json;
  } catch (e) {
    console.log('Fetch error', e.message || e);
    return { error: 'Database Error' };
  }
};
