import axiosInstance from "./axiosInstance";

export const fetchPostById = async (id) => {
  const response = await axiosInstance.get(`/api/posts/${id}`);
  return response.data;
};
