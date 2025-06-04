import React, { useEffect, useState } from "react";
import "./Home.css";
import Card from "../components/Card";
import postData from '../mock/postData.json';
import loginUser from '../mock/loginUser.json';
import Search from "../components/Search";
import { fetchPosts } from "../api/postAPI";
import { useNavigate } from "react-router-dom";
import StudyWritePage from "./StudyWritePage";


function Home({user}) {
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState(""); //검색어
  const [toggle, setToggle] = useState("ALL"); //ALL, MY 토글 버튼
  const [sortValue, setSortValue] = useState("title"); // 드롭다운 value
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const userId = user?.userId;

  
// 게시물 목록을 API로부터 가져오는 코드
  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/api/posts");
      // 응답이 배열인지 확인 후 setPosts
      setPosts(Array.isArray(res.data.posts) ? res.data.posts : []);
    } catch (err) {
      setPosts([]); // 에러 발생 시에도 빈 배열로
    }
  };
  fetchPosts();
}, []);

  // // 게시물 토글 버튼, 검색창 필터 구현. 
  // const filteredPosts = postData
  // .filter(post => (toggle === "ALL") || (loginUser.userId === post.userId))
  // .filter(post => post.title.toLowerCase().includes(keyword.toLowerCase()));

  // //정렬 기능 구현.
  // const sortedPosts = [...filteredPosts].sort((a,b) => {
  //   if(sortValue === 'title'){
  //     return a.title.localeCompare(b.title);
  //   } else if(sortValue === 'day'){
  //     return new Date(b.deadline) - new Date(a.deadline);
  //   }
  // })

  return (
    <>
      <div className="container">
        <div className="top-container">
          <div className="button-container">
            <button className={`toggle-all ${toggle === "ALL" ? "active" : ""}`} onClick={() => setToggle("ALL")}>ALL</button>
            <button className={`toggle-my ${toggle === "MY" ? "active" : ""}`} onClick={() => setToggle("MY")}>MY</button>
            <select className="dropdown" value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
              <option value="title">제목순</option>
              <option value="day">디데이순</option>
            </select>
          </div>
          <Search keyword={keyword} setKeyword={setKeyword}/>
          <button className="write-button" onClick={() => {setIsOpen(true)}}>게시물 작성</button>
          {isOpen && <StudyWritePage setIsOpen={setIsOpen} user={user}/>}
        </div>
        <div className="card-container">
          {
            posts.map((post) => ( //mock data-> sortedPosts.map, API -> posts.map
              <Card key={post.id} post={post} onClick={()=>{toggle === "ALL" ? navigate(`/post/${post.id}`) : navigate(`/post/${post.id}/my`)}}/>
            ))
          }
        </div>
      </div>
    </>
  )
}
export default Home;