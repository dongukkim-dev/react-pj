// GeneralManager.js

import React, { useState } from 'react';
import './GeneralManager.css'; // 스타일링을 위한 CSS 파일을 import합니다.

const GeneralManager = () => {
  const [franchiseApplications, setFranchiseApplications] = useState([
    { id: 1, name: '엽기떡볶이' },
    // 다른 가맹점 신청 목록들 추가
  ]);

  const handleAccept = (applicationId) => {
    // 가맹점 신청 수락 로직을 여기에 추가
    console.log(`가맹점 신청 ID ${applicationId}를 수락합니다.`);
  };

  const handleReject = (applicationId) => {
    // 가맹점 신청 거절 로직을 여기에 추가
    console.log(`가맹점 신청 ID ${applicationId}를 거절합니다.`);
  };

  const handleLogout = () => {
    // 로그아웃 로직을 여기에 추가
    console.log('로그아웃');
    // 로그아웃 후, 로그인 페이지로 이동
    // 예시: window.location.href = '/login';
  };

  return (
    <div className="general-manager-container">
      <h2>총관리자 페이지</h2>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>

      <div className="franchise-applications">
        <h3>가맹점 신청 목록</h3>
        <ul>
          {franchiseApplications.map((application) => (
            <li key={application.id}>
              {application.name} 가맹점 신청
              <button onClick={() => handleAccept(application.id)}>수락</button>
              <button onClick={() => handleReject(application.id)}>거절</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GeneralManager;
