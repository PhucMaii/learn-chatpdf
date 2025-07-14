import { withAuthGuard } from "@/utils/guard";
import GETMethod from "./GET";
import POSTMethod from "./POST";

export const POST = withAuthGuard(POSTMethod);
export const GET = withAuthGuard(GETMethod);