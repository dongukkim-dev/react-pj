// app.js

import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import MyPage from './component/Mypage';
import Wishlist from './component/Wishlist';
import Cart from './component/Cart';
import Payment from './component/Payment';
import Restaurant from './component/Restaurant';
import Login from './component/login';
import Signup from './component/Signup';
import SnsSignup from './component/SnsSignup';
import Navbar from './component/Navbar';
import ManagerMain from './component/ManagerMain';
import StoreInfoEdit from './component/StoreInfoEdit';  
import AddMenu from './component/AddMenu'; 
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import { AuthProvider, useAuth } from './AuthContext';

const Navigation = ({ handleSearchChange }) => {
  const { isLoggedIn, handleLogin, handleLogout } = useAuth();
  const navigate = useNavigate();

};

const Category = ({ name }) => {
  return (
    <div className="category">
      {name}
    </div>
  );
};

const RestaurantCard = ({ name }) => {
  const navigate = useNavigate();

  const handleRestaurantClick = () => {
    const restaurantId = name.toLowerCase().replace(/\s/g, '-');
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="restaurant-card" onClick={handleRestaurantClick}>
      {name}
    </div>
  );
};

const MainPage = ({ restaurants, searchQuery, handleSearchChange, handleLogin, handleLogout, isLoggedIn }) => {
 
 const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };

  return (
    <div className="App">
      <Navigation handleSearchChange={handleSearchChange} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <main>
        <div className="categories">
          <Category name="배달" />
          <Category name="한식" />
          <Category name="분식" />
          <Category name="일식" />
          <Category name="치킨" />
          <Category name="피자" />
          <Category name="중식" />
          <Category name="족발" />
          <Category name="야식" />
          <Category name="도시락" />
          <Category name="디저트" />
        </div>
        <Slider className="main-slider" {...settings}>
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={index} name={restaurant} />
          ))}
        </Slider>
        <div className="restaurants">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={index} name={restaurant} />
          ))}
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [restaurants, setRestaurants] = useState([
    '엽기떡볶이',
    '교촌치킨',
    '반올림피자샵',
    '배스킨라빈스',
    '원할머니보쌈',
    '홍콩반점',
    '버거킹',
    '서브웨이'
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 서버에서 음식점 목록을 가져오는 API 호출 등의 로직
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // 검색어에 따라 음식점을 필터링하거나 서버에 검색 요청을 보낼 수 있는 로직
  };
  
  return (
    <Router>
      <AuthProvider>
      {/* Navbar를 모든 페이지에 표시 */}
      <Navbar handleSearchChange={handleSearchChange} />
      <Routes>
        {/* 메인페이지 */}
        <Route
          path="/"
          element={
            <>
              <MainPage
                restaurants={restaurants}
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
              />
            </>
          }
        />

       {/* 나머지 페이지 */}
       <Route path="/mypage" element={<MyPage />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />

        {/* 로그인 페이지 - Navbar를 표시하지 않음 */}
        <Route path="/login" element={<Login />} />

        <Route path="/wishlist" element={<Wishlist />} />

        {/* 장바구니 페이지 - Navbar를 표시하지 않음 */}
        <Route path="/cart" element={<Cart />} />

        <Route path="/payment" element={<Payment />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sns-signup" element={<SnsSignup />} />
        <Route path="/managermain" element={<ManagerMain />} />
        <Route path="/store-info-edit" element={<StoreInfoEdit />} /> 
        <Route path="/add-menu" element={<AddMenu />} />

      </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;