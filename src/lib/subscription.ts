import axios from 'axios';
import { API_URL } from './type';
import toast from 'react-hot-toast';

export const DAY_IN_MS = 24 * 60 * 60 * 1000;

// export const checkSubscription = async () => {
//   const { userId } = await auth();

//   if (!userId) {
//     return false;
//   }
//   const _userSubscriptions: any = await db
//     .select()
//     .from(userSubscriptions)
//     .where(eq(userSubscriptions.userId, userId));

//   if (!_userSubscriptions[0]) {
//     return false;
//   }

//   const userSubscription = _userSubscriptions[0];

//   const isValid =
//     userSubscription.stripePriceId &&
//     userSubscription?.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS >
//       Date.now();

//   return !!isValid;
// };

export const checkSubscription = async () => {
  try {
    const response = await axios.get(`${API_URL.USER}/subscription/is-pro`);
    
    if (response.data.error) {
      toast.error('Error fetching subscription: ' + response.data.error);
      return;
    }

    if (response.data.isPro) {
      return true;
    }

    const trial = await getIsTrial();
    if (!trial.isTrial) {
      return false;
    }
    
    console.log(trial,' istrial from response');
    return trial.isAbleToAddMoreChats;
  } catch (error) {
    console.log(error);
    toast.error('Error fetching subscription: ' + error);
  }
}

const getIsTrial = async () => {
  try {
    const response = await axios.get(`${API_URL.USER}/subscription/is-trial`);
    
    if (response.data.error) {
      toast.error('Error fetching subscription: ' + response.data.error);
      return;
    }
    
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error('Error fetching subscription: ' + error);
  }
}