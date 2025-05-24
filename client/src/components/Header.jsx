import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import LoginModal from "../modal/LoginModal";
import SignUpModal from "../modal/signUpModal";
import { logoutAPI } from "../api/loginAPI";

function Header() {
  const [loginModal, setLoginModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  const closeLoginModal = () => setLoginModal(false);
  const closeSignUpModal = () => setSignUpModal(false);

 const handleLogout = async () => {
  try {
    const result = await logoutAPI();
    if (result.success) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("autoLogin");
      setIsLoggedIn(false);
    } else {
      alert(result.error || "로그아웃에 실패했습니다.");
    }
  } catch (error) {
    alert("로그아웃 중 오류가 발생했습니다.");
    console.error(error);
  }
};

  return (
    <div className="background">
      <div className="container">
        <div className="title">MJU StudyHub</div>
        <div className="button-container">
          {isLoggedIn ? (
            <button className="logout" onClick={handleLogout}>로그아웃</button>
          ) : (
          <>
            <button className="login" onClick={() => setLoginModal(true)}>로그인</button>
            {loginModal && <LoginModal onClose={closeLoginModal} onLogin={isLoggedIn}/>}
            <button className="join" onClick={() => setSignUpModal(true)}>회원가입</button>
            {signUpModal && <SignUpModal onClose={closeSignUpModal}/>}
          </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header;