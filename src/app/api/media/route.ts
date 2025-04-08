import { withAuthGuard } from "@/utils/guard";
import GETMethod from "./GETMethod";
import DELETEMethod from "./DELETEMethod";

export const GET = withAuthGuard(GETMethod);
export const DELETE = withAuthGuard(DELETEMethod);