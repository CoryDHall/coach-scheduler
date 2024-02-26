import { CoachUser } from "../../../entities/Coach.entity";
import getEm from "../../../utils/getEm";
import withORM from "../../../utils/withORM";
import { NextApiRequest, NextApiResponse } from "next";

async function Index(_req: NextApiRequest, res: NextApiResponse<CoachUser[]>) {
  console.debug(res);
  const em = getEm();
  console.log('em', em);
  const coaches = await em.find(CoachUser, {});
  // res.setHeader("Content-Type", "application/json")
  // return (res as NextApiResponse).json(coaches);
  // res.end(JSON.stringify(coaches));
  return new Response(JSON.stringify(coaches));
}

// export const GET = async (req: Request) => {
//   const em = getEm();
//   const coaches = await em.findAll(CoachUser);
//   return new Response(JSON.stringify(coaches));
// };

// export default withORM(Index);
export const GET = withORM(Index);
