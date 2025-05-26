import { BrowserRouter, Routes, Route } from "react-router-dom";
import { refreshTokenAPI } from "./api/loginAPI";
import { useEffect } from "react";
import Home from "./pages/Home";

function Main() {

  // //자동 로그인 시도
  // useEffect(() => {
  //   const tryAutoLogin = async () => {
  //     const autoLogin = localStorage.getItem("autoLogin");
  //     if (autoLogin === "true") {
  //       const success = await refreshTokenAPI();
  //       if (!success) {
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("autoLogin");
  //       }}
  //   };
  //   tryAutoLogin();
  // }, []);

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route />
    </Routes>
    </BrowserRouter>
  )
}

export default Main;