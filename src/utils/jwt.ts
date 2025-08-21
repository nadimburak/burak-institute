import axiosAuthInstance from "./axiosAuthInstance";
import axiosInstance from "./axiosInstance";
// import axiosLocationInstance from "./axiosLocationInstance";
// import axiosUploadInstance from "./axiosUploadInstance";

export const setSession = (accessToken: string | null): void => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;
    axiosAuthInstance.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;
    // axiosLocationInstance.defaults.headers.common["Authorization"] =
    //   `Bearer ${accessToken}`;
    // axiosUploadInstance.defaults.headers.common["Authorization"] =
    //   `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
    // delete axiosUploadInstance.defaults.headers.common["Authorization"];
    delete axiosAuthInstance.defaults.headers.common["Authorization"];
    // delete axiosLocationInstance.defaults.headers.common["Authorization"];
  }
};

export const getSession = (): string | null => {
  const accessToken = localStorage.getItem("accessToken");
  axiosInstance.defaults.headers.common["Authorization"] =
    `Bearer ${accessToken}`;
  // axiosUploadInstance.defaults.headers.common["Authorization"] =
  //   `Bearer ${accessToken}`;
  axiosAuthInstance.defaults.headers.common["Authorization"] =
    `Bearer ${accessToken}`;
  // axiosLocationInstance.defaults.headers.common["Authorization"] =
  //   `Bearer ${accessToken}`;
  return accessToken;
};
