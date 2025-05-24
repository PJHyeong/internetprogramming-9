import React, {useState} from "react";
import login from './LoginModal.module.css';
import close from "../assets/close.svg";
import { loginAPI } from "../api/loginAPI";

function LoginModal({onClose, onLogin}){
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);

  //서버에 로그인 요청
  const handleSubmit = async () => {
    const login = await loginAPI(userId, password);
    if(login.success){
      if(autoLogin) localStorage.setItem("autoLogin", "true");
      else localStorage.removeItem("autoLogin");
      alert("로그인 되었습니다.");
      onLogin(true);
      onClose();
    }else {
      alert("로그인에 실패 하였습니다. 다시 한 번 확인해 주세요.");
    }
  }

  return (
    <div className={login.overlay}>
      <div className={login.container}>
        <div className={login["close-button"]} onClick={() => onClose(false)}>
          <img src={close} alt="close"/>
        </div>
        <div className={login.title}>로그인</div>
        <div className={login["login-container"]}>
          <input 
          placeholder="아이디를 입력해 주세요." 
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          />
          <input 
          type="password"
          placeholder="비밀번호를 입력해 주세요." 
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          <div>
            <label className={login["auto-container"]}>
              <input type="checkbox" checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}/>
              <span>
                자동 로그인
              </span>
            </label>
          </div>
          <button onClick={handleSubmit}>로그인</button>
        </div>
      </div>
    </div>
  )
}
export default LoginModal;