import axios from 'axios';
import { API_URL } from './type';
import toast from 'react-hot-toast';

export const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const checkIsPro = async () => {
  try {
    const response = await axios.get(`${API_URL.USER}/subscription/is-pro`);

    if (response.data.error) {
      toast.error('Error fetching subscription: ' + response.data.error);
      return;
    }

    return response.data.isPro;
  } catch (error) {
    console.log(error);
    toast.error('Error fetching subscription: ' + error);
  }
};

export const checkIsValidToAddMoreChats = async () => {
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

    return trial.isAbleToAddMoreChats;
  } catch (error) {
    console.log(error);
    toast.error('Error fetching subscription: ' + error);
  }
};

export const getIsTrial = async () => {
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
};

export const checkSubscription = async () => {
  try {
    const isPro = await checkIsPro(); // Wait for the async operation to complete
    const isTrial = await getIsTrial();

    return {
      isPro,
      isAbleToAddMoreChats: isTrial.isAbleToAddMoreChats,
      isTrial: isTrial.isTrial,
    };
  } catch (error: any) {
    console.log(error);
    toast.error('Error fetching subscription: ' + error);
  }
};
