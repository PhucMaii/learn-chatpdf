import axios from 'axios';
import { API_URL } from './type';
import toast from 'react-hot-toast';

export const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const checkIsPro = async (guestSessionId?: string) => {
  try {
    const response = await axios.get(
      `${API_URL.USER}/subscription/is-pro?guestSessionId=${guestSessionId}`,
    );

    if (response.data.error) {
      toast.error('Fail to check subscription');
      return;
    }

    return response.data.isPro;
  } catch (error) {
    console.log(error);
    toast.error('Fail to check subscription');
  }
};

export const checkIsValidToAddMoreChats = async (guestSessionId?: string) => {
  try {
    const response = await axios.get(
      `${API_URL.USER}/subscription/is-pro?guestSessionId=${guestSessionId}`,
    );

    if (response.data.error) {
      toast.error('Fail to check subscription');
      return;
    }

    if (response.data.isPro) {
      return true;
    }

    const trial = await getIsTrial();
    if (!trial.isTrial) {
      return false;
    }

    return trial.isAbleToAddMoreChats;
  } catch (error) {
    console.log(error);
    toast.error('Fail to check subscription');
  }
};

export const getIsTrial = async (guestSessionId?: string) => {
  try {
    const response = await axios.get(
      `${API_URL.USER}/subscription/is-trial?guestSessionId=${guestSessionId}`,
    );

    if (response.data.error) {
      toast.error('Fail to check subscription');
      return;
    }

    return response.data;
  } catch (error) {
    console.log(error);
    toast.error('Fail to check subscription');
  }
};

export const checkSubscription = async (guestSessionId?: string) => {
  try {
    const isPro = await checkIsPro(guestSessionId); // Wait for the async operation to complete
    const isTrial = await getIsTrial(guestSessionId);

    console.log({
      isPro,
      isAbleToAddMoreChats: isPro ? true : isTrial.isAbleToAddMoreChats,
      isTrial: isTrial.isTrial,
    });
    return {
      isPro,
      isAbleToAddMoreChats: isPro ? true : isTrial.isAbleToAddMoreChats,
      isTrial: isTrial.isTrial,
    };
  } catch (error: any) {
    console.log(error);
    toast.error('Fail to check subscription');
  }
};
