import { withAuthGuard } from "@/utils/guard";
import POSTMethod from "./POSTMethod";
import GETMethod from "./GETMethod";

export const POST = withAuthGuard(POSTMethod);
export const GET = withAuthGuard(GETMethod);