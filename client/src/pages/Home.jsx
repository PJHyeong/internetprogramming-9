import React, { useEffect, useState } from "react";
import "./Home.css";
import Card from "../components/Card";
import Header from "../components/Header";
import postData from '../mock/postData.json';
import loginUser from '../mock/loginUser.json';
import Search from "../components/Search";
import { fetchPosts } from "../api/postAPI";
import StudyWritePage from "./StudyWritePage";

function Home() {
  const [posts, setPosts] = useState(postData);
  const [keyword, setKeyword] = useState(""); //검색어
  const [toggle, setToggle] = useState("ALL"); //ALL, MY 토글 버튼
  const [sortValue, setSortValue] = useState("title"); // 드롭다운 value
  const [isWriteOpen, setIsWriteOpen] = useState(false);

  // useEffect(() => {
  // const getData = async () => {
  //   try {
  //     const response = await fetchPosts(toggle, sortValue, keyword);
  //     setPosts(response.data); // 서버에서 받아온 게시글 저장
  //     console.log("데이터: ", response.data);
  //   } catch(err) {
  //     console.log("fetching data error: ", err);
  //   }
  // };
  // getData();
// }, [toggle, sortValue, keyword]);


  // 게시물 토글 버튼, 검색창 필터 구현. 
  const filteredPosts = posts
    .filter(post => (toggle === "ALL") || (loginUser.userId === post.userId))
    .filter(post => post.title.toLowerCase().includes(keyword.toLowerCase()));

  //정렬 기능 구현.
  const sortedPosts = [...filteredPosts].sort((a,b) => {
    if(sortValue === 'title'){
      return a.title.localeCompare(b.title);
    } else if(sortValue === 'day'){
      return new Date(b.deadline) - new Date(a.deadline);
    }
  });

  return (
    <>
      <Header />
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
          <button className="write-button" onClick={() => setIsWriteOpen(true)}>게시물 작성</button>
        </div>
        <div className="card-container">
          {
            sortedPosts.map((post) => ( //mock data-> sortedPosts.map, API -> posts
              <Card key={post.id} post={post}/>
            ))
          }
        </div>
      </div>
      {isWriteOpen && (
        <StudyWritePage 
          setIsOpen={setIsWriteOpen} 
          onSubmit={(newPost) => setPosts(prev => [...prev, newPost])} 
        />
      )}
    </>
  )
}

export default Home;
