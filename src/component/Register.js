// Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; // 필요한 스타일 파일을 import

const Register = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantInfo, setRestaurantInfo] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    // 음식점 등록 로직을 수행합니다.
    console.log('음식점 등록 시도:', { restaurantName, restaurantInfo });

    // 여기에서 음식점 등록 성공 여부를 판단하여 페이지 이동
    const registerSuccessful = true; // 예시로 성공했다고 가정

    if (registerSuccessful) {
      navigate('/managermain'); // 음식점 등록 성공 시 관리자 페이지로 이동
    } else {
      alert('음식점 등록 실패. 모든 필수 정보를 입력하세요.');
    }
  };

  return (
    <div className="register-container">
      <h2>음식점 등록</h2>
      <div>
        <label htmlFor="restaurantName">음식점명:</label>
        <input
          type="text"
          id="restaurantName"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="restaurantInfo">상세 정보:</label>
        <textarea
          id="restaurantInfo"
          value={restaurantInfo}
          onChange={(e) => setRestaurantInfo(e.target.value)}
        />
      </div>
      <div>
        <button className="register-button" onClick={handleRegister}>
          등록
        </button>
      </div>
      <div className="back-to-login">
        <Link to="/login">로그인 화면으로 돌아가기</Link>
      </div>
    </div>
  );
};

export default Register;