// app.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
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
import CategoryPage from './component/CategoryPage';
import Register from './component/Register';
import MenuManagement from './component/MenuManagement';
import ManagerMypage from './component/ManagerMypage';
import GeneralManager from './component/GeneralManager';
import MenuNavbar from './component/MenuNavbar';
import Sales from './component/Sales';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import axios from 'axios';
import { AuthProvider } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBone, faBowlRice, faShrimp, faSushiRoll, faBowlFood, faMoon, faHotTub, faHamburger, faUtensils, faFish, faDrumstickBite, faPizzaSlice, faCocktail, faBriefcase, faIceCream } from '@fortawesome/free-solid-svg-icons';
import { GiNoodles, GiSteak } from "react-icons/gi";

const Navigation = ({ handleSearchChange }) => {

};

const Category = ({ name }) => {
  return (
    <div className="category">
      {name}
    </div>
  );
};

const RestaurantCard = ({ id, name, picture, rating }) => {
  const navigate = useNavigate();

  const handleRestaurantClick = () => {
    const restaurantId = id;
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="restaurant-card" onClick={handleRestaurantClick}>
      <img src={picture === 'upload\\storeImg\\231223\\' ? `http://localhost:8080/upload\\itemImg\\231215\\NoImage.png` : `http://localhost:8080/${picture}`}
        alt={`사진: ${name}`}
        style={{ width: '250px', height: '250px' }} />
      <h3>{name}</h3>
      <p>평점: {Number(rating.toFixed(2))}</p>
    </div>
  );
};

const MainPage = ({ restaurants, searchQuery, handleSearchChange, handleLogin, handleLogout, isLoggedIn, fetchRestaurants }) => {
  const [categoryRestaurants, setCategoryRestaurants] = useState([]);
  const { state } = useLocation();

  useEffect(() => {
    // 처음 로드될 때는 전체 음식점 목록을 설정
    setCategoryRestaurants(restaurants);
  }, [restaurants]);

  useEffect(() => {
    if (state?.reload) {
      fetchRestaurants();
      navigate('/', { replace: true, state: { reload: false } });
    }
  }, [state?.reload]);

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    /// 선택된 카테고리에 해당하는 음식점만 필터링
    const filteredRestaurants = restaurants.filter(restaurant => restaurant.category === category);
    setCategoryRestaurants(filteredRestaurants);
  };

  return (
    <div className="App">
      <Navigation handleSearchChange={handleSearchChange} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <main>
        <div className="categories">
          <div onClick={() => handleCategoryClick('한식')} className="category">
            <FontAwesomeIcon icon={faBowlFood} size="2x" />한식
          </div>
          <div onClick={() => handleCategoryClick('분식')} className="category">
            <FontAwesomeIcon icon={faUtensils} size="2x" />분식
          </div>
          <div onClick={() => handleCategoryClick('일식, 회, 돈까스')} className="category">
            <FontAwesomeIcon icon={faShrimp} size="2x" />일식, 회, 돈까스
          </div>
          <div onClick={() => handleCategoryClick('양식')} className="category">
            <GiSteak fontSize="30px" />양식
          </div>
          <div onClick={() => handleCategoryClick('치킨')} className="category">
            <FontAwesomeIcon icon={faDrumstickBite} size="2x" />치킨
          </div>
          <div onClick={() => handleCategoryClick('피자')} className="category">
            <FontAwesomeIcon icon={faPizzaSlice} size="2x" />피자
          </div>
          <div onClick={() => handleCategoryClick('중식')} className="category">
            <FontAwesomeIcon icon={faBowlRice} size="2x" />중식
          </div>
          <div onClick={() => handleCategoryClick('족발, 보쌈')} className="category">
            <FontAwesomeIcon icon={faBone} size="2x" />족발, 보쌈
          </div>
          <div onClick={() => handleCategoryClick('버거')} className="category">
            <FontAwesomeIcon icon={faHamburger} size="2x" />버거
          </div>
          <div onClick={() => handleCategoryClick('국수')} className="category">
            <GiNoodles fontSize="30px" />국수
          </div>
        </div>
        <div className="restaurants">
          {categoryRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              picture={restaurant.picture}
              rating={restaurant.rating}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

const App = () => {

  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = () => {
    axios.get('/api/stores', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => console.log(error));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // 검색어에 따라 음식점을 필터링하거나 서버에 검색 요청을 보낼 수 있는 로직
  };

  return (
    <Router>
      <AuthProvider>
        {/* Navbar를 모든 페이지에 표시 */}
        <Navbar handleSearchChange={handleSearchChange} />
        <MenuNavbar handleSearchChange={handleSearchChange} fetchRestaurants={fetchRestaurants} />
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
                  fetchRestaurants={fetchRestaurants}
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
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/sns-signup" element={<SnsSignup />} />
          <Route path="/managermain" element={<ManagerMain />} />
          <Route path="/store-info-edit" element={<StoreInfoEdit />} />
          <Route path="/add-menu" element={<AddMenu />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/manager-mypage" element={<ManagerMypage />} />
          <Route path="/menu-management" element={<MenuManagement />} />
          <Route path="/general-manager" element={<GeneralManager />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;