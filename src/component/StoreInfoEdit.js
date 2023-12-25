// StoreInfoEdit.js
import React, { useState, useEffect } from 'react';
import './StoreInfoEdit.css';
import axios from 'axios';
import MenuDetail from './MenuDetail';

const StoreInfoEdit = () => {
  const [activeTab, setActiveTab] = useState('storeInfo');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isNewMenuItemModalOpen, setNewMenuItemModalOpen] = useState(false);
  const [isAddMenuModalOpen, setAddMenuModalOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState({});
  const [updatedStoreInfo, setUpdatedStoreInfo] = useState({ ...storeInfo });
  const [previewUrl, setPreviewUrl] = useState('https://picsum.photos/id/237/200/300');

  // 새로운 상태 추가
  const [selectedMenuItem, setSelectedMenuItem] = useState({});

  const [itemInfo, setItemInfo] = useState({});
  const [newMenuItem, setNewMenuItem] = useState({
    itemStatus: 'SALE',
  });
  const [file, setFile] = useState(null);
  const storeId = localStorage.getItem('store_id');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/store/${storeId}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          },
        });
        setStoreInfo(response.data);
        setUpdatedStoreInfo(response.data);

        const res = await axios.get(`/api/items/${storeId}`, {
          params: {
            size: 100
          },
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          },
        });

        // item.deleted가 false인 아이템만 저장
        const nonDeletedItems = res.data.content.filter((item) => !item.deleted);

        setItemInfo(nonDeletedItems);
      } catch (error) {
        console.error('가게 정보 불러오기 실패:', error);
      }
    };

    fetchData();
  }, []);

  const handleMenuClick = (menuItem) => {
    // 메뉴 클릭 시 해당 메뉴의 정보를 selectedMenuItem 상태에 저장
    setSelectedMenuItem(menuItem);
    // 모달 열기
    setNewMenuItemModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setFile(null);
    setEditModalOpen(false);
  };

  //가게 정보 수정
  const handleUpdate = async (e) => {
    e.preventDefault();

    const confirmWithdrawal = window.confirm('가게 정보를 수정하시겠습니까?');

    if (confirmWithdrawal) {
      try {
        const id = localStorage.getItem('store_id');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('store', new Blob([JSON.stringify(updatedStoreInfo)], {
          type: "application/json"
        }));

        const response = await axios.put(`/api/store/${id}`, formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'multipart/form-data',
          },
        });

        setStoreInfo(updatedStoreInfo);
        closeEditModal();
      } catch (error) {
        console.error('업데이트 실패:', error);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUpdatedStoreInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  //메뉴 추가
  const handleAddMenu = async (e) => {
    e.preventDefault();

    const confirmWithdrawal = window.confirm('메뉴를 추가하시겠습니까?');

    if (confirmWithdrawal) {
      try {
        const formData = new FormData();
        formData.append('file', file); // 이미지 파일 추가
        formData.append('item', new Blob([JSON.stringify(newMenuItem)], {
          type: "application/json"
        }));

        const id = localStorage.getItem('store_id');
        const response = await axios.post(`api/items/${id}`, formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'multipart/form-data',
          },
        });

        // 추가된 메뉴의 ID 얻기
        const newMenuId = response.data.itemId;

        // 서버에서 추가된 메뉴의 상세 정보 다시 받아오기
        const menuResponse = await axios.get(`/api/item/${newMenuId}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          },
        });

        // 서버에서 받아온 메뉴 정보로 selectedMenuItem 업데이트
        setSelectedMenuItem(menuResponse.data);

        console.log('메뉴 추가 성공:', menuResponse.data);
        setItemInfo((prevItem) => [...prevItem, menuResponse.data]);
        setAddMenuModalOpen(false);
        setNewMenuItem(null);
        setFile(null);

        alert('메뉴가 추가 되었습니다.');
      } catch (error) {
        console.error('메뉴 추가 실패:', error);
        alert('메뉴 추가에 실패했습니다.');
      }
    }
  };

  const openAddMenuModal = () => {
    setAddMenuModalOpen(true);
  };

  const closeAddMenuModal = () => {
    setFile(null);
    setAddMenuModalOpen(false);
  };

  const openNewMenuItemModal = () => {
    setNewMenuItemModalOpen(true);
  };

  const closeNewMenuItemModal = () => {
    setNewMenuItemModalOpen(false);
  };

  // StoreInfoEdit.js에서 이미지 업데이트 처리
  const handleMenuDetailClose = (data) => {
    // 이미 있는 아이템인지 확인
    const isItemExist = itemInfo.some(item => item.itemId === data.itemId);

    console.log('존재확인', isItemExist);

    if (isItemExist) {
      setItemInfo((prevItem) =>
        prevItem.map(item =>
          item.itemId === data.itemId ? { ...item, ...data } : item
        )
      );
    }

    console.log(itemInfo);

    closeNewMenuItemModal();
  };

  //activeTab === 'storeInfo' 에서 가게 정보가 출력되어야함
  return (
    <div className="storeinfoedit-container">

      <div className="tab-navigation">
        <button
          onClick={() => handleTabClick('storeInfo')}
          className={activeTab === 'storeInfo' ? 'active' : ''} // 주석: 활성 탭일 때 클래스 추가
        >
          가게 정보
        </button>
        <button
          onClick={() => handleTabClick('menuManagement')}
          className={activeTab === 'menuManagement' ? 'active' : ''} // 주석: 활성 탭일 때 클래스 추가
        >
          메뉴 관리
        </button>
      </div>


      {activeTab === 'storeInfo' && (
        <>

          <form>
            <div>
              <label htmlFor="name">가게 이름</label>
              <p>{storeInfo.name}</p>
            </div>
            <div>
              <label htmlFor="address">가게 위치</label>
              <p>{storeInfo.address + " " + storeInfo.detail}</p>
            </div>
            <div>
              <label htmlFor="phone">가게 전화번호</label>
              <p>{storeInfo.phone}</p>
            </div>
            <div>
              <label htmlFor="content">상세 내용</label>
              <p>{storeInfo.content}</p>
            </div>
            <div>
              <label htmlFor="editedRepresentativeImage"> 대표 사진</label>
              <img
                src={`http://localhost:8080/${storeInfo.picture}`}
                alt="대표 사진 미리보기"
                style={{ width: '400px', height: '300px' }}
              />
            </div>
            <div>
              <label htmlFor="openTime">영업 오픈 시간</label>
              <p>{storeInfo.openTime}</p>
            </div>
            <div>
              <label htmlFor="closeTime">영업 종료 시간</label>
              <p>{storeInfo.closeTime}</p>
            </div>
            <button type="button" onClick={openEditModal}>
              가게 정보 수정
            </button>

            {isEditModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>가게 정보 수정</h2>
                  <div>
                    <label htmlFor="editedName"> 가게 이름</label>
                    <input
                      type="text"
                      id="editedName"
                      value={updatedStoreInfo.name}
                      onChange={(e) =>
                        setUpdatedStoreInfo({ ...updatedStoreInfo, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="editedLocation"> 가게 위치</label>
                    <input
                      type="text"
                      id="editedLocation"
                      value={updatedStoreInfo.address}
                      onChange={(e) =>
                        setUpdatedStoreInfo({ ...updatedStoreInfo, address: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="editedLocation"> 상세 주소</label>
                    <input
                      type="text"
                      id="editedLocation"
                      value={updatedStoreInfo.detail}
                      onChange={(e) =>
                        setUpdatedStoreInfo({ ...updatedStoreInfo, detail: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="editedPhoneNumber"> 가게 전화번호</label>
                    <input
                      type="text"
                      id="editedPhoneNumber"
                      value={updatedStoreInfo.phone}
                      onChange={(e) =>
                        setUpdatedStoreInfo({
                          ...updatedStoreInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="editedRepresentativeImage"> 대표 사진</label>
                    <div>
                      <input
                        type="file"
                        id="editedRepresentativeImage"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                  {previewUrl && (
                    <div>
                      <label htmlFor="menuImage">사진 미리보기 </label>
                      <img
                        src={file ? URL.createObjectURL(file) : null}
                        alt="대표 사진 미리보기"
                        style={{ width: '300px', height: '200px' }}
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="editedDetails"> 상세 내용</label>
                    <textarea
                      id="editedDetails"
                      value={updatedStoreInfo.content}
                      onChange={(e) =>
                        setUpdatedStoreInfo({
                          ...updatedStoreInfo,
                          content: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="editedOpeningTime">영업 시작 시간:</label>
                    <input
                      type="time"
                      id="editedOpeningTime"
                      value={updatedStoreInfo.openTime}
                      onChange={(e) =>
                        setUpdatedStoreInfo({
                          ...updatedStoreInfo,
                          openTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="editedClosingTime">영업 종료 시간:</label>
                    <input
                      type="time"
                      id="editedClosingTime"
                      value={updatedStoreInfo.closeTime}
                      onChange={(e) =>
                        setUpdatedStoreInfo({
                          ...updatedStoreInfo,
                          closeTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <button onClick={handleUpdate}>수정 완료</button>
                    <button onClick={closeEditModal}>닫기</button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </>
      )}

      {activeTab === 'menuManagement' && (
        <>

          <div className="order-list">
            {itemInfo.map((item) => (
              <div className="order-item" key={item.itemId} onClick={() => handleMenuClick(item)}>
                <span>{item.itemName}</span>
                <span>가격: {item.price}</span>
                <span className="status">{item.itemStatus === 'SALE' ? '판매중' : '재고소진'}</span>
              </div>
            ))}
          </div>

          <div className="add-menu-link">
            <button onClick={openAddMenuModal}>메뉴 추가</button>
          </div>

          {isAddMenuModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>메뉴 추가</h2>
                <form onSubmit={handleAddMenu}>
                  <div>
                    <label htmlFor="menuName">메뉴명:</label>
                    <input
                      type="text"
                      id="menuName"
                      value={newMenuItem.itemName}
                      onChange={(e) =>
                        setNewMenuItem({ ...newMenuItem, itemName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="menuPrice">가격:</label>
                    <input
                      type="text"
                      id="menuPrice"
                      value={newMenuItem.price}
                      onChange={(e) =>
                        setNewMenuItem({ ...newMenuItem, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="menuImage">대표 사진 </label>
                    <div>
                      <input
                        type="file"
                        id="editedRepresentativeImage"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                  {previewUrl && (
                    <div>
                      <label htmlFor="menuImage">사진 미리보기 </label>
                      <img
                        src={file ? URL.createObjectURL(file) : null}
                        alt="대표 사진 미리보기"
                        style={{ width: '300px', height: '200px' }}
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="menuDetails">상세 정보:</label>
                    <textarea
                      id="menuDetails"
                      value={newMenuItem.content}
                      onChange={(e) =>
                        setNewMenuItem({ ...newMenuItem, content: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <button type="submit">추가</button>
                    <button type="button" onClick={closeAddMenuModal}>
                      닫기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isNewMenuItemModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <MenuDetail selectedItem={selectedMenuItem} storeId={storeId} setItemInfo={setItemInfo} onClose={handleMenuDetailClose} />
                <button className="close-button" onClick={closeNewMenuItemModal}>
                  닫기
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StoreInfoEdit;