import React, { useState, useEffect } from 'react';

import './MyPage.css'; // Import the CSS file for styling

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({
    username: '사용자 이름',
    email: 'user@example.com',
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
  }, []);

  const handleUpdate = async () => {
    try {
      // Logic to update user information
      // 예: const response = await updateUser(updatedUserInfo);
      setUserInfo(updatedUserInfo);
      setModalOpen(false); // Close the modal after successful update
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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="my-page-container">
      <h2>마이페이지</h2>
      <p>Email: {userInfo.email}</p>
      <p>전화번호: {userInfo.phoneNumber}</p>
      <p>아이디: {userInfo.userId}</p>
      <p>비밀번호: {userInfo.password}</p>
      <p>성별: {userInfo.gender}</p>
      {/* Additional user information fields can be added here */}
      <button onClick={() => handleUpdate({ ...userInfo, username: '새로운 이름' })}>
        회원정보 수정
      </button>
      <button onClick={handleWithdrawal}>회원탈퇴</button>

      {/* 수정 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>회원정보 수정</h2>
            <div>
              <label htmlFor="updatedUsername"> 사용자 이름</label>
              <input
                type="text"
                id="updatedUsername"
                value={updatedUserInfo.username}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, username: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="updatedEmail">이메일</label>
              <input
                type="text"
                id="updatedEmail"
                value={updatedUserInfo.email}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, email: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="updatedPhoneNumber"> 전화번호</label>
              <input
                type="text"
                id="updatedPhoneNumber"
                value={updatedUserInfo.phoneNumber}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, phoneNumber: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="updatedPassword"> 비밀번호</label>
              <input
                type="password"
                id="updatedPassword"
                value={updatedUserInfo.password}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, password: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="updatedAddress"> 주소</label>
              <input
                type="text"
                id="updatedAddress"
                value={updatedUserInfo.address}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, address: e.target.value })
                }
              />
            </div>
            <div>
              <button className="update-button" onClick={handleUpdate}>
                수정 완료
              </button>
              <button className="close-button" onClick={closeModal}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;