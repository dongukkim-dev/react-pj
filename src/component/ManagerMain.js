import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './ManagerMain.css';

const ManagerMain = () => {
  console.log('ManagerMain 컴포넌트 렌더링');

  const processOrder = (orderId, status) => {
    console.log(`주문 ID ${orderId}를 ${status} 상태로 처리합니다.`);
  };

  const openStoreInfoModal = () => {
    setModalOpen(true);
  };

  const closeStoreInfoModal = () => {
    setModalOpen(false);
  };

  const handleRegister = () => {
    // 음식점 등록 로직을 수행합니다.
    console.log('음식점 등록 시도:', { restaurantName, restaurantInfo });

    // 여기에서 음식점 등록 성공 여부를 판단하여 페이지 이동
    const registerSuccessful = true; // 예시로 성공했다고 가정

    if (registerSuccessful) {
      setModalOpen(false);
      // 음식점 등록 성공 시 관리자 페이지로 이동
      navigate('/managermain');
    } else {
      alert('음식점 등록 실패. 모든 필수 정보를 입력하세요.');
    }
  };

  return (
    <div className="managermain-container">
      <div className="header">
        <h1>주문 관리 페이지</h1>
        <div className="header-menu">
          <Link to="/store-info-edit">가게 정보 수정</Link>
          <Link to="/add-menu" >메뉴 추가</Link>
          <Link to="/mypage">마이페이지</Link>
          <Link to="/sales">매출 관리</Link>
        </div>
      </div>

      <div className="order-list">
        <div className="order-item">
          <Link to="/menu-detail">
            <span>엽기떡볶이</span>
            <span>15000원</span>
          </Link>
        </div>

        <div className="order-item">
          <Link to="/menu-detail">
            <span>엽기오뎅</span>
            <span>20000원</span>
          </Link>
        </div>
      </div>

      <div className="add-menu-link">
        <Link to="/add-menu">메뉴 추가</Link>
      </div>

      {/* 음식점 등록 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
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
              <button className="close-button" onClick={closeStoreInfoModal}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={openStoreInfoModal}>음식점 등록</button>

      <Outlet />
    </div>
  );
};

export default ManagerMain;
