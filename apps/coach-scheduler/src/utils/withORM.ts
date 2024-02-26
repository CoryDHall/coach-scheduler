import { MikroORM, RequestContext } from '@mikro-orm/core';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

namespace global {
  export let __ORM__: MikroORM;
}

const getORM = async () => {
  if (!global.__ORM__) {
    const config = await import('../../mikro-orm.config').then(m => m.default);
    global.__ORM__ = await MikroORM.init(config).then(async orm => {
      await orm.getSchemaGenerator().updateSchema();
      return orm;
    });
  }
  return global.__ORM__;
}

export const withORM = (handler: NextApiHandler) => async <T>(req: NextApiRequest, res: NextApiResponse<T>) => {
  const orm = await getORM();
  return RequestContext.create(orm.em, () => handler(req, res));
}

export default withORM;
