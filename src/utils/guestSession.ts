import { NextResponse } from "next/server";
import { getQueryParams } from "./query";

export const withGuestSession = (handler: any) => async (req: Request, res: NextResponse) => {
  const guestSessionId = getQueryParams(req, 'guestSessionId');
  return handler(req, res, guestSessionId);
};
