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
  const [gender, setGender] = useState('');
  const [memberType, setMemberType] = useState('regular');
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

    if (!gender) {
      setError('성별을 선택하세요.');
      return;
    }

    // 회원가입 로직을 구현합니다.
    console.log('회원가입 시도:', { newUsername, newPassword, email, phoneNumber, address, gender });
  };

  const handleDuplicateCheck = () => {
    // 중복확인 로직을 구현합니다.
    console.log('아이디 중복 확인 시도:', newUsername);
  };

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleMemberTypeChange = (selectedMemberType) => {
    setMemberType(selectedMemberType);
  };

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isValidPassword = (value) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(value);
  };

  const isValidPhoneNumber = (value) => {
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
    <div className="signup-container">
      <h2>회원가입</h2>
      <div>
        <label htmlFor="newUsername">아이디:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleDuplicateCheck}>중복확인</button>
      </div>
      <div>
        <label htmlFor="newPassword">비밀번호</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {!isValidPassword(newPassword) && <p style={{ color: 'red' }}>비밀번호는 8자리 이상이어야 하며, 특수문자를 포함해야 합니다.</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {newPassword !== confirmPassword && <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>}
      </div>
      <div>
        <label htmlFor="email">이메일:</label>
        <input
          type="text"
          id="newUsername"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        {!isValidName(newUsername) && <p style={{ color: 'red' }}>이름 형식이 올바르지 않습니다.</p>}
      </div>
      <div>
        <label htmlFor="phoneNumber">전화번호</label>
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
            id="male"
            name="gender"
            value="male"
            checked={gender === 'male'}
            onChange={() => handleGenderChange('male')}
          />
          <label htmlFor="male">남성</label>
        </div>
        <div>
          <input
            type="radio"
            id="female"
            name="gender"
            value="female"
            checked={gender === 'female'}
            onChange={() => handleGenderChange('female')}
          />
          <label htmlFor="female">여성</label>
        </div>
        {!gender && <p style={{ color: 'red' }}>성별을 선택해야 합니다.</p>}
      </div>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleSignup}>회원가입</button>
      </div>
    </div>
  );
};

export default Signup;
