import { withAuthGuard } from "@/utils/guard";
import postHandler from "./POST";
import getHandler from "./GET";

export const POST = withAuthGuard(postHandler);
export const GET = withAuthGuard(getHandler);