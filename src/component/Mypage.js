import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPage.css'; // 스타일링을 위한 CSS 파일을 import
import ReviewModal from './ReviewModal';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState('orderHistory');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [orderHistory, setOrderHistory] = useState([
    {
      order_id: 1,
      orderDate: '2023-01-01',
      orderItems: [
        { id: 101, itemName: '엽기떡볶이', orderPrice: 15000, count: 1, reviewed: false },
        { id: 102, itemName: '버거킹', orderPrice: 10000, count: 1, reviewed: true },
      ],
      reviewed: false,
    },
    // ... 다른 주문 내역들 추가
  ]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isOrderHistoryModalOpen, setOrderHistoryModalOpen] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({ ...userInfo });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    // 회원 정보 및 주문 내역을 서버에서 가져오는 로직
    axios.get('/api/user', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setUserInfo(response.data);
        // userInfo에서 사용자 ID 추출
        const userId = localStorage.getItem('user_id');

        // 사용자의 주문 가져오기
        return axios.get(`/api/orders`, {
          params: {
            userId: userId,
          },
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          },
        });
      })
      .then(response => {
        console.log('불러온 주문 목록', response.data.content);
        setOrderHistory(response.data.content);
      })
      .catch(error => console.log(error));
  }, []);

  const viewOrderHistory = (orderId) => {
    axios.get(`/api/orders/${orderId}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setSelectedOrder(response.data[0]);
        setOrderHistoryModalOpen(true);
      })
      .catch(error => console.log(error));
  };

  const handleUpdate = async () => {
    try {
      // 사용자 정보 업데이트 로직
      const response = await axios.put('/api/user', updatedUserInfo, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
        },
      });

     

      setUserInfo(response.data);
      setModalOpen(false); // 업데이트 성공 시 모달 닫기
      // 업데이트 성공에 대한 추가적인 로직
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error.message);
      // 에러 핸들링 로직 추가
    }
  };

  const handleWithdrawal = async () => {
    const confirmWithdrawal = window.confirm('정말로 회원을 탈퇴하시겠습니까?');
    
    if (confirmWithdrawal) {
      try {
        // 회원 탈퇴 로직
        const response = await axios.delete('/api/user', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          },
        });

        // 탈퇴 성공에 대한 추가적인 로직 (예: 로그아웃 등)
        console.log('회원 탈퇴 성공:', response.data);

        // 예를 들어 로그아웃 등의 추가 작업을 수행할 수 있습니다.
        // ...

      } catch (error) {
        console.error('회원 탈퇴 실패:', error.message);
        // 에러 핸들링 로직 추가
      }
    }
  };

  const openModal = () => {
    // 모달이 열릴 때, 현재 사용자 정보로 초기화
    setUpdatedUserInfo({ ...userInfo });
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };

  const submitReview = async (reviewData) => {

    console.log('reviewData:', reviewData);
    
    // 리뷰 작성 후 해당 주문의 상태를 업데이트하여 리렌더링
    setOrderHistory(prevOrderHistory => {
      const updatedOrderHistory = prevOrderHistory.map(prevOrder => {
        if (prevOrder.orderId === reviewOrder.orderId) {
          // reviewData에서 업데이트된 필드 추출
          const updatedFields = {
            id: reviewData.id !== undefined ? reviewData.id : prevOrder.review.id,
            content: reviewData.content !== undefined ? reviewData.content : prevOrder.review.content,
            rating: reviewData.rating !== undefined ? reviewData.rating : prevOrder.review.rating,
            // 필요한 다른 업데이트된 필드도 추가
          };
  
          // 업데이트된 필드를 사용하여 리뷰 정보 업데이트
          return {
            ...prevOrder,
            review: {
              ...prevOrder.review,
              ...updatedFields,
            },
          };
        }
        return prevOrder;
      });
      console.log('Updated Order History:', updatedOrderHistory); // 확인을 위한 로그
      return updatedOrderHistory;
    });
  };
  
  const closeOrderHistoryModal = () => {
    setSelectedOrder(null);
    setOrderHistoryModalOpen(false);
  };

  const openReviewModal = (order) => {
    setReviewOrder(order);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
  };

  const confirmReviewDeletion = async (order) => {
    const confirmDeletion = window.confirm('정말로 리뷰를 삭제하시겠습니까?');

    if (confirmDeletion) {
      // 리뷰 삭제 로직을 수행하는 함수를 호출
      try {
        await axios.delete(`/api/review/${order.review.id}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        });

        alert('리뷰를 삭제하였습니다.');

        // 리뷰 삭제 후 해당 주문의 reviewed 상태를 업데이트하여 리렌더링
        setOrderHistory(prevOrderHistory => {
          const updatedOrderHistory = prevOrderHistory.map(prevOrder => {
            if (prevOrder.orderId === order.orderId) {
              // 리뷰 객체가 존재하면 객체를 복사하고 필요한 속성만 업데이트
              const updatedReview = prevOrder.review
                ? { ...prevOrder.review, id: null, content: null, rating: null }
                : null;
        
              return {
                ...prevOrder,
                review: updatedReview,
              };
            }
            return prevOrder;
          });
          return updatedOrderHistory;
        });
      } catch (error) {
        console.error('리뷰 삭제 실패:', error);
      }
    }
  };

  // 주문일자를 원하는 형식으로 포맷팅하는 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };


  return (
    <div className="my-page-container">
       <h2>마이페이지</h2>
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('orderHistory')}
          onMouseEnter={() => setHoveredTab('orderHistory')}
          onMouseLeave={() => setHoveredTab(null)}
          className={activeTab === 'orderHistory' || hoveredTab === 'orderHistory' ? 'active' : ''}
        >
          주문 내역
        </button>
        <button
          onClick={() => setActiveTab('userInfo')}
          onMouseEnter={() => setHoveredTab('userInfo')}
          onMouseLeave={() => setHoveredTab(null)}
          className={activeTab === 'userInfo' || hoveredTab === 'userInfo' ? 'active' : ''}
        >
          회원 정보
        </button>
      </div>


      {activeTab === 'orderHistory' && (
        <>
          <h3>주문 내역</h3>
          {orderHistory.length > 0 ? (
            <div>
              <ul>
                {orderHistory.map((order) => (
                  <div key={order.orderId}>
                    <p>주문한 가게: {order.review ? order.review.storeName : '가게 정보 없음'}</p>
                    <p>주문일자: {formatDate(order.orderDate)}</p>
                    <ul>
                      {order.orderItems.map((item) => (
                        <li key={item.itemId}>
                          {item.itemName} 수량: {item.count}  가격: {item.orderPrice}원
                        </li>
                      ))}
                    </ul>
                    {order.review && order.review.id != null ? (
                      <div className='button-container'>
                        <button onClick={() => openReviewModal(order)}>리뷰 수정</button>
                        <button onClick={() => confirmReviewDeletion(order)}>리뷰 삭제</button>
                      </div>
                    ) : (
                      <button onClick={() => openReviewModal(order)}>리뷰 쓰기</button>
                    )}
                  </div>
                ))}
              </ul>
            </div>
          ) : (
            <p>주문 내역이 없습니다.</p>
          )}
        </>
      )}

      {activeTab === 'userInfo' && (
        <>
         <h3>회원 정보</h3>
          <table>
            <tbody>
              <tr>
                <td>사용자 이름</td>
                <td>{userInfo.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{userInfo.email}</td>
              </tr>
              <tr>
                <td>전화번호</td>
                <td>{userInfo.phone}</td>
              </tr>
              <tr>
                <td>성별</td>
                <td>{userInfo.gender}</td>
              </tr>
              <tr>
                <td>적립금</td>
                <td>{userInfo.points} 포인트</td>
              </tr>
              <tr>
                <td>등급</td>
                <td>{userInfo.grade}</td>
              </tr>
              <tr>
                <td>주소</td>
                <td>{userInfo.address}</td>
              </tr>
            </tbody>
          </table>
          <div className="button-container">
      <button onClick={openModal}>회원정보 수정</button>
      <button onClick={handleWithdrawal}>회원탈퇴</button>
    </div>
        </>
      )}

      {isModalOpen && (
        <div className="mypage-modal-overlay">
          <div className="mypage-modal">
            <h2>회원정보 수정</h2>
            <div>
              <label htmlFor="updatedUsername"> 사용자 이름</label>
              <input
                type="text"
                id="updatedUsername"
                value={updatedUserInfo.name}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, username: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="updatedEmail">이메일</label>
              <input
                type="text"
                id="updatedEmail"
                value={updatedUserInfo.email}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, email: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="updatedPhoneNumber"> 전화번호</label>
              <input
                type="text"
                id="updatedPhoneNumber"
                value={updatedUserInfo.phone}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, phoneNumber: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="updatedAddress"> 주소</label>
              <input
                type="text"
                id="updatedAddress"
                value={updatedUserInfo.address}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, address: e.target.value })
                }
              />
            </div>
            <div>
              <button className="update-button" onClick={handleUpdate}>
                수정 완료
              </button>
              <button className="close-button" onClick={closeModal}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 리뷰 작성 모달 */}
      {reviewOrder && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setReviewOrder(null);
            setReviewModalOpen(false);
          }}
          onSubmit={submitReview}
          order={reviewOrder}
        />
      )}
    </div>
  );
};

export default MyPage;
