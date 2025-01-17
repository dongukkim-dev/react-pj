import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import './Restaurant.css';
import { useParams } from 'react-router';

const Restaurant = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5); // 페이지당 항목 수
  const [offset, setOffset] = useState(0);
  const [totalData, setTotalData] = useState(100);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('menu');

  //isLiked로 즐겨찾기 음식점인지 확인, likeCount로 이 음식점을 즐겨찾기 한 사람들 수 저장
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [reviews, setReviews] = useState([]);
  const [menuList, setMenuList] = useState([]);

  const { id } = useParams();
  let userId = localStorage.getItem('user_id'); // 사용자 ID 불러오기
  let totalPrice;

  useEffect(() => {
    axios.get(`/api/store/${id}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
      .then(response => setRestaurantInfo(response.data))
      .catch(error => console.error('Error fetching menu list:', error));

    axios.get(`/api/items/${id}`, {
      params: {
        offset: offset,
        limit: perPage,
        size: 20
      },
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setMenuList(response.data.content);
        setTotalData(response.data.totalData); // 수정: 전체 항목의 수 설정
      })
      .catch(error => console.error('Error fetching restaurant info:', error));

    axios.get(`/api/review/${id}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      });

    if (userId !== null) {
      console.log('실행되는 경우', typeof (userId));
      axios.get(`/api/bookmark/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          setIsLiked(response.data.status);
          setLikeCount(response.data.count);
        })
    }
  }, []);

  const handleMenuButtonClick = (menu) => {
    setModalOpen(true);
    setSelectedMenu(menu);
  };

  const handleAddToCart = () => {

    if (userId === '0') {
      alert("로그인 하지 않은 사용자는 이용할 수 없습니다.");
      setModalOpen(false);
      return;
    }

    // 현재 로컬 스토리지의 장바구니 데이터를 불러옴
    const existingCartData = JSON.parse(localStorage.getItem(userId)) || [];

    // 첫 번째 요소의 storeId 값이 존재하고, 새로 추가할 아이템의 storeId 값이 다르다면 경고 메시지 출력
    if (existingCartData.length > 0 && existingCartData[0].storeId !== id) {
      alert("이미 다른 음식점의 상품이 장바구니에 있어 추가할 수 없습니다.");
      setModalOpen(false);
      return;
    }

    // 새로 추가할 아이템
    const newItem = {
      storeId: id,
      itemId: selectedMenu.itemId,
      amount: quantity,
    };

    // 이미 장바구니에 있는 아이템이라면 수량을 더함
    const existingItemIndex = existingCartData.findIndex(item => item.itemId === newItem.itemId);
    if (existingItemIndex !== -1) {
      existingCartData[existingItemIndex].amount += newItem.amount;
    } else {
      // 장바구니에 없는 아이템이라면 새로 추가
      existingCartData.push(newItem);
    }

    // 새로운 장바구니 데이터를 로컬 스토리지에 저장
    localStorage.setItem(userId, JSON.stringify(existingCartData));

    // 모달을 닫음
    setModalOpen(false);
  };

  //isLiked = true 이면 찜목록 추가 코드, false이면 찜목록 삭제 코드
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    console.log('isLiked:', isLiked);
    console.log('store_id', id);

    if (isLiked === false) {
      axios.post(`/api/bookmark/${id}`, null, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
        },
      })
        .then(response => { console.log(response.data) })
        .catch(error => console.error('Error bookmark add', error));
    }
    else if (isLiked === true) {
      axios.delete(`/api/bookmark/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
        },
      })
        .catch(error => console.error('Error bookmark delete', error));
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOffset((pageNumber - 1) * perPage); // 수정: perPage를 곱해서 오프셋 설정
  };

  //리뷰 별점 평균 구하기
  const calculateAverageRating = () => {
    totalPrice = reviews.reduce((total, review) => total + review.rating, 0);
    return totalPrice / reviews.length;
  };

  // 아이템이 SOLD 상태인지 확인하는 함수
  const isMenuSold = (menu) => menu.itemStatus === 'SOLD';

  return (
    <div className="Restaurant">
      <img src={`http://localhost:8080/${restaurantInfo.picture}`}
        alt="가게 이미지"
        style={{ width: '800px', height: '533px' }} />
      <h2>{restaurantInfo.name}</h2>
      <div>
        <button onClick={handleLike}>
          {isLiked ? '❤️' : '🤍'}
        </button>
        <span role="img" aria-label="heart"> {likeCount}</span>
      </div>
      <div>
        <h3>최소 주문 금액</h3>
        <p>{restaurantInfo.minOrderPrice}원</p>
      </div>
      <div>
        <h3>예상 배달 시간</h3>
        <p>30분</p>
      </div>
      <div className='menu-buttons'>
        <button onClick={() => setSelectedTab('menu')}>메뉴</button>
        <button onClick={() => setSelectedTab('info')}>정보</button>
        <button onClick={() => setSelectedTab('reviews')}>리뷰</button>
      </div>

      {selectedTab === 'menu' && (
        <div>
          <h3>메뉴</h3>
          <ul>
            {menuList.map((menu) => (
              <li key={menu.itemId} onClick={() => !isMenuSold(menu) && handleMenuButtonClick(menu)} className={isMenuSold(menu) ? 'sold' : ''}>
                {menu.picture !== "" ? (
                  <img src={`http://localhost:8080/${menu.picture}`}
                    alt={menu.itemName}
                    style={{ width: '150px', height: '150px', marginRight: '10px' }}
                  />
                ) : (
                  <img
                    src={`http://localhost:8080/upload\\itemImg\\231215\\NoImage.png`}
                    alt="No Image"
                    style={{ width: '150px', height: '150px', marginRight: '10px' }}
                  />
                )}
                {menu.itemStatus === 'SOLD' ? (
                  <span style={{ color: 'red' }}>{menu.itemName} - 재고 소진</span>
                ) : (
                  <>
                    {menu.itemName} - {menu.price}원
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTab === 'info' && (
        <div>
          <h3>가게 정보</h3>
          <p>별점: {reviews.length === 0 ? 0 : Number(calculateAverageRating().toFixed(2))}</p>
          <p>리뷰 수: {reviews.length}개</p>
          <p>주소: {restaurantInfo.address + " " + restaurantInfo.detail}</p>
        </div>
      )}

      {selectedTab === 'reviews' && Array.isArray(reviews) && (
        <div>
          <h3>리뷰</h3>
          {reviews.map((review) => (
            <div className="review-page" key={review.id} >
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                <p>회원: {review.userName}</p>
                <p>상세 내용: {review.content}</p>
                <p>주문 상품: {review.itemNames.join(', ')}</p>
                <p>별점: {review.rating}</p>
              </div>
              <div>
                <img
                  src={`http://localhost:8080/${review.picture}`}
                  alt="대표 사진 미리보기"
                  style={{ width: '300px', height: '300px' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && selectedMenu && (
        <div className="restaurant-modal-overlay">
          <div className="restaurant-modal">
            <h2>{selectedMenu.name}</h2>
            <p>가격: {selectedMenu.price}원</p>
            <label htmlFor="quantity">수량:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              min="1"
            />
            <button onClick={handleAddToCart}>장바구니에 담기</button>
            <button onClick={() => setModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
