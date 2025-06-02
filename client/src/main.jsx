import { BrowserRouter, Routes, Route } from "react-router-dom";
import { refreshTokenAPI } from "./api/loginAPI";
import { useEffect } from "react";
import Home from "./pages/Home";
import StudyDetailPage from "./pages/StudyDetailPage";
import StudyDetailPageMy from "./pages/StudyDetailPageMy";

function Main({ onLogin, user }) {

  //자동 로그인 시도
  useEffect(() => {
    console.log("main useEffect 실행.");
    const tryAutoLogin = async () => {
      const autoLogin = localStorage.getItem("autoLogin");
      console.log("자동 로그인 여부 :",autoLogin);
      if (autoLogin === "true") {
        const success = await refreshTokenAPI();
        onLogin(success.user);
        if (!success) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("autoLogin");
        }}
    };
    tryAutoLogin();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home user={user}/>}/>
      <Route path="/post/:id" element={<StudyDetailPage user={user}/>}/>
      <Route path="/post/:id/my" element={<StudyDetailPageMy user={user}/>}/>
    </Routes>
  )
}

export default Main;