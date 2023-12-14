// sales.js

import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import './Sales.css';

const generateRandomData = (length, max) => {
  return Array.from({ length }, () => Math.floor(Math.random() * max));
};


const generateWeeklyData = () => {
  // Assuming today is Sunday
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Move to the start of the week (Sunday)

  return Array.from({ length: 4 }, (_, weekIndex) => {
    const currentWeekStart = new Date(startOfWeek);
    currentWeekStart.setDate(startOfWeek.getDate() + weekIndex * 7);
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);

    return `${currentWeekStart.toLocaleDateString()} - ${currentWeekEnd.toLocaleDateString()}`;
  });
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
  const [salesType, setSalesType] = useState('yearly');
  const [yearlySales, setYearlySales] = useState(generateYearlySalesData(8, 5000)); // Assuming 8 years of data

  const [monthlySales, setMonthlySales] = useState(generateRandomData(12, 5000));
  const [weeklySales, setWeeklySales] = useState(generateRandomData(4, 5000));
  const [dailySales, setDailySales] = useState(generateRandomData(7, 5000));
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
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    let data, labels;

    switch (salesType) {
      case 'yearly':
        data = yearlySales.map(item => item.sales);
        labels = yearlySales.map(item => item.year.toString());
        break;
      case 'monthly':
        data = monthlySales;
        labels = Array.from({ length: 12 }, (_, index) => (index + 1).toString());
        break;
      case 'weekly':
        data = weeklySales;
        labels = Array.from({ length: 4 }, (_, index) => (index + 1).toString());
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
  }, [salesType, weeklySales, monthlySales, yearlySales, dailySales]);

  const handleButtonClick = (type) => {
    setSalesType(type);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // 여기에서 선택한 날짜에 따른 메뉴별 수량과 가격을 가져오는 로직을 추가할 수 있습니다.
  };

  const weeklyTotal = weeklySales.reduce((acc, value) => acc + value, 0);
  return (
    <div className="sales-container">
      <div>
        <button onClick={() => handleButtonClick('yearly')}>연도별 매출</button>
        <button onClick={() => handleButtonClick('monthly')}>월별 매출</button>
        <button onClick={() => handleButtonClick('weekly')}>주차별 매출</button>
        <button onClick={() => handleButtonClick('daily')}>이번 주 매출</button>
      </div>
      <div>
        <p>{`${salesType === 'daily' ? '이번 주' : salesType === 'weekly' ? '주차별' : salesType === 'monthly' ? '월별' : '연도별'} 매출 총 합계: ${weeklyTotal}`}</p>
        <canvas ref={canvasRef} />
      </div>
      <div>
        <hr />
        <p>선택한 날짜: {selectedDate.toLocaleDateString()}</p>
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