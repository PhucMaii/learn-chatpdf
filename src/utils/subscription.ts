import axios from "axios";

export const handleSubscription = async (price: number, plan: string) => {
    try {
      const response = await axios.get('/api/stripe', {
        params: {
            price,
            plan
        }
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.log(error);
    }
  }