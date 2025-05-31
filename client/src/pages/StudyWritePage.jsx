import React, { useState } from "react";
import styles from "./StudyWriteEditPage.module.css";
import loginUser from "../mock/loginUser.json";
import axiosInstance from "../api/axiosInstance";

function StudyWritePage({ setIsOpen }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    deadline: "",
    maxPeople: "",
    frequency: "",
    method: { offline: false, online: false },
    tags: [],
    location: "",
    userId: loginUser.userId,
    name: loginUser.name
  });
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "offline" || name === "online") {
      setForm({
        ...form,
        method: { ...form.method, [name]: checked },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/api/posts", form);
      alert("작성 완료되었습니다!");
      console.log("서버 응답:", response.data);
      setIsOpen(false);
    } catch (error) {
      console.error("작성 실패:", error);
      alert("작성 중 오류가 발생했습니다.");
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
                <label><input type="checkbox" name="offline" checked={form.method.offline} onChange={handleChange} /> 대면</label>
                <label><input type="checkbox" name="online" checked={form.method.online} onChange={handleChange} /> 비대면</label>
              </div>

              <label className={styles.labelTitle}>스터디 분야</label>
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="입력 후 Enter" />
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
