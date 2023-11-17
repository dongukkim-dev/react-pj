// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './login.css'; 
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // 로그인 로직 구현: 서버로 아이디와 비밀번호 전송 등
    console.log('로그인 시도:', { username, password });
    alert('로그인 시도');

    axios.post("/api/login", {
      email: username,
      password: password
    })
    .then(res => {
      console.log("200", res.data);

      if (res.status === 200) {
        navigate('/');
      }
    })
    .catch(error => console.log(error))
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
        <label htmlFor="username">아이디:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">비밀번호:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

export default Login;
