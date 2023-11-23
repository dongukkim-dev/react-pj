// MenuManagement.js

import React from 'react';
import { Link } from 'react-router-dom';
import './MenuManagement.css';

const products = [
  { id: 1, name: '엽기떡볶이', price: 15000 },
  { id: 2, name: '엽기오뎅', price: 14000 },
  { id: 3, name: '마라엽떡', price: 16000 },
  // 추가 상품 정보...
];

const MenuManagement = () => {
  return (
    <div className="menu-management-container">
      <h2>상품 목록</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={"/menu-detail"}>
              <span>{product.name}</span>
              <span>{product.price}원</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuManagement;