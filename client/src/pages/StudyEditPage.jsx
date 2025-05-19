import React, { useState, useEffect } from "react";
import styles from "./StudyWritePage.module.css";

function StudyEditPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    deadline: "",
    maxPeople: "",
    frequency: "",
    method: { offline: false, online: false },
    tags: [],
    region: ""
  });
  const [tagInput, setTagInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("studyDraft");
    if (saved) {
      const parsed = JSON.parse(saved);
      setForm(parsed);
    }
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("수정된 데이터:", form);
    alert("수정 완료되었습니다!");
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ position: "relative", padding: "40px" }}>
        <button
          onClick={() => setIsOpen(false)}
          style={{ position: "absolute", right: 10, top: 10, fontSize: 12, background: "none", border: "none", cursor: "pointer" }}
        >✕</button>
        <h2>수정하기</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.rowGroup}>
            <div className={styles.row}>
              <label>제목</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <label>모집 인원</label>
              <input type="number" name="maxPeople" min="0" value={form.maxPeople} onChange={handleChange} placeholder="최대 인원 수를 입력하세요" />
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.row}>
              <label>상세 내용</label>
              <textarea name="content" value={form.content} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <label>주간 모임 횟수</label>
              <input type="number" name="frequency" min="0" value={form.frequency} onChange={handleChange} placeholder="ex) 1" />

              <div className={styles.checkboxGroup}>
                <label><input type="checkbox" name="offline" checked={form.method.offline} onChange={handleChange} /> 대면</label>
                <label><input type="checkbox" name="online" checked={form.method.online} onChange={handleChange} /> 비대면</label>
              </div>

              <label>스터디 분야</label>
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

              <label>지역</label>
              <input type="text" name="region" value={form.region} onChange={handleChange} placeholder="서울 강남구" />
            </div>
          </div>

          <div className={styles.row}>
            <label>모집 기한</label>
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
