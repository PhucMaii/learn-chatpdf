import { withAuthGuard } from '@/utils/guard';
import getHandler from './GET';
import postHandler from './POST';

export const GET = withAuthGuard(getHandler);
export const POST = withAuthGuard(postHandler);