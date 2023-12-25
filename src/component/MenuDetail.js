// MenuDetail.js

import React, { useState, useEffect } from 'react';
import './MenuDetail.css';
import axios from 'axios';

const MenuDetail = ({ selectedItem, onClose, setItemInfo }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editedProductInfo, setEditedProductInfo] = useState({});
  const [file, setFile] = useState(null);

  // 선택된 메뉴 정보가 변경될 때마다 상태 업데이트
  useEffect(() => {
    setEditedProductInfo(selectedItem);

    console.log(selectedItem.picture);
  }, [selectedItem]);

  const openEditModal = () => {
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setFile(null);
    setEditModalOpen(false);
  };

  const handleUpdate = async () => {

    const confirmWithdrawal = window.confirm('메뉴를 수정하시겠습니까?');

    if (confirmWithdrawal) {
      try {
        const formData = new FormData();
        formData.append('file', file); // 'file'은 서버에서 요청을 처리하는 데 사용된 매개변수 이름입니다.
        formData.append('item', new Blob([JSON.stringify(editedProductInfo)], {
          type: "application/json"
        }));

        const id = editedProductInfo.itemId;
        const response = await axios.put(`/api/items/${id}`, formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'multipart/form-data',
          },
        });

        // 응답을 처리하거나 필요한 경우 추가적인 로직을 수행합니다.
        console.log('상품이 성공적으로 업데이트되었습니다:', response.data);
        alert('상품이 성공적으로 업데이트되었습니다');

        // 수정 모달 닫기
        closeEditModal();
        onClose(response.data);
      } catch (error) {
        console.error('상품 업데이트 실패:', error);
        // 오류를 적절하게 처리합니다.
        alert('상품 업데이트 실패');
      }
    }
  };

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDelete = async () => {
    const confirmWithdrawal = window.confirm('아이템을 삭제하시겠습니까?');

    if (confirmWithdrawal) {
      try {
        // 서버의 삭제 엔드포인트로 DELETE 요청 보내기
        const id = editedProductInfo.itemId; // 상품의 ID 가져오기
        await axios.delete(`/api/items/${id}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        });

        // 삭제 성공 시 추가적인 로직을 수행할 수 있습니다.
        // itemInfo 상태를 업데이트하여 삭제한 상품을 제외한 목록을 다시 설정
        setItemInfo((prevItem) => prevItem.filter(item => item.itemId !== id));

        // 모달 닫기
        closeEditModal();
      } catch (error) {
        console.error('상품 삭제 실패:', error);
        alert('상품 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="MenuDetail">
      <h2>{editedProductInfo.itemName}</h2>

      {/* 상품에 대한 정보 */}
      <div>
        <h3>상품 정보</h3>
        <p>가격: {selectedItem.price}원</p>
        <img src={`http://localhost:8080/${selectedItem.picture}`} alt={selectedItem.name} />
        <p>상세 정보: {editedProductInfo.content}</p>
        <p>판매상태: {editedProductInfo.itemStatus === 'SALE' ? '판매중' : '재고소진'}</p> {/* 추가: 품절 여부 표시 */}
      </div>

      {/* 수정 버튼 */}
      <div className="action-buttons">
        <button className="edit-button" onClick={openEditModal}>
          수정
        </button>
        <button className="delete-button" onClick={handleDelete}>삭제</button>
        {/* <button className="soldout-button">매진</button> */}
      </div>

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>상품 정보 수정</h2>
            <div>
              <label htmlFor="editedName"> 상품 이름</label>
              <input
                type="text"
                id="editedName"
                value={editedProductInfo.itemName}
                onChange={(e) =>
                  setEditedProductInfo({ ...editedProductInfo, itemName: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="editedPrice"> 상품 가격</label>
              <input
                type="text"
                id="editedPrice"
                value={editedProductInfo.price}
                onChange={(e) =>
                  setEditedProductInfo({ ...editedProductInfo, price: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="editedImage"> 상품 이미지 </label>
              <input
                type="file"
                id="editedRepresentativeImage"
                // value={editedProductInfo.picture}
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <label htmlFor="menuImage">사진 미리보기 </label>
              <img
                src={file ? URL.createObjectURL(file) : null}
                alt="대표 사진 미리보기"
                style={{ width: '300px', height: '200px' }}
              />
            </div>
            <div>
              <label htmlFor="editedDescription"> 상세 정보</label>
              <textarea
                id="editedDescription"
                value={editedProductInfo.content}
                onChange={(e) =>
                  setEditedProductInfo({ ...editedProductInfo, content: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="editedAvailability"> 판매상태</label>
              <select
                id="editedAvailability"
                value={editedProductInfo.itemStatus}
                onChange={(e) =>
                  setEditedProductInfo({
                    ...editedProductInfo,
                    itemStatus: e.target.value,
                  })
                }
              >
                <option value='SALE'>판매중</option>
                <option value='SOLD'>재고소진</option>
              </select>
            </div>
            <div>
              <button onClick={handleUpdate}>수정 완료</button>
              <button onClick={closeEditModal}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDetail;
