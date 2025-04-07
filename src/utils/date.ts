import moment from "moment";

export const convertToFromNow = (date: Date | string) => {
  return moment(new Date(date)).fromNow();
};
