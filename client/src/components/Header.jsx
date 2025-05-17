import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <div className="background">
      <div className="container">
        <div className="title">MJU StudyHub</div>
        <div className="button-container">
          <button className="login">로그인</button>
          <button className="join">회원가입</button>
           <Link to="/study/write">
            <button className="write">모집글 작성하기</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header;