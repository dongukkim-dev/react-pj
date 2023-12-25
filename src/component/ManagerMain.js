// ManagerMain.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import './ManagerMain.css';
import ProcessingOrders from './ProcessingOrders';
import InProgressOrders from './InProgressOrders';
import CancelledOrders from './CancelledOrders';
import DeliveredOrders from './DeliveredOrders';

const ManagerMain = () => {
  const [selectedTab, setSelectedTab] = useState('processing');
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(10);
  const [totalData, setTotalData] = useState(100);

  //[접수대기, 처리중, 주문 취소, 배달 완료] 4가지 상태 state
  const [orders, setOrders] = useState([]);
  const [processingOrders, setProcessingOrders] = useState([]);
  const [cancelOrders, setCancelOrders] = useState([]);
  const [compOrders, setCompOrders] = useState([]);

  //초기 주문 목록을 가져오는 함수
  const fetchOrders = useCallback(async () => {
    try {
      const storeId = localStorage.getItem('store_id');
      const response = await axios.get(`/api/orders/${storeId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
        },
      });

      const allOrders = response.data;

      console.log('allOrders data:', allOrders);

      // 주문 상태에 따라 필터링하여 저장
      const orders = allOrders.filter(order => order.orderStatus === 'ORDER');
      const processingOrders = allOrders.filter(order => order.orderStatus === 'READY');
      const cancelOrders = allOrders.filter(order => order.orderStatus === 'CANCEL');
      const compOrders = allOrders.filter(order => order.orderStatus === 'COMP');

      setOrders(orders);
      setProcessingOrders(processingOrders);
      setCancelOrders(cancelOrders);
      setCompOrders(compOrders);

      setTotalData(allOrders.length); // 전체 주문 수 업데이트
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    const storeId = localStorage.getItem('store_id');
    if (storeId !== '0') {
      fetchOrders(); // 초기 주문 목록 가져오기
    }
  }, [fetchOrders]);

  // 주문 목록이 업데이트되면 로그에 출력
  useEffect(() => {
    const storeId = localStorage.getItem('store_id');
    if (storeId !== '0') {
      // SSE 이벤트 수신
      const sse = new EventSource(`/api/connect`);

      sse.addEventListener('connect', async (event) => {
        const { data: receiveConnectData } = event;
        console.log('connect event data: ', receiveConnectData);
      });

      const handleSseEvent = (eventName, setFunction) => (e) => {
        const orderData = JSON.parse(e.data);
        console.log(`${eventName} event data: `, orderData);
        setFunction((prevOrders) => [...prevOrders, orderData]);
      };

      sse.addEventListener('newOrder', handleSseEvent('newOrder', setOrders));
      sse.addEventListener('processingOrder', handleSseEvent('processingOrder', setProcessingOrders));
      sse.addEventListener('cancelOrder', handleSseEvent('cancelOrder', setCancelOrders));
      sse.addEventListener('compOrder', handleSseEvent('compOrder', setCompOrders));

      return () => {
        sse.close(); // SSE 연결 정리
      };
    }
  }, [setOrders, setProcessingOrders]);

  const processOrder = async (orderId, status) => {
    console.log(`주문 ID ${orderId}를 ${status} 상태로 처리합니다.`);
    try {
      await axios.patch(`/api/orders/${orderId}/${status}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
        },
      });

      // 주문 처리 후 해당 주문을 목록에서 제거
      if (status === 'READY') {
        setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
      } else if (status === 'CANCEL') {
        setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
        setProcessingOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
      } else if (status === 'COMP') {
        setProcessingOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
      }
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  const indexOfLastOrder = (currentPage + 1) * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setCurrentPage(selectedPage);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="managermain-container">
      {localStorage.getItem('store_id') === '0' ? (
        <p>가맹점 가입 후 이용할 수 있습니다.</p>
      ) : (
        <>
          <h1>주문 관리 페이지</h1>

          <div className="order-buttons">
            <button onClick={() => setSelectedTab('processing')}>접수대기</button>
            <button onClick={() => setSelectedTab('inProgress')}>처리중</button>
            <button onClick={() => setSelectedTab('cancelled')}>주문취소</button>
            <button onClick={() => setSelectedTab('delivered')}>배달완료</button>
          </div>

          {selectedTab === 'processing' && (<ProcessingOrders orders={orders} processOrder={processOrder} />)}
          {selectedTab === 'inProgress' && <InProgressOrders orders={processingOrders} processOrder={processOrder} />}
          {selectedTab === 'cancelled' && <CancelledOrders orders={cancelOrders} />}
          {selectedTab === 'delivered' && <DeliveredOrders orders={compOrders} />}
        </>
      )}
    </div>
  );
};

export default ManagerMain;
