// DeliveredOrders.js
import React, { useState } from 'react';
// import './DeliveredOrders.css';

const DeliveredOrders = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderClick = (order) => {
    console.log('주문 상세정보 클릭됨', order);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // 주문일자를 원하는 형식으로 포맷팅하는 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const calculateTotalPrice = () => {
    totalPrice = selectedOrder.orderItems.reduce((total, item) => total + item.orderPrice * item.count, 0);
    return totalPrice;
  };

  let totalPrice;

  return (
    <div className="order-list">
      <h2>배달 완료</h2>
      {orders.map((order) => {
        totalPrice = 0; // Reset total price for each order
        order.orderItems.forEach((item) => {
          totalPrice += item.orderPrice * item.count;
        });

        return (
          <div className='order-item' key={order.order_id} onClick={() => handleOrderClick(order)}>
            <p>주문일자: {formatDate(order.orderDate)}</p>
            {order.orderItems.length === 1 ? (
              <div>
                <p>{order.orderItems[0].itemName}</p>
              </div>
            ) : (
              <div>
                <p>
                  {order.orderItems[0].itemName}[외 {order.orderItems.length - 1}개]
                </p>
              </div>
            )}
            <p>총가격: {totalPrice}원</p>
          </div>
        )
      })}

      {/* 메뉴 상세 정보 모달 */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>주문 상세 정보</h2>
            <p>주문일자: {formatDate(selectedOrder.orderDate)}</p>
            <div key={selectedOrder.order_id}>
              {selectedOrder.orderItems.map((item) => (
                <p key={item.itemName}>
                  메뉴명: {item.itemName}, 수량: {item.count}, 가격: {item.orderPrice}원
                </p>
              ))}
            </div>
            <p>총 가격: {calculateTotalPrice()}원</p>
            <button className="close-button" onClick={handleCloseModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveredOrders;
