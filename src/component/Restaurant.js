import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Restaurant.css';
import axios from 'axios';

const Restaurant = () => {
  // useParams 훅을 사용하여 URL에서 동적으로 변하는 값을 추출
  const { id } = useParams();

  const [restaurantInfo, setRestaurantInfo] = useState(

  );

  // 가게 정보
  // const restaurantInfo = {
  //   name: '엽기떡볶이',
  //   rating: 4.8,
  //   reviewCount: 300,
  //   minOrderAmount: 15000,
  // };

  useEffect(() => {
    // 서버에서 음식점 상세정보을 가져오는 API 호출 등의 로직
    axios.get(`/api/stores/${id}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      setRestaurantInfo(response.data)
    })
    .then(response => console.log(response.data))
    .catch(error => console.log(error))
  }, []);

return (
  <div className="Restaurant">
    <h2>{restaurantInfo.name}</h2>
    {/* <p>가게의 ID: {id}</p> */}

    {/* 가게에 대한 정보 */}
    <div>
      <h3>가게 정보</h3>
      <p>별점: {restaurantInfo.rating}</p>
      {/* <p>리뷰 수: {restaurantInfo.reviewCount}개</p> */}
      {/* <p>최소 주문 금액: {restaurantInfo.minOrderAmount}원</p> */}
    </div>
     {/* 위치 정보 */}
     <div>
      <h3>위치</h3>
      <p>성북구 정릉동</p>
    </div>
 {/* 연락처 정보 */}
 <div>
      <h3>연락처</h3>
      <p>가게 전화번호: 02-1234-5678</p>
   
    </div>
 {/* 리뷰 섹션 */}
 <div>
      <h3>리뷰</h3>
      <p></p>
    </div>

    {/* 메뉴 섹션 */}
    <div>
      <h3>메뉴</h3>
      <ul>
        <li> 엽기떡볶이 - 15000원</li>
        <li>엽기 닭볶음탕 - 23000원</li>
        {/* 필요에 따라 더 많은 메뉴 항목 추가 */}
      </ul>
    </div>


    {/* 필요에 따라 기타 섹션 추가 */}
  </div>
);
};

export default Restaurant;