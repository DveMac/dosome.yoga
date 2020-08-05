import { NextApiRequest, NextApiResponse } from 'next';

type HttpMethod = 'get' | 'post' | 'delete';

const error = (res, status, message?: string) => {
  res.statusCode = status;
  if (message) res.json({ message });
  res.end();
};

export class AppError extends Error {
  statusCode: number;
  originalError?: Error;

  constructor(code: number, message: string, original?: Error) {
    super(message);
    this.statusCode = code;
    this.originalError = original;
  }
}

export default (
  key: string,
  { ttl }: { ttl?: number },
  handlers: Partial<{ [method in HttpMethod]: (req: NextApiRequest) => any }>,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const meth = req.method.toLowerCase();
    try {
      if (meth in handlers) {
        const result = await handlers[meth](req, res);
        if (ttl) res.setHeader('Cache-Control', `no-cache, max-age=${ttl}`);
        res.statusCode = 200;
        if (result) res.json(result);
        else res.end();
      } else {
        error(res, 404);
      }
    } catch (e) {
      console.error(req.method, key, e.message, e.stack);
      if (e instanceof AppError) {
        error(res, e.statusCode, e.message);
      } else {
        error(res, 500);
      }
    }
  };
};
