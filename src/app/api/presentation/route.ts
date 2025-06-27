import { withAuthGuard } from '@/utils/guard';
import postMethod from './POST';

export const POST = withAuthGuard(postMethod);