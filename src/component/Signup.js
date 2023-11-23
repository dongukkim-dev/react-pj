// Signup.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState(''); // 추가: 성별 상태 추가
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    // 유효성 검사
    if (!isValidEmail(email)) {
      setError('이메일 형식이 올바르지 않습니다.');
      return;
    }

    if (!isValidPassword(newPassword)) {
      setError('비밀번호는 8자리 이상이어야 하며, 특수문자를 포함해야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isValidName(newUsername)) {
      setError('이름 형식이 올바르지 않습니다.');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError('전화번호 형식이 올바르지 않습니다.');
      return;
    }

    if (!gender) { // 추가: 성별 선택 여부 확인
      setError('성별을 선택하세요.');
      return;
    }

    // 회원가입 로직을 구현합니다.
    console.log('회원가입 시도:', { newUsername, newPassword, email, phoneNumber, address, gender });

    axios.post("/api/users", {
      email: email,
      password: newPassword,
      name: newUsername,
      phone: phoneNumber,
      gender: gender,
      role: "ROLE_USER"
    })
    .then(res => {
      console.log("200", res.data);

      if (res.status === 200 || res.status === 201) {
        alert('회원가입에 성공했습니다.');
        navigate('/login');
      }
    })
    .catch(error => console.log(error))
  };

  const handleDuplicateCheck = () => {
    // 중복확인 로직을 구현합니다.
    console.log('이메일 중복 확인 시도:', email);
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

  // 이메일 유효성 검사 함수
  const isValidEmail = (value) => {
    // 간단한 형식의 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // 비밀번호 유효성 검사 함수
  const isValidPassword = (value) => {
    // 비밀번호는 8자리 이상, 특수문자를 포함해야 함
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(value);
  };

  // 전화번호 유효성 검사 함수
  const isValidPhoneNumber = (value) => {
    // 간단한 형식의 전화번호 유효성 검사 (010-xxxx-xxxx)
    const phoneNumberRegex = /^010-\d{4}-\d{4}$/;
    return phoneNumberRegex.test(value);
  };

  const isValidName = (value) => {
    if (typeof value !== 'string' || value.trim() === '') {
      return false;
    }

    return true;
  }

  return (
    <div>
      <h2>회원가입</h2>
      <div>
        <label htmlFor="email">이메일:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!isValidEmail(email) && <p style={{ color: 'red' }}>이메일 형식이 올바르지 않습니다.</p>}
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
        {!isValidPassword(newPassword) && <p style={{ color: 'red' }}>비밀번호는 8자리 이상이어야 하며, 특수문자를 포함해야 합니다.</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword">비밀번호 확인:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {newPassword !== confirmPassword && <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>}
      </div>
      <div>
        <label htmlFor="newUsername">이름:</label>
        <input
          type="text"
          id="newUsername"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        {!isValidName(newUsername) && <p style={{ color: 'red' }}>이름 형식이 올바르지 않습니다.</p>}
      </div>
      <div>
        <label htmlFor="phoneNumber">전화번호:</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {!isValidPhoneNumber(phoneNumber) && <p style={{ color: 'red' }}>010-0000-0000 형식으로 입력해야 합니다.</p>}
      </div>
      <div>
        <label>성별:</label>
        <div>
          <input
            type="radio"
            id="MALE"
            name="gender"
            value="MALE"
            checked={gender === 'MALE'}
            onChange={() => handleGenderChange('MALE')}
          />
          <label htmlFor="MALE">남성</label>
        </div>
        <div>
          <input
            type="radio"
            id="FEMALE"
            name="gender"
            value="FEMALE"
            checked={gender === 'FEMALE'}
            onChange={() => handleGenderChange('FEMALE')}
          />
          <label htmlFor="FEMALE">여성</label>
        </div>
        {!gender && <p style={{ color: 'red' }}>성별을 선택해야 합니다.</p>}
      </div>
      <div>
        <button onClick={handleSignup}>회원가입</button>
      </div>
    </div>
  );
};

export default Signup;
