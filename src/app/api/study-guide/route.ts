import { withAuthGuard } from "@/utils/guard";
import POSTMethod from "./POSTMethod";
import GETMethod from "./GETMethod";
import PUTMethod from "./PUTMethod";

export const POST = withAuthGuard(POSTMethod);
export const GET = withAuthGuard(GETMethod);
export const PUT = withAuthGuard(PUTMethod);