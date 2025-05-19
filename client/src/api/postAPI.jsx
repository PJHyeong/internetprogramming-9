import axiosInstance from "./axiosInstance";

//필터 기능
export const fetchPosts = async (toggle, sortValue, keyword) => {
  const response = await axiosInstance.get("",{
    params: {
      user: toggle, //ALL MY 토글 버튼
      sort: sortValue, //dropdown
      keyword: keyword //검색창
    }
  });
  return response.data;
};
