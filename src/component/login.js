// Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './login.css'; 
import axios from 'axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const {email, password} = user;

  const handleUser = (e) => {
    const {value, name} = e.target;
    setUser({
      ...user,
      [name]:value
    });
  }

  const handleLogin = () => {
    // 실제 로그인 로직을 수행합니다.
    // 성공하면 관리자 페이지로 이동합니다.
    console.log('로그인 시도:', { email, password });

    function success_user() {
      login();
      navigate('/');
    };
    function success_admin() {
      login();
      navigate('/managermain');
    }
    function fail() {
      alert('로그인 실패했습니다.');
    };

    httpRequest('/api/login', user, success_user, success_admin, fail);

    // 여기에서 로그인 성공 여부를 판단하여 페이지 이동
    // const loginSuccessful = true; // 예시로 성공했다고 가정

    // if (loginSuccessful) {
    //   navigate('/managermain');

    // } else {
    //   alert('로그인 실패. 올바른 사용자 이름과 비밀번호를 입력하세요.');
    // }
  };
  const handleSocialLogin = (provider) => {
    // SNS 로그인 로직 구현
    console.log(`SNS ${provider} 계정으로 로그인 시도`);
  };

  const handleSignUp = () => {
    // 회원가입 페이지로 이동 또는 회원가입 모달 표시 등의 로직
    console.log('회원가입 페이지로 이동');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div>
        <label htmlFor="email">아이디:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={handleUser}
        />
      </div>
      <div>
        <label htmlFor="password">비밀번호:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleUser}
        />
      </div>
      <div>
      {/* <Link to="/managermain"> */}
        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>
        {/* </Link> */}
      </div>
      <div>
      <Link to="/sns-signup">
          <button className="social-button-google" onClick={() => handleSocialLogin('Google')}>Google로 로그인</button>
        </Link>
        <Link to="/sns-signup">
          <button className="social-button-facebook" onClick={() => handleSocialLogin('Facebook')}>Facebook으로 로그인</button>
        </Link>
      </div>
      {/* <div className="signup-text" onClick={handleSignUp}>아직 회원이 아니신가요?</div>
      <button className="signup-link" onClick={handleSignUp}>회원가입</button> */}
       <div className="signup-text">
        아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
};

// 쿠키를 가져오는 함수
function getCookie(key) {
  var result = null;
  var cookie = document.cookie.split(';');
  cookie.some(function (item) {
      item = item.replace(' ', '');

      var dic = item.split('=');

      if (key === dic[0]) {
          result = dic[1];
          return true;
      }
  });

  return result;
}

function httpRequest(url, body, success_user, success_admin, fail) {
  axios.post(url, body, {
    headers: { // 로컬 스토리지에서 액세스 토큰 값을 가져와 헤더에 추가
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (response.status === 200 || response.status === 201) {
        localStorage.setItem('access_token', response.data.token);
        console.log('response 값 출력', response.data.role);

        if (response.data.role == 'ROLE_ADMIN') {
          return success_admin();
        }
        else {
          return success_user();
        }
        
    } 
    else {
        return fail();
    }
  });
}

export default Login;