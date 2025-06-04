import axiosInstance from "./axiosInstance";

//필터 기능
export const fetchPosts = async (toggle, sortValue, keyword, userId) => {
  const response = await axiosInstance.get("/api/posts",{
    params: {
      user: toggle, //ALL MY 토글 버튼
      sort: sortValue, //dropdown
      keyword: keyword, //검색창
      userId: userId
    }
  });
  return response.data;
};

//모집글 신청하기 API
export const applyAPI = async (postId, userId) => {
  const response = await axiosInstance.post(`/study/${postId}/apply`, {
    userId,
  });
  return response.data;
}

//2. 특정 ID의 모집글 상세 보기
export const fetchPostById = async (id) => {
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};

//3. 모집글 등록 (작성)
export const createPost = async (postData) => {
  const response = await axiosInstance.post("", postData);
  return response.data;
};

//4. 모집글 수정
export const updatePost = async (id, postData) => {
  const response = await axiosInstance.put(`/${id}`, postData);
  return response.data;
};

//5. 모집글 삭제
export const deletePost = async (id) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};
