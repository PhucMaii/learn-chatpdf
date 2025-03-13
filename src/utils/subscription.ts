import axios from 'axios';
import toast from 'react-hot-toast';

export const handleSubscription = async (price: number, plan: string, discountId: string = '') => {
  try {
    const response = await axios.get('/api/stripe', {
      params: {
        price,
        plan,
        discountId
      },
    });

    if (response.data.error) {
      toast.error('Fail to check subscription');
      return;
    }

    window.location.href = response.data.url;
  } catch (error: any) {
    console.log(error);
    toast.error('Fail to check subscription');
  }
};
