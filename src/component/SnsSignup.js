// SnsSignup.js

import React, { useState } from 'react';
import './SnsSignup.css'; // 수정된 부분

const SnsSignup = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const handleSignup = () => {
    // 회원가입 로직 구현: 서버로 입력한 정보 전송 등
    console.log('회원가입 시도:', { name, phoneNumber, address });
  };

  return (
    <div className="sns-signup-container"> {/* 수정된 부분 */}
      <h2 className="sns-signup-title">소셜 회원가입 </h2>
      <div className="sns-signup-input-group"> {/* 수정된 부분 */}
        <label htmlFor="name" className="sns-signup-label">이름:</label>
        <input
          type="text"
          id="name"
          className="sns-signup-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="sns-signup-input-group"> {/* 수정된 부분 */}
        <label htmlFor="phoneNumber" className="sns-signup-label">전화번호:</label>
        <input
          type="tel"
          id="phoneNumber"
          className="sns-signup-input"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="sns-signup-input-group"> {/* 수정된 부분 */}
        <label htmlFor="address" className="sns-signup-label">주소:</label>
        <input
          type="text"
          id="address"
          className="sns-signup-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="sns-signup-input-group"> {/* 수정된 부분 */}
        <button className="sns-signup-button" onClick={handleSignup}>회원가입</button>
      </div>
    </div>
  );
};

export default SnsSignup;
