import { withAuthGuard } from "@/utils/guard";
import GETMethod from "./GETMethod";
import POSTMethod from "./POSTMethod";

export const POST = withAuthGuard(POSTMethod);
export const GET = withAuthGuard(GETMethod);