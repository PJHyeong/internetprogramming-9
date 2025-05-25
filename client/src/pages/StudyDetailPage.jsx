import React from "react";
import { useParams } from "react-router-dom";
import postData from "../mock/postData.json";
import styles from "./StudyDetailPage.module.css";
import Header from "../components/Header";

function StudyDetailPage() {
  const { id } = useParams();
  const post = postData.find((p) => String(p.id) === id);

  if (!post) return <div>게시물을 찾을 수 없습니다.</div>;

  // D-day 기준 모집 상태 판별
  const calculateDday = (deadline) => {
    const today = new Date();
    const dday = new Date(deadline);
    const diff = dday - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const isRecruiting = calculateDday(post.deadline) >= 0;

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.status}>
          {isRecruiting ? "모집중" : "모집 마감"}
        </div>

        <h2 className={styles.title}>{post.title}</h2>
        <div className={styles.divider}></div>

        <div className={styles.writer}>
          {post.name}{" "}
          <span className={styles.tags}>
            {post.tags.map((tag) => `#${tag} `)}
          </span>
        </div>

        <div className={styles.content}>{post.content}</div>

        {post.description && (
          <div className={styles.content}>{post.description}</div>
        )}

        <div className={styles.divider}></div>

        <div className={styles.section}>
          <div>
            <div className={styles.label}>모집 인원</div>
            <div className={styles.value}>최소 {post.maxPeople}명</div>
          </div>
          <div>
            <div className={styles.label}>모집 기간</div>
            <div className={styles.value}>{post.deadline}</div>
          </div>
          <div>
            <div className={styles.label}>진행 방식</div>
            <div className={styles.value}>
              {post.method} / 주 {post.frequency}회
            </div>
          </div>
          <div>
            <div className={styles.label}>지역</div>
            <div className={styles.value}>{post.location}</div>
          </div>
        </div>

        <div className={styles.buttonBox}>
          <button className={styles.button}>신청하기</button>
        </div>
      </div>
    </>
  );
}

export default StudyDetailPage;
