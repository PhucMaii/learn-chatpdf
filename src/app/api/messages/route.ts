import { withAuthGuard } from "@/utils/guard";
import GETMethod from "./GETMethod";

export const GET = withAuthGuard(GETMethod);