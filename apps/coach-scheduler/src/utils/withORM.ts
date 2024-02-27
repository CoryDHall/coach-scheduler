import { MikroORM, RequestContext } from '@mikro-orm/core';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace global {
  export let __ORM__: MikroORM;
}

export const getORM = async () => {
  if (!global.__ORM__) {
    const config = await import('../../mikro-orm.config').then(m => m.default);
    global.__ORM__ = await MikroORM.init(config);
    await global.__ORM__.getSchemaGenerator().updateSchema().catch(console.error);
  }
  return global.__ORM__;
}
type _unary_handler_t = (req: NextApiRequest) => (Promise<Response>);

type handler_t = NextApiHandler | _unary_handler_t;
export function withORM (handler: handler_t) {
  return async <T>(req: NextApiRequest, res: NextApiResponse<T>) => {
    const orm = await getORM();
    return RequestContext.create(orm.em, () => handler(req, res));
  }
}

export default withORM;
