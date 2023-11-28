
import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';


const CartItem = ({ restaurantName, menuName, quantity, price }) => {
  return (
    <div className="cart-item">
      <div className="item-info">
        <span className="menu-name">{menuName}</span>
        <span className="quantity">수량: {quantity}</span>
        <span className="price">가격: {price}원</span>
      </div>
    </div>
  );
};

const Cart = () => {
  const cartItems = [
    { restaurantName: '엽기떡볶이', menuName: '마라엽떡', quantity: 1, price: 16000 },
    { restaurantName: '엽기떡볶이', menuName: '주먹김밥', quantity: 1, price: 3000 },
    { restaurantName: '엽기떡볶이', menuName: '쿨피스', quantity: 1, price: 1000 },
  ];

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="cart-container">
      <h2>장바구니</h2>
      {cartItems.map((item, index) => (
        <CartItem
          key={index}
          restaurantName={item.restaurantName}
          menuName={item.menuName}
          quantity={item.quantity}
          price={item.price}
        />
      ))}
       <div className="total-price">
        <span>총 주문 금액: {totalPrice}원</span>
      </div>
      <Link to="/payment" className="order-button">
        주문하러 가기
      </Link>
    </div>
  );
};

export default Cart;  