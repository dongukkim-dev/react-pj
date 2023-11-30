// StoreInfoEdit.js

import React, { useState } from 'react';
import './StoreInfoEdit.css';  

const StoreInfoEdit = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: '가게 이름',
    location: '가게 위치',
    phoneNumber: '가게 전화번호',
    menu: '가게 메뉴',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('수정된 가게 정보:', storeInfo);
  };

  return (
    <div className="storeinfoedit-container">
      <h1>가게 정보 수정 </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">가게 이름:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={storeInfo.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="location">가게 위치:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={storeInfo.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">가게 전화번호:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={storeInfo.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="menu">가게 메뉴:</label>
          <input
            type="text"
            id="menu"
            name="menu"
            value={storeInfo.menu}
            onChange={handleChange}
          />
        </div>
        <button type="submit">가게 정보 수정 완료</button>
      </form>
    </div>
  );
};

export default StoreInfoEdit;