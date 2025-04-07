import { withAuthGuard } from "@/utils/guard";
import POSTMethod from "./POSTMethod";
import GETMethod from "./GETMethod";
import DELETEMethod from "./DELETEMethod";
import PUTMethod from "./PUTMethod";

export const POST = withAuthGuard(POSTMethod);
export const GET = withAuthGuard(GETMethod);
export const DELETE = withAuthGuard(DELETEMethod);
export const PUT = withAuthGuard(PUTMethod);