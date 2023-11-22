// signup.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    // 회원가입 로직을 구현합니다. 서버로 새로운 유저 정보를 전송하거나,
    // 로컬 상태를 업데이트하는 등의 작업을 수행할 수 있습니다.
    console.log('회원가입 시도:', { newUsername, newPassword, email, phoneNumber, address });

    axios.post("/api/users", {
      name: newUsername,
      password: newPassword,
      email: email
    })
    .then(res => {
      console.log("200", res.data);

      if (res.status === 200 || res.status === 201) {
        navigate('/');
      }
    })
    .catch(error => console.log(error))
  };

  const handleDuplicateCheck = () => {
    // 중복확인 로직을 구현합니다.
    console.log('아이디 중복 확인 시도:', newUsername);
  };

  return (
    <div>
      <h2>회원가입</h2>
      <div>
        <label htmlFor="newUsername">아이디:</label>
        <input
          type="text"
          id="newUsername"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button onClick={handleDuplicateCheck}>중복확인</button>
      </div>
      <div>
        <label htmlFor="newPassword">비밀번호:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">이메일:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">전화번호:</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="address">주소:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleSignup}>회원가입</button>
      </div>
    </div>
  );
};

export default Signup;
