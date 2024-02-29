import { MikroORM, RequestContext } from '@mikro-orm/core';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { NextRequest } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace global {
  export let __ORM__: MikroORM;
}

export const getORM = async () => {
  if (!global.__ORM__) {
    const config = await import('../../mikro-orm.config').then(m => m.default);
    const orm = await MikroORM.init(config);
    await orm.schema.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await orm.getSchemaGenerator().updateSchema().catch(console.error);
    global.__ORM__ = orm;
  }
  return global.__ORM__;
}
type _unary_handler_t<R> = (req: R) => (Promise<Response>);
type _binary_handler_t<R> = (req: R, res: NextApiResponse) => (Promise<unknown>);

type handler_t<R> = _binary_handler_t<R> | _unary_handler_t<R>;
export function withORM<R extends NextApiRequest | Request | NextRequest>(handler: handler_t<R>) {
  return async <T>(req: R, res: NextApiResponse<T>) => {
    const orm = await getORM();
    return RequestContext.create(orm.em, () => handler(req, res));
  }
}

export default withORM;
