import axiosInstance from "./axiosInstance";

export const getFetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

export const postFetcher = (url: string, { arg }: { arg: unknown }) =>
  axiosInstance.post(url, arg).then(res => res.data);