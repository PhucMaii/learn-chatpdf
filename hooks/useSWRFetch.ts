import axios from "axios";
import useSWR from 'swr';

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const SWRFetchData = (api: string) => {
    const { data, mutate, isValidating } = useSWR(api, fetcher, {
      refreshInterval: 1000,
    });
  
    return [data, mutate, isValidating];
  };
  