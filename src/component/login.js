// Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css'; 
import axios from 'axios';

const Login = () => {
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
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
    // 로그인 로직 구현: 서버로 아이디와 비밀번호 전송 등
    console.log('로그인 시도:', { email, password, user });
    alert('로그인 시도');

    function success() {
      navigate('/');
    };
    function fail() {
      alert('로그인 실패했습니다.');
      navigate('/login');
    };

    httpRequest('/api/login', user, success, fail);
    // axios.post('/api/login', user)
    // .then(res => {
    //   const token = res.data.token;
    //   localStorage.setItem('access_token', token);
    // });
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
          // onChange={(e) => setUsername(e.target.value)}
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
          // onChange={(e) => setPassword(e.target.value)}
          onChange={handleUser}
        />
      </div>
      <div>
        <button className="login-button" onClick={handleLogin}>로그인</button>
      </div>
      <div>
        <button className="social-button-google" onClick={() => handleSocialLogin('Google')}>Google로 로그인</button>
        <button className="social-button-facebook" onClick={() => handleSocialLogin('Facebook')}>Facebook으로 로그인</button>
      </div>
      {/* <div className="signup-text" onClick={handleSignUp}>아직 회원이 아니신가요?</div>
      <button className="signup-link" onClick={handleSignUp}>회원가입</button> */}
       <div className="signup-text">
        아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
};

function httpRequest(url, body, success, fail) {
  axios.post("/api/login", body, {
    headers: { // 로컬 스토리지에서 액세스 토큰 값을 가져와 헤더에 추가
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (response.status === 200 || response.status === 201) {
        return success();
    }
    const refresh_token = Cookies.get('refresh_token');
    if (response.status === 401 && refresh_token) {
        axios.post('/api/token', {
                refreshToken: refresh_token,
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(result => { // 재발급이 성공하면 로컬 스토리지값을 새로운 액세스 토큰으로 교체
                localStorage.setItem('access_token', result.accessToken);
                Cookies.set('access_token', result.accessToken);
                httpRequest(url, body, success, fail);
            })
            .catch(error => fail());
    } else {
        return fail();
    }
  });
}

export default Login;
