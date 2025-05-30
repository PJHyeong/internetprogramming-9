import React from "react";
import { useNavigate } from "react-router-dom"; 
import detail from '../assets/detail_polygon.svg';
import style from './Card.module.css';

function Card({ post }) {
  const navigate = useNavigate(); 

  // 디데이 계산
  const calculateDays = (post) => {
    const today = new Date();
    const deadline = new Date(post.deadline);
    const difference = deadline - today;
    const day = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return day;
  };
  const day = calculateDays(post);

  //  내 글이면 MY 페이지로 이동
  const isMine = post.name === "홍길동";

  return (
    <div className={style.container}>
      <div className={style['top-container']}>
        <div className={style.day}>{(day >= 0) ? `D-${day}` : "D-0"}</div>
        <div className={style.badge}>
          {post.location && <div className={style.location}>{post.location}</div>}
          <div className={(day >= 0) ? style.recruiting : style.recruitend}>
            {(day >= 0) ? "모집 중" : "모집 마감"}
          </div>
        </div>
      </div>

      <div className={style.title}>{post.title}</div>
      <div className={style.tag}>{post.tags.map((tag) => `#${tag} `)}</div>

      <div className={style['bottom-container']}>
        <div className={style.name}>{post.name}</div>

        {/*  조건 분기: 내 글이면 /study/my/:id 로 이동 */}
        <div
          className={style.detail}
          onClick={() => navigate(isMine ? `/study/my/${post.id}` : `/study/${post.id}`)}
          style={{ cursor: "pointer" }}
        >
          자세히 보기<img src={detail} alt=">" />
        </div>
      </div>
    </div>
  );
}

export default Card;
