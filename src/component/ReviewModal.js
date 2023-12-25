//mypage 리뷰작성 모달
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewModal = ({ isOpen, onClose, onSubmit, order }) => {
  const [newReview, setNewReview] = useState({
    id: null,
    rating: 1
  });
  const [file, setFile] = useState(null);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('https://picsum.photos/id/237/200/300');

  const handleRatingChange = (value) => {
    setNewReview({ ...newReview, rating: value });
  };

  const handleCommentChange = (e) => {
    setNewReview({ ...newReview, content: e.target.value })
  };

  const handleSubmit = async () => {
    try {
      console.log('order 값:', order);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('review', new Blob([JSON.stringify(newReview)], {
        type: "application/json"
      }));

      const response = await axios.post(`/api/review/${order.orderId}`, formData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'multipart/form-data',
        },
      });

      const reviewData = response.data;

      setNewReview(prevReview => ({ ...prevReview, id: reviewData.id }));

      alert('리뷰 등록에 성공했습니다.');

      // 리뷰 작성이 완료된 경우에만 true로 설정
      setIsSubmitClicked(true);
    } catch (error) {
      console.error('리뷰 등록 오류:', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    // 작성 완료 버튼이 클릭된 경우에만 실행
    if (isSubmitClicked) {
      onSubmit(newReview);
      onClose();
    }
  }, [isSubmitClicked, newReview]);

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal">
        <h2>리뷰 작성</h2>
        <div>
          <label htmlFor="rating">별점 선택</label>
          <select id="rating" value={newReview.rating} onChange={(e) => handleRatingChange(Number(e.target.value))}>
            <option value={1}>1점</option>
            <option value={2}>2점</option>
            <option value={3}>3점</option>
            <option value={4}>4점</option>
            <option value={5}>5점</option>
          </select>
        </div>
        <div>
          <label htmlFor="reviewImage">리뷰 사진 </label>
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
            <label htmlFor="reviewImage">사진 미리보기 </label>
            <img
              src={file ? URL.createObjectURL(file) : null}
              alt="리뷰 사진 미리보기"
              style={{ width: '300px', height: '200px' }}
            />
          </div>
        )}
        <div>
          <label htmlFor="content">리뷰 작성</label>
          <textarea
            id="content"
            value={newReview.content}
            onChange={handleCommentChange}
            placeholder="리뷰를 작성해주세요."
          />
        </div>
        <div>
          <button className="submit-button" onClick={handleSubmit}>
            작성 완료
          </button>
          <button className="close-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
