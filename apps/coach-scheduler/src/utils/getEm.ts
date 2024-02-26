import { RequestContext }  from "@mikro-orm/core";

export const getEm = () => {
  const em = RequestContext.getEntityManager();
  if (!em) {
    throw new Error("EntityManager not found in RequestContext");
  }
  return em;
}

export default getEm;
