import React, { useState } from "react";
import detail from '../assets/detail_polygon.svg';
import style from './Card.module.css';

function Card({post}) {

  //디데이 계산
  const calculateDays = ({post}) => {
    const today = new Date();
    const deadline = new Date(post.deadline);
    const difference = deadline - today;
    const day = Math.ceil(difference/(1000 * 60 * 60 * 24));
    return day;
  }
  const day = calculateDays({post});


  return(
    <div className={style.container}>
      <div className={style['top-container']}>
        <div className={style.day}>{(day >= 0) ? `D-${day}` : "D-0"}</div>
        <div className={style.badge}>
          <div className={style.location}>{post.location}</div>
          <div className={(day >= 0) ? style.recruiting : style.recruitend}>{(day >= 0) ? "모집 중" : "모집 마감"}</div>
        </div>
      </div>
      <div className={style.title}>{post.title}</div>
      <div className={style.tag}>{post.tags.map((tag) => (`#${tag} `))}</div>
      <div className={style['bottom-container']}>
        <div className={style.name}>{post.name}</div>
        <div className={style.detail}>자세히 보기<img src={detail}/></div>
      </div>
    </div>
  )
}
export default Card;