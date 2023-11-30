// MenuNavbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './MenuNavbar.css';
const MenuNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 위치가 MenuNavbar가 숨겨져야 하는 페이지인지 확인
  if (
    location.pathname === '/login' ||
    location.pathname === '/' ||
    location.pathname === '/sns-signup' ||
    location.pathname === '/signup' ||
    location.pathname === '/add-menu' ||
    location.pathname === '/wishlist' ||
    location.pathname === '/payment' ||
    location.pathname === '/cart' ||
    location.pathname === '/restaurant/:restaurant' ||
    location.pathname === '/mypage' ||
    location.pathname === '/general-manager'||
    location.pathname === '/register'
  ) {
    return null;
  }

  return (
    <header>
      <div className="header-menu">
      <Link to="/managermain">주문 관리 페이지</Link>
        <Link to="/store-info-edit">가게 정보 수정</Link>
        <Link to="/menu-management">메뉴 관리</Link>
        <Link to="/manager-mypage">마이페이지</Link>
        <Link to="/sales">매출 관리</Link>
        <Link to="/login">로그아웃</Link>
        
      </div>
    </header>
  );
};

export default MenuNavbar;