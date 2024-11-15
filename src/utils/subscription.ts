import axios from 'axios';
import toast from 'react-hot-toast';

export const handleSubscription = async (price: number, plan: string) => {
  try {
    const response = await axios.get('/api/stripe', {
      params: {
        price,
        plan,
      },
    });

    if (response.data.error) {
      toast.error('Error fetching subscription: ' + response.data.error);
      return;
    }

    window.location.href = response.data.url;
  } catch (error: any) {
    console.log(error);

    toast.error('Error fetching subscription: ' + error.response.data.error);
  }
};
