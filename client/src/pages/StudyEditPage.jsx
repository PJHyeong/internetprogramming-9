import React, { useState, useEffect } from "react";
import styles from "./StudyWriteEditPage.module.css";
import axiosInstance from "../api/axiosInstance";

function StudyEditPage({ post, setIsOpen }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    deadline: "",
    maxPeople: "",
    frequency: "",
    method: { offline: false, online: false },
    tags: [],
    region: "",
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (post) {
      setForm(post); // post prop을 받아서 초기값으로 세팅
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
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
      const response = await axiosInstance.put(`/api/posts/${post.id}`, form);
      alert("수정 완료되었습니다!");
      console.log("서버 응답:", response.data);
      setIsOpen(false);
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정 실패: 서버에 요청할 수 없습니다.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          onClick={() => setIsOpen(false)}
          className={styles.closeButton}
        >✕</button>
        <h2>수정하기</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.rowGroup}>
            <div className={styles.row}>
              <label className={styles.labelTitle}>제목</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <label className={styles.labelTitle}>모집 인원</label>
              <input type="number" name="maxPeople" min="0" value={form.maxPeople} onChange={handleChange} placeholder="최대 인원 수를 입력하세요" />
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.row}>
              <label className={styles.labelTitle}>상세 내용</label>
              <textarea name="content" value={form.content || ""} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <label className={styles.labelTitle}>주간 모임 횟수</label>
              <input type="number" name="frequency" min="0" value={form.frequency} onChange={handleChange} placeholder="ex) 1" />

              <div className={styles.checkboxGroup}>
                <label><input type="checkbox" name="offline" checked={form.method.offline} onChange={handleChange} /> 대면</label>
                <label><input type="checkbox" name="online" checked={form.method.online} onChange={handleChange} /> 비대면</label>
              </div>

              <label className={styles.labelTitle}>스터디 분야</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="입력 후 Enter"
              />
              <div className={styles.tagList}>
                {form.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>#{tag}</span>
                ))}
              </div>

              <label className={styles.labelTitle}>지역</label>
              <input type="text" name="region" value={form.region} onChange={handleChange} placeholder="서울 강남구" />
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.labelTitle}>모집 기한</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button type="submit" className={styles.submit}>수정하기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudyEditPage;
