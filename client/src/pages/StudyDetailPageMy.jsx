import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./StudyDetailPage.module.css";
import Header from "../components/Header";
import StudyEditPage from "./StudyEditPage";
import ApplicantListModal from "./ApplicantListModal";
import { fetchPostById } from "../api/posts";
import postData from "../mock/postData.json";

function StudyDetailPageMy() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  //API
  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };
    loadPost();
  }, [id]);

  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  // useEffect(() => {
  //   const findPost = postData.find(post => post.id === Number(id));
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
      <Header onClick={() => {navigate('/')}}/>
      <div className={styles.container}>
        <div className={styles.status}>{isRecruiting ? "모집중" : "모집 마감"}</div>
        <h2 className={styles.title}>{post.title}</h2>

        <div style={{ textAlign: "right", fontSize: 13, color: '#3a3e98', marginBottom: 12 }}>
          <span style={{ cursor: 'pointer', marginRight: 12 }} onClick={() => setIsEditOpen(true)}>
            수정하기
          </span>
          <span style={{ cursor: 'pointer' }}>삭제하기</span>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.writer}>
          {post.name}{" "}
          <span className={styles.tags}>{post.tags?.map((tag) => `#${tag} `)}</span>
        </div>

        <div className={styles.content}>{post.content}</div>

        {post.description && <div className={styles.content}>{post.description}</div>}

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
            <div className={styles.value}>{post.method} / 주 {post.frequency}회</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.label}>지역</div>
            <div className={styles.value}>{post.location}</div>
          </div>
        </div>

        <div className={styles.buttonBox}>
          <button className={styles.button} onClick={() => setIsModalOpen(true)}>신청자 리스트</button>
        </div>
      </div>

      {isEditOpen && <StudyEditPage setIsOpen={setIsEditOpen} />}
      {isModalOpen && <ApplicantListModal onClose={() => setIsModalOpen(false)} postId={post.id} />}
    </>
  );
}

export default StudyDetailPageMy;
