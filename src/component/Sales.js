// sales.js

import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './Sales.css';

const generateRandomData = (length, max) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max));
};

const generateYearlySalesData = (years, max) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - years + 1;

  return Array.from({ length: years }, (_, index) => {
    const year = startYear + index;
    return {
      year: year,
      sales: Math.floor(Math.random() * max),
    };
  });
};

const Sales = () => {
  const [salesType, setSalesType] = useState('daily');
  const [yearlySales, setYearlySales] = useState([]); // Assuming 8 years of data
  const [monthlySales, setMonthlySales] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuSales, setMenuSales] = useState([
    { name: '메뉴1', quantity: 10, price: 5000 },
    { name: '메뉴2', quantity: 15, price: 7000 },
    { name: '메뉴3', quantity: 8, price: 3000 },
    // ... 더 많은 메뉴 데이터
  ]);

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem('store_id');
    //판매 정보 데이터를 가져오는 코드
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/sales/${id}`, {
          // Add headers or parameters as needed
        });

        setDailySales(response.data.dailySales);
        setMonthlySales(response.data.monthSales);
        setYearlySales(response.data.yearSales);
        // setMenuSales(response.data); // Assuming the server returns an array of menu sales data
      } catch (error) {
        console.error('Error fetching menu sales:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(yearlySales);

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    let data, labels;

    switch (salesType) {
      case 'yearly':
        data = yearlySales.map(item => item.sum);
        labels = yearlySales.map(item => item.date.toString());
        break;
      case 'monthly':
        data = monthlySales;
        labels = Array.from({ length: 12 }, (_, index) => (index + 1).toString());
        break;
      case 'daily':
        data = dailySales;
        labels = ['일', '월', '화', '수', '목', '금', '토'];
        break;
      default:
        break;
    }

    const newChart = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `${salesType === 'yearly' ? '연도별' : salesType === 'monthly' ? '월별' : salesType === 'weekly' ? '주차별' : '이번 주'} 매출`,
            data: data,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
      },
      options: {
        // 추가적인 차트 옵션 설정 가능
      },
    });

    chartRef.current = newChart;
  }, [salesType, monthlySales, yearlySales, dailySales]);

  const handleButtonClick = (type) => {
    setSalesType(type);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // 여기에서 선택한 날짜에 따른 메뉴별 수량과 가격을 가져오는 로직을 추가할 수 있습니다.
  };

  const dailyTotal = dailySales.reduce((acc, value) => acc + value, 0);
  return (
    <div className="sales-container">
      <div>
        <button onClick={() => handleButtonClick('yearly')}>연도별 매출</button>
        <button onClick={() => handleButtonClick('monthly')}>월별 매출</button>
        <button onClick={() => handleButtonClick('daily')}>이번 주 매출</button>
      </div>
      <div>
        <p>{`${salesType === 'daily' ? '이번 주' : salesType === 'monthly' ? '월별' : '연도별'} 매출 총 합계: ${dailyTotal}`}</p>
        <canvas ref={canvasRef} />
      </div>
      <div>
        <hr />
        <p>선택한 날짜: {selectedDate.toISOString().split('T')[0]}</p>
        {/* 달력 컴포넌트 추가 */}
        <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={(e) => handleDateChange(new Date(e.target.value))} />
        <ul>
          {menuSales.map((menu, index) => (
            <li key={index}>
              {menu.name} - 수량: {menu.quantity}, 가격: {menu.price}원
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sales;