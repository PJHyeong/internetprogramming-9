import React, { useState } from "react";
import styles from "./StudyWriteEditPage.module.css";
import axiosInstance from "../api/axiosInstance";

function StudyWritePage({ setIsOpen, user }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    deadline: "",
    maxPeople: "",
    frequency: "",
    method: { offline: false, online: false },
    tags: [],
    location: "",
    userId: user?.userId || "",
  });
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "offline" || name === "online") {
      setForm({
        ...form,
        method: { ...form.method, [name]: checked },
      });
    } else if (type === "number") {
      setForm({ ...form, [name]: value === "" ? "" : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.content || !form.userId) {
      alert("제목, 내용, 작성자 정보를 모두 입력해주세요.");
      return;
    }

    // method 가공
    const methodArr = [];
    if (form.method.offline) methodArr.push("offline");
    if (form.method.online) methodArr.push("online");

    const sendData = {
      ...form,
      method: methodArr,
      maxPeople: form.maxPeople === "" ? null : form.maxPeople,
      frequency: form.frequency === "" ? null : form.frequency,
    };

    console.log("전송 데이터:", sendData);

    try {
      await axiosInstance.post("/api/posts", sendData);
      alert("모집글이 성공적으로 등록되었습니다!");
      setIsOpen(false); 
    } catch (error) {
      console.error("작성 실패:", error);
      alert("작성 실패: " + (error.response?.data?.message || "서버 오류"));
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>✕</button>
        <h2>작성하기</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.rowGroup}>
            <div className={styles.row}>
              <label className={styles.labelTitle}>제목</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <label className={styles.labelTitle}>모집 인원</label>
              <input type="number" name="maxPeople" value={form.maxPeople} onChange={handleChange} placeholder="최대 인원 수를 입력하세요" min="0" />
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.row}>
              <label className={styles.labelTitle}>상세 내용</label>
              <textarea name="content" value={form.content} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <label className={styles.labelTitle}>주간 모임 횟수</label>
              <input type="number" name="frequency" value={form.frequency} onChange={handleChange} placeholder="ex) 1" min="0" />

              <div className={styles.checkboxGroup}>
                <label>
                  <input type="checkbox" name="offline" checked={form.method.offline} onChange={handleChange} /> 대면
                </label>
                <label>
                  <input type="checkbox" name="online" checked={form.method.online} onChange={handleChange} /> 비대면
                </label>
              </div>

              <label className={styles.labelTitle}>스터디 분야</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (tagInput.trim() !== "") {
                      setForm(prevForm => ({
                        ...prevForm,
                        tags: [...prevForm.tags, tagInput.trim()]
                      }));
                      setTagInput("");
                    }
                  }
                }}
                placeholder="입력 후 Enter"
              />
              <div className={styles.tagList}>
                {form.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>#{tag}</span>
                ))}
              </div>

              <label className={styles.labelTitle}>지역</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="서울 강남구" />
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.labelTitle}>모집 기한</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
            <button type="submit" className={styles.submit}>작성하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudyWritePage;