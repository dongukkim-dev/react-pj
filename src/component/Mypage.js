
import React, { useState, useEffect } from 'react';

import './MyPage.css'; // Import the CSS file for styling
import axios from 'axios';

const MyPage = () => {
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState({
    username: users.name,
    email: users.email,
    phoneNumber: '010-1234-5678', // 전화번호 추가
    userId: 'user123', // 아이디 추가
    password: '********', // 비밀번호 추가
    gender: '남성', // 성별 추가
    // ... Add more user information as needed
  });

  useEffect(() => {
    const { fromHomePage } = window.history.state || {};
    if (fromHomePage) {
      // 페이지가 홈페이지에서 이동된 경우, 창 크기를 조절하거나 다른 조치를 취할 수 있습니다.
      // 예: window.resizeTo(width, height);
    }

    axios.get('/api/members')
    .then(response => setUsers(response.data.data[0]))
    .then(response => console.log(response.data.data[0]))
    .catch(error => console.log(error))
  }, []);

  if (!users) {
    return null;
  }

  const handleUpdate = async (newUserInfo) => {
    try {
      // Logic to update user information
      // 예: const response = await updateUser(newUserInfo);
      setUserInfo(newUserInfo);
      // Additional logic to handle successful update
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error.message);
      // 에러 핸들링 로직 추가
    }
  };

  const handleWithdrawal = () => {
    const confirmWithdrawal = window.confirm('정말로 회원을 탈퇴하시겠습니까?');

    if (confirmWithdrawal) {
      try {
        // Logic for user withdrawal
        // 예: const response = await withdrawUser();
        // Additional logic to handle successful withdrawal
      } catch (error) {
        console.error('회원탈퇴 실패:', error.message);
        // 에러 핸들링 로직 추가
      }
    }
  };

  return (
    <div className="my-page-container">
      <h2>마이페이지</h2>
      <p>사용자 이름: {users.name}</p>
      <p>Email: {users.email}</p>
      <p>전화번호: {userInfo.phoneNumber}</p>
      <p>아이디: {userInfo.userId}</p>
      <p>비밀번호: {userInfo.password}</p>
      <p>성별: {users.gender}</p>
      {/* Additional user information fields can be added here */}
      <button onClick={() => handleUpdate({ ...userInfo, username: '새로운 이름' })}>
        회원정보 수정
      </button>
      <button onClick={handleWithdrawal}>회원탈퇴</button>
    </div>
  );
};

export default MyPage;
