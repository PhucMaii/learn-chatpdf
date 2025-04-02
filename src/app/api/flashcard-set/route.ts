import PUTMethod from './PUT';
import { withAuthGuard } from '@/utils/guard';

export const PUT = withAuthGuard(PUTMethod);
