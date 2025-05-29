// ApplicantListModal.jsx
import React, { useState, useEffect } from "react";
import styles from "./ApplicantListModal.module.css";
import axiosInstance from "../api/axiosInstance"; // axios 설정 파일 경로 확인

function ApplicantListModal({ onClose, postId }) {
  const [applicants, setApplicants] = useState([]);

  // 서버에서 신청자 데이터 가져오기
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axiosInstance.get(`/api/posts/${postId}/applicants`);
        setApplicants(response.data);
      } catch (error) {
        console.error("신청자 불러오기 실패:", error);
      }
    };

    fetchApplicants();
  }, [postId]);

  // 수락 처리
  const handleAccept = async (id) => {
    try {
      await axiosInstance.put(`/api/applicants/${id}/accept`);
      alert(`ID ${id} 신청 수락됨`);
    } catch (error) {
      console.error("수락 오류:", error);
    }
  };

  // 거절 처리
  const handleReject = async (id) => {
    try {
      await axiosInstance.delete(`/api/applicants/${id}`);
      setApplicants(applicants.filter((a) => a.id !== id));
    } catch (error) {
      console.error("삭제 오류:", error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>신청자 리스트</h3>
          <button onClick={onClose} className={styles.close}>✕</button>
        </div>
        {applicants.length === 0 ? (
          <div style={{ padding: "12px" }}>신청자가 없습니다.</div>
        ) : (
          applicants.map(({ id, name, userid, email }) => (
            <div key={id} className={styles.row}>
              <div className={styles.cell}>{name}</div>
              <div className={styles.cell}>{userid}</div>
              <div className={styles.cell}>{email}</div>
              <button onClick={() => handleAccept(id)} className={styles.ok}>O</button>
              <button onClick={() => handleReject(id)} className={styles.no}>X</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ApplicantListModal;
