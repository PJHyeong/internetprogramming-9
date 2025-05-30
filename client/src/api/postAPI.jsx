import axiosInstance from "./axiosInstance";

//1. 전체 모집글 리스트 불러오기
export const fetchPosts = async (toggle, sortValue, keyword) => {
  const response = await axiosInstance.get("/posts", {
    params: {
      user: toggle,
      sort: sortValue,
      keyword: keyword,
    },
  });
  return response.data;
};

//2. 특정 ID의 모집글 상세 보기
export const fetchPostById = async (id) => {
  const response = await axiosInstance.get(`/posts/${id}`);
  return response.data;
};

//3. 모집글 등록 (작성)
export const createPost = async (postData) => {
  const response = await axiosInstance.post("/posts", postData);
  return response.data;
};

//4. 모집글 수정
export const updatePost = async (id, postData) => {
  const response = await axiosInstance.put(`/posts/${id}`, postData);
  return response.data;
};

//5. 모집글 삭제
export const deletePost = async (id) => {
  const response = await axiosInstance.delete(`/posts/${id}`);
  return response.data;
};
