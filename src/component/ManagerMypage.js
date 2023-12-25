import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagerMypage.css'; // Import the CSS file for styling
import DaumPostcode from 'react-daum-postcode';

const ManagerMypage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({ ...userInfo });
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const openModal = () => {
    setUpdatedUserInfo({ ...userInfo });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const handleAddressSelect = (data) => {
    const selectedAddress = `${data.address}`;
    setUpdatedUserInfo({ ...updatedUserInfo, address: selectedAddress });
    closeAddressModal();
  };

  useEffect(() => {
    axios.get('/api/user', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        setUserInfo(response.data);
        setUpdatedUserInfo(response.data); // Initialize updatedUserInfo with current user info
        return response;
      })
      .catch((error) => console.log(error));
  }, []);

  const handleUpdate = async () => {
    const confirmWithdrawal = window.confirm('회원 정보를 수정하시겠습니까?');

    if (confirmWithdrawal) {
      try {
        const response = await axios.put('api/user', updatedUserInfo, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          },
        });

        setUserInfo(updatedUserInfo);
        setModalOpen(false); // Close the modal after successful update
        alert("회원정보 수정이 완료되었습니다.");
      } catch (error) {
        console.error('사용자 정보 업데이트 실패:', error.message);
        // 에러 핸들링 로직 추가
      }
    }
  };

  const handleWithdrawal = async () => {
    const confirmWithdrawal = window.confirm('정말로 회원을 탈퇴하시겠습니까?');

    if (confirmWithdrawal) {
      try {
        // Logic for user withdrawal
        await axios.delete('/api/user', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          },
        });
        // Additional logic to handle successful withdrawal
        alert("회원탈퇴가 완료되었습니다.");
      } catch (error) {
        console.error('회원탈퇴 실패:', error.message);
        // 에러 핸들링 로직 추가
      }
    }
  };

  // 가입일자를 원하는 형식으로 포맷팅하는 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="my-page-container">
      <h2>마이페이지</h2>
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
            <td>주소</td>
            <td>{userInfo.address + " " + userInfo.detail}</td>
          </tr>
          <tr>
            <td>가입일</td>
            <td>{formatDate(userInfo.createdDate)}</td>
          </tr>
        </tbody>
      </table>

      <div className="button-container">
        <span><button onClick={openModal}>회원정보 수정</button></span>
        <span><button onClick={handleWithdrawal}>회원탈퇴</button></span>
      </div>

      {/* 수정 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>회원정보 수정</h2>
            <div>
              <label htmlFor="updatedUsername"> 사용자 이름</label>
              <input
                type="text"
                id="updatedUsername"
                value={updatedUserInfo.name}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, name: e.target.value })
                }
              />
            </div>
            {/* <div>
              <label htmlFor="updatedEmail">이메일</label>
              <input
                type="text"
                id="updatedEmail"
                value={updatedUserInfo.email}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, email: e.target.value })
                }
              />
            </div> */}
            <div>
              <label htmlFor="updatedPhoneNumber"> 전화번호</label>
              <input
                type="text"
                id="updatedPhoneNumber"
                value={updatedUserInfo.phone}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="updatedAddress"> 주소</label>
              <div className='location-container'>
                <input
                  type="text"
                  id="updatedAddress"
                  value={updatedUserInfo.address}
                  onChange={(e) =>
                    setUpdatedUserInfo({ ...updatedUserInfo, address: e.target.value })
                  }
                />
                <button type="button" onClick={openAddressModal}>
                  주소검색
                </button>
              </div>
            </div>
            {isAddressModalOpen && (
              <div className="address-modal-overlay">
                <div className="address-modal">
                  <DaumPostcode
                    onComplete={handleAddressSelect}
                    autoClose
                    animation
                    height={500}
                  />
                  <button className="close-button" onClick={closeAddressModal}>
                    닫기
                  </button>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="updatedAddress">상세 주소</label>
              <input
                type="text"
                id="updatedAddress"
                value={updatedUserInfo.detail}
                onChange={(e) =>
                  setUpdatedUserInfo({ ...updatedUserInfo, detail: e.target.value })
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
    </div>
  );
};

export default ManagerMypage;
