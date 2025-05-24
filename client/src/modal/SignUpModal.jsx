import React, {useState} from "react";
import join from './SignUpModal.module.css';
import close from "../assets/close.svg";
import { signUpAPI, userIdAPI } from "../api/loginAPI";

function SignUpModal({onClose}){
  const [rePassword, setRePassword] = useState("");
  const [checkColor, setCheckColor] = useState("");
  const [checkMessage, setCheckMessage] = useState("");
  const [idChecked,setIdChecked] = useState(false);
  const [form, setForm] = useState({
  userId: "",
  password: "",
  email: "",
  name: "",
  studentNumber: "",
});
  const { userId, password, email, name, studentNumber } = form;

  //아이디 중복 확인
  const handleIdCheck = async () => {
    const result = await userIdAPI(userId);

    setCheckColor(result.success ? "green" : "red");
    setCheckMessage(result.message);
    setIdChecked(result.success);

    }

  //회원가입 제출
  const handleSubmit = async () => {
    const result = await signUpAPI(form);

    if(result.success){
      alert("회원가입을 완료하였습니다.");
      onClose();
    }else{
      alert(result.error);
      //에러 메세지 출력
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //입력값 유효성 검사, 제출 버튼 활성화 유무
  const isFormValid =
  userId.trim() &&
  password.trim() &&
  rePassword.trim() &&
  email.trim() &&
  name.trim() &&
  studentNumber.trim() &&
  (password === rePassword) &&
  (password.length >= 8) &&
  idChecked ;

  const getPasswordMessage = (password) => {
    if(!password){
    return "비밀번호를 입력해 주세요."
    }else if(password.length < 8){
    return "비밀번호는 8자 이상 가능합니다."
    }
    return null;
  }
  

  return (
    <div className={join.overlay}>
      <div className={join.container}>
        <div className={join["close-button"]} onClick={() => onClose(false)}>
          <img src={close} alt="close"/>
        </div>
        <div className={join.title}>회원가입</div>
        <div className={join["join-container"]}>
          <span>
            아이디
            <input type="text"
              name="userId"
              value={userId}
              onChange={handleFormChange}/>
            <button className={join["id-check"]} onClick={handleIdCheck}>중복 확인</button>
            {checkMessage &&
              <span style={{ paddingLeft: "3px", color: checkColor, fontSize: "10px" }}>{checkMessage}</span> }
          </span>
          <span>
            비밀번호
            <input type="password"
              name="password"
              value={password}
              onChange={handleFormChange}/>
            {
              <span style={{ paddingLeft: "3px", color: "red", fontSize: "10px" }}>
                {getPasswordMessage(password)}
              </span>}
          </span>
          <span>
            비밀번호 확인
            <input type="password" 
              placeholder="비밀번호를 다시 입력해 주세요."
              name="rePassword"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}/>
            { 
              rePassword && (
              password !== rePassword ? 
              (<span style={{ paddingLeft: "3px", color: "red", fontSize: "10px" }}>비밀번호가 일치하지 않습니다.</span>) : 
              (<span style={{ paddingLeft: "3px", color: "green", fontSize: "10px" }}>비밀번호가 일치합니다.</span>))}
          </span>
          <span>
            이름
            <input type="text"
              name="name"
              placeholder="ex) 홍길동"
              value={name}
              onChange={handleFormChange}/>
          </span>
          <span>
            학번
            <input type="text" 
              name="studentNumber"
              placeholder="ex) 60xxxxx"
              value={studentNumber}
              onChange={handleFormChange}/>
          </span>
          <span>
            이메일
            <input type="email" 
              name="email"
              placeholder="이메일을 입력해 주세요."
              value={email}
              onChange={handleFormChange}/>
          </span>
            <button 
              type="button" 
              className={`${join["submit-button"]} ${isFormValid ? "" : join["disabled"]}`}
              disabled={!isFormValid}
              onClick={handleSubmit}>
              회원가입
            </button>
        </div>
      </div>
    </div>
  )
}
export default SignUpModal;