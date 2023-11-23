
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './MyPage.css'; // Import the CSS file for styling

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    email: 'user@example.com',
    username: '사용자 이름',
    phoneNumber: '010-1234-5678', // 전화번호 추가
    gender: '남성', // 성별 추가
    points: 1000, 
    grade: 'gold', 
    address: '서울특별시 성북구 서경로 123번지',
  });

  useEffect(() => {

    axios.get('/api/member', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      setUserInfo(response.data)
      return response;
    })
    .then(response => console.log(response.data))
    .catch(error => console.log(error))
  }, []);

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
      <p>Email: {userInfo.email}</p>
      <p>사용자 이름: {userInfo.name}</p>
      <p>전화번호: {userInfo.phone}</p>
      <p>성별: {userInfo.gender}</p>
      <p>등급: {userInfo.grade}</p>
      <p>적립금: {userInfo.point}</p>
      <p>주소: {userInfo.address}</p>
      <p>생성 날짜: {userInfo.createdDate}</p>
      {/* Additional user information fields can be added here */}
      <button onClick={() => handleUpdate({ ...userInfo, username: '새로운 이름' })}>
        회원정보 수정
      </button>
      <button onClick={handleWithdrawal}>회원탈퇴</button>
    </div>
  );
};

export default MyPage;
