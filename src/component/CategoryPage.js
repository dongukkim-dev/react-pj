// CategoryPage.js

import React from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css'; 

const CategoryPage = () => {
  const { category } = useParams();

  // category를 기반으로 해당 카테고리의 레스토랑 목록을 가져오는 로직을 구현해야 합니다.
  // 여기에서는 임시로 하드코딩된 음식점 목록을 사용합니다.
  const restaurantList = [
    { name: '엽기떡볶이', rating: 4.5, deliveryFee: 2000, minOrderAmount: 15000 },
    { name: '신전떡볶이', rating: 4.2, deliveryFee: 2500, minOrderAmount: 12000 },
    { name: '죠스떡볶이', rating: 4.8, deliveryFee: 3000, minOrderAmount: 18000 },
    { name: '배떡', rating: 4.0, deliveryFee: 1800, minOrderAmount: 10000 },
    { name: '응급실떡볶이', rating: 4.7, deliveryFee: 2200, minOrderAmount: 16000 },
  ];

  return (
    <div className="CategoryPageContainer"> {/* 해당 페이지를 감싸는 컨테이너 */}
      <h2>{category} </h2>
      <ul>
        {restaurantList.map((restaurant, index) => (
          <li key={index} className="RestaurantCard">
            <h3>{restaurant.name}</h3>
            <p>별점: {restaurant.rating}</p>
            <p>배달팁: {restaurant.deliveryFee}원</p>
            <p>최소 주문 금액: {restaurant.minOrderAmount}원</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;