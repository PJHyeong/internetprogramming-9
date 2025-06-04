import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPostById } from "../api/posts";
import styles from "./StudyDetailPage.module.css";
import Header from "../components/Header";
import postData from "../mock/postData.json";

function StudyDetailPage({user}) {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  //게시글 조회
  useEffect(() => {
    fetchPostById(id)
      .then(setPost)
      .catch((err) => console.log("게시글 불러오기 오류", err));
  }, [id]);
  if (!post) return <div>불러오는 중...</div>;

  const handleSubmit = async () => {
    if(!user?.id){
      alert("로그인을 진행해 주세요.");
      return;
    }
    try{
      const response = await applyAPI(post.id, user.userId);
      if(response.success){
        alert("신청 완료되었습니다.")
      } else {
        alert(response.message || "오류가 발생하였습니다.");
      }
    }catch(err){
      console.log("신청 오류", err);
      alert("오류 발생.");

    }
  }

  //mockData 기반 게시글 아이디 찾기
  // useEffect(() => {
  //   const findPost = postData.find((post) => post.id === Number(id));
  //   setPost(findPost);
  // }, []);

  const calculateDday = (deadline) => {
    const today = new Date();
    const dday = new Date(deadline);
    const diff = dday - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isRecruiting = calculateDday(post.deadline) >= 0;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.status}>
          {isRecruiting ? "모집중" : "모집 마감"}
        </div>
        <h2 className={styles.title}>{post.title}</h2>
        <div className={styles.divider}></div>
        <div className={styles.writer}>
          {post.name}{"  "}
        </div>
          <span className={styles.tags}>
            {post.tags?.map((tag) => `#${tag} `)}
          </span>

        {post.content && (
          <div className={styles.content}>{post.content}</div>
        )}

        <div className={styles.divider}></div>

        <div className={styles.infoBox}>
          <div className={styles.infoItem}>
            <div className={styles.label}>모집 인원</div>
            <div className={styles.value}>최소 {post.maxPeople}명</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>모집 기간</div>
            <div className={styles.value}>{post.deadline}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>진행 방식</div>
            <div className={styles.value}>
              {post.method} / 주 {post.frequency}회
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>지역</div>
            <div className={styles.value}>{post.location}</div>
          </div>
        </div>

        <div className={styles.buttonBox}>
          <button className={styles.button} onClick={handleSubmit}>신청하기</button>
        </div>
      </div>
    </>
  );
}

export default StudyDetailPage;
