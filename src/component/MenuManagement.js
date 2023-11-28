// ManagerMain.js

import React from 'react';
import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';

import './ManagerMain.css';


const MenuManagement = () => {
  const navigate = useNavigate();
 

  const processOrder = (orderId, status) => {
    console.log(`주문 ID ${orderId}를 ${status} 상태로 처리합니다.`);
  };

  const openStoreInfoModal = () => {
    console.log('가게 정보 수정 모달을 엽니다.');
  };

  return (
    <div className="managermain-container">
      <div className="order-list">
        <div className="order-item">
          <Link to="/menu-detail"> {/* 예시로 메뉴 ID 1로 설정, 원하는 ID로 변경해주세요 */}
            <span>엽기떡볶이</span>
            <span>15000원</span>
          </Link>
        </div>

        <div className="order-item">
          <Link to="/menu-detail"> {/* 예시로 메뉴 ID 2로 설정, 원하는 ID로 변경해주세요 */}
            <span>엽기오뎅</span>
            <span>20000원</span>
          </Link>
        </div>
      </div>

      <div className="add-menu-link">
        <Link to="/add-menu">메뉴 추가</Link>
      </div>

      <Outlet />
    </div>
  );
};
export default MenuManagement;