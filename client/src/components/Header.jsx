import React from "react";
import "./Header.css";

function Header() {
  return (
    <div className="background">
      <div className="container">
        <div className="title">MJU StudyHub</div>
        <div className="button-container">
          <button className="login">로그인</button>
          <button className="join">회원가입</button>
        </div>
      </div>
    </div>
  )
}

export default Header;