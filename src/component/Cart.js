import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  let totalPrice;

  useEffect(() => {
    //장바구니 정보로 서버에서 필요한 정보들 가져오기
    axios.post('/api/cart', localStorage.getItem(userId), {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setCartItems(response.data);
        console.log(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const calculateTotalPrice = () => {
    totalPrice = cartItems.reduce((total, item) => total + item.price * item.amount, 0);
    return totalPrice;
  };

  const removeItem = (index) => {
    const cart = JSON.parse(localStorage.getItem(userId));
    const updatedCartItems = [...cartItems];
    cart.splice(index, 1);
    updatedCartItems.splice(index, 1);
    localStorage.setItem(userId, JSON.stringify(cart));
    setCartItems(updatedCartItems);
  };

  const updateQuantity = (index, itemId, newQuantity) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].amount = newQuantity;
    setCartItems(updatedCartItems);

    // 현재 로컬 스토리지의 장바구니 데이터를 불러옴
    const existingCartData = JSON.parse(localStorage.getItem(userId)) || [];
    existingCartData[index].amount = newQuantity;

    // 새로운 장바구니 데이터를 로컬 스토리지에 저장
    localStorage.setItem(userId, JSON.stringify(existingCartData));
  };

  const handleIncreaseQuantity = (index) => {
    updateQuantity(index, cartItems[index].id, cartItems[index].amount + 1);
  };

  const handleDecreaseQuantity = (index) => {
    if (cartItems[index].amount > 1) {
      updateQuantity(index, cartItems[index].id, cartItems[index].amount - 1);
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="cart-container">
      <h2>장바구니</h2>
      {cartItems.map((item, index) => (
        <div className="cart-item" key={index}>
          <div className="item-info">
            <img src={`http://localhost:8080/${item.picture}`} alt={item.itemName} style={{ width: '150px', height: '150px', marginRight: '10px' }} />
            <span className="menu-name">{item.name}</span>
            <span className="quantity">
              <button onClick={() => handleDecreaseQuantity(index)}>-</button>
              {item.amount}
              <button onClick={() => handleIncreaseQuantity(index)}>+</button>
            </span>
            <span className="price">가격: {item.price}원</span>
          </div>
          <div className="item-actions">
            <button onClick={() => removeItem(index)}>삭제</button>
          </div>
        </div>
      ))}
      {/* <button onClick={() => handleRestaurantClick(cartItems[0].restaurantId)}>더 담으러 가기</button> */}
      <div className="total-price">
        <span>총 주문 금액: {calculateTotalPrice()}원</span>
      </div>

      <Link to={"/payment"} state={{ userId: userId, cartItems: cartItems, totalPrice: totalPrice }} className="order-button">
        주문하러 가기
      </Link>
    </div>
  );
};

export default Cart;
