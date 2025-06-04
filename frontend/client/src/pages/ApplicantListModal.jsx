import React, { useState, useEffect } from "react";
import styles from "./ApplicantListModal.module.css";
import axiosInstance from "../api/axiosInstance"; // axios 설정 파일 경로 확인

function ApplicantListModal({ onClose, postId }) {
  const [applicants, setApplicants] = useState([]);

  // 서버에서 신청자 데이터 가져오기
  const fetchApplicants = async () => {
    try {
      const response = await axiosInstance.get(`/api/posts/${postId}/applicants`);
      setApplicants(response.data);
    } catch (error) {
      console.error("신청자 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [postId]);

  // 수락 처리
  const handleAccept = async (id) => {
    try {
      await axiosInstance.put(`/api/applicants/${id}/accept`);
      // 상태 갱신: 수락된 신청자 status를 변경
      setApplicants(applicants.map(app => 
        app.id === id ? { ...app, status: "accepted" } : app
      ));
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
          applicants.map(({ id, name, studentNumber, email, status }) => (
            <div key={id} className={styles.row}>
              <div className={styles.cell}>{name}</div>
              <div className={styles.cell}>{studentNumber}</div>
              <div className={styles.cell}>{email}</div>
              {status === "accepted" ? (
                <div className={styles.cell} style={{ color: "green", fontWeight: "bold" }}>수락됨</div>
              ) : (
                <>
                  <button onClick={() => handleAccept(id)} className={styles.ok}>O</button>
                  <button onClick={() => handleReject(id)} className={styles.no}>X</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ApplicantListModal;


//mock data 기반

// // ApplicantListModal.jsx
// import React, { useState, useEffect } from "react";
// import styles from "./ApplicantListModal.module.css";
// import applicantData from "../mock/applicantData.json";

// function ApplicantListModal({ onClose, postId }) {
//   const [applicants, setApplicants] = useState([]);

//   useEffect(() => {
//   console.log("전달된 postId:", postId, typeof postId);
//   console.log("전체 mock 신청자:", applicantData);
//   const filtered = applicantData.filter((a) => {
//     console.log("비교 중:", a.postId, Number(postId));
//     return a.postId == Number(postId);
//   });
//   console.log("필터링 결과:", filtered);
//   setApplicants(filtered);
// }, [postId]);


//   // 수락 처리 (mock 기반이라 알림만)
//   const handleAccept = (id) => {
//     alert(`ID ${id} 신청 수락됨`);
//   };

//   // 거절 처리 (UI에서만 삭제)
//   const handleReject = (id) => {
//     setApplicants(applicants.filter((a) => a.id !== id));
//   };

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
//         <div className={styles.header}>
//           <h3>신청자 리스트</h3>
//           <button onClick={onClose} className={styles.close}>✕</button>
//         </div>
//         {applicants.length === 0 ? (
//           <div style={{ padding: "12px" }}>신청자가 없습니다.</div>
//         ) : (
//           applicants.map(({ id, name, studentNumber, email }) =>{
//             return(
//               <div key={id} className={styles.row}>
//                 <div className={styles.cell}>{name}</div>
//                 <div className={styles.cell}>{studentNumber}</div>
//                 <div className={styles.cell}>{email}</div>
//                 <button onClick={() => handleAccept(id)} className={styles.ok}>O</button>
//                 <button onClick={() => handleReject(id)} className={styles.no}>X</button>
//               </div>
//             )
//           }
//           ))
//         }
//       </div>
//     </div>
//   );
// }

// export default ApplicantListModal;
