// MenuDetail.js

import React from 'react';
import './MenuDetail.css'; // MenuDetail.css 파일이 필요하다면 추가하세요.

const MenuDetail = () => {
  // 상품 정보 (가게 정보 대신에 가격, 사진, 상세설명을 포함)
  const productInfo = {
    name: '엽기떡볶이',
    price: 15000,
    image: 'url_to_image', // 실제 이미지 URL로 교체
    description: '.',
  };

  return (
    <div className="MenuDetail">
      <h2>{productInfo.name}</h2>

      {/* 상품에 대한 정보 */}
      <div>
        <h3>상품 정보</h3>
        <p>가격: {productInfo.price}원</p>
        <img src={productInfo.image} alt={productInfo.name} />
        <p>상세 정보: {productInfo.description}</p>
      </div>

      {/* 필요에 따라 추가 정보 섹션을 더 만들 수 있습니다. */}

      {/* 수정과 삭제 버튼 */}
      <div className="action-buttons">
        <button className="edit-button">수정</button>
        <button className="delete-button">삭제</button>
        <button className="soldout-button">매진</button>
      </div>
    </div>
  );
};

export default MenuDetail;