// // sales.js

// import { useState, useEffect, useRef } from 'react';
// import { Line } from 'react-chartjs-2';
// import Chart from 'chart.js/auto';
// import axios from 'axios';
// import './Sales.css';

// const generateRandomData = (length, max) => {
//   return Array.from({ length }, () => Math.floor(Math.random() * max));
// };

// const generateYearlySalesData = (years, max) => {
//   const currentYear = new Date().getFullYear();
//   const startYear = currentYear - years + 1;

//   return Array.from({ length: years }, (_, index) => {
//     const year = startYear + index;
//     return {
//       year: year,
//       sales: Math.floor(Math.random() * max),
//     };
//   });
// };

// const Sales = () => {
//   const [salesType, setSalesType] = useState('daily');
//   const [yearlySales, setYearlySales] = useState({}); // Assuming 8 years of data
//   const [monthlySales, setMonthlySales] = useState({});
//   const [dailySales, setDailySales] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [menuSales, setMenuSales] = useState([
//     { name: '메뉴1', quantity: 10, price: 5000 },
//     { name: '메뉴2', quantity: 15, price: 7000 },
//     { name: '메뉴3', quantity: 8, price: 3000 },
//     // ... 더 많은 메뉴 데이터
//   ]);

//   const canvasRef = useRef(null);
//   const chartRef = useRef(null);

//   // API 데이터를 변환하는 함수
//   const transformData = (apiData) => {
//     const transformedData = [];

//     // 초기 연도 데이터 생성
//     for (let year = 2016; year <= 2023; year++) {
//       transformedData.push({ date: year, sum: 0 });
//     }

//     // API 데이터 적용
//     apiData.yearSales.forEach(({ date, sum }) => {
//       const year = parseInt(date, 10);
//       const index = year - 2016;
//       transformedData[index] = { date: year, sum };
//     });

//     return transformedData;
//   };

//   useEffect(() => {
//     const id = localStorage.getItem('store_id');
//     //판매 정보 데이터를 가져오는 코드
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`/api/sales/${id}`, {
//           headers: {
//             Authorization: 'Bearer ' + localStorage.getItem('access_token'),
//             'Content-Type': 'application/json',
//           },
//         });

//         // // 데이터 변환 로직 추가
//         const transformedYearlySales = transformData(response.data);
//         console.log('변환된 yearly 데이터', transformedYearlySales);

//         setDailySales(response.data.dailySales);
//         setMonthlySales(response.data.monthSales);
//         setYearlySales(transformedYearlySales);
//         console.log('저장된 yearly 데이터', yearlySales);
//         // setMenuSales(response.data); // Assuming the server returns an array of menu sales data
//       } catch (error) {
//         console.error('Error fetching menu sales:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     console.log('yearlySales', yearlySales, monthlySales, dailySales);

//     if (chartRef.current) {
//       chartRef.current.destroy();
//     }

//     let data, labels;

//     switch (salesType) {
//       case 'yearly':
//         data = yearlySales.map(item => item.sum);
//         labels = yearlySales.map(item => item.date);
//         // labels = [2020, 2021, 2022, 2023];
//         break;
//       case 'monthly':
//         data = monthlySales.map(item => item.sum);
//         labels = Array.from({ length: 12 }, (_, index) => (index + 1).toString());
//         // labels = monthlySales.map(item => item.date);
//         break;
//       case 'daily':
//         data = dailySales.map(item => item.sum);
//         labels = ['일', '월', '화', '수', '목', '금', '토'];
//         break;
//       default:
//         break;
//     }

//     const newChart = new Chart(canvasRef.current, {
//       type: 'line',
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: `${salesType === 'yearly' ? '연도별' : salesType === 'monthly' ? '월별' : salesType === 'weekly' ? '주차별' : '이번 주'} 매출`,
//             data: data,
//             fill: false,
//             backgroundColor: 'rgba(75,192,192,0.4)',
//             borderColor: 'rgba(75,192,192,1)',
//           },
//         ],
//       },
//       options: {
//         // 추가적인 차트 옵션 설정 가능
//         scales: {
//           x: {
//             ticks: {
//               autoSkip: false,
//               maxRotation: 0,
//               minRotation: 0,
//               mirror: false,
//               padding: 10,
//               callback: function (value, index, values) {
//                 return value; // This ensures that the label value is used as-is without modification
//               },
//             }
//           }
//         }
//       },
//     });

//     chartRef.current = newChart;
//   }, [salesType, monthlySales, yearlySales, dailySales]);

//   const handleButtonClick = (type) => {
//     setSalesType(type);
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     // 여기에서 선택한 날짜에 따른 메뉴별 수량과 가격을 가져오는 로직을 추가할 수 있습니다.
//   };

//   const dailyTotal = dailySales.reduce((acc, value) => acc + value, 0);
//   return (
//     <div className="sales-container">
//       <div>
//         <button onClick={() => handleButtonClick('yearly')}>연도별 매출</button>
//         <button onClick={() => handleButtonClick('monthly')}>월별 매출</button>
//         <button onClick={() => handleButtonClick('daily')}>이번 주 매출</button>
//       </div>
//       <div>
//         {/* <p>{`${salesType === 'daily' ? '이번 주' : salesType === 'monthly' ? '월별' : '연도별'} 매출 총 합계: ${dailyTotal}`}</p> */}
//         <p>{`${salesType === 'daily' ? '이번 주' : salesType === 'monthly' ? '월별' : '연도별'} 매출 총 합계: `}</p>
//         <canvas ref={canvasRef} />
//       </div>

//     </div>
//   );
// };

// export default Sales;

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
  const [yearlySales, setYearlySales] = useState({}); // Assuming 8 years of data
  const [monthlySales, setMonthlySales] = useState({});
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

  // API 데이터를 변환하는 함수
  const transformData = (apiData, type) => {
    switch (type) {
      case 'yearly':
        const transformedData = [];

        // 초기 연도 데이터 생성
        for (let year = 2016; year <= 2023; year++) {
          transformedData.push({ date: year, sum: 0 });
        }

        // API 데이터 적용
        apiData.yearSales.forEach(({ date, sum }) => {
          const year = parseInt(date, 10);
          const index = year - 2016;
          transformedData[index] = { date: year, sum };
        });
        return transformedData;
      case 'monthly':
        const transformedMonthData = [];

        // 초기 연도 데이터 생성
        for (let month = 1; month <= 12; month++) {
          transformedMonthData.push({ date: month, sum: 0 });
        }

        // API 데이터 적용
        apiData.monthSales.forEach(({ date, sum }) => {
          const monthPart = date.slice(4); // 문자열에서 인덱스 4부터 끝까지 추출
          const month = parseInt(monthPart, 10);
          const index = month - 1;
          transformedMonthData[index] = { date: month, sum };
        });
        return transformedMonthData;
      case 'daily':
        const transformedDayData = [];

        // API 데이터를 날짜 기준으로 내림차순 정렬
        const sortedDailySales = apiData.dailySales.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        // 현재 날짜를 기준으로 최근 7일 동안의 데이터만 반환
        const currentDate = new Date();
        const recent7DaysData = sortedDailySales.filter(item => {
          const itemDate = new Date(item.date);
          const daysDifference = (currentDate - itemDate) / (1000 * 60 * 60 * 24);
          return daysDifference < 7;
        });

        // 초기 날짜 데이터 생성
        for (let day = 0; day < 7; day++) {
          const matchingData = recent7DaysData.find(item => item.date === String(currentDate.getDate() - day));
          const sum = matchingData ? matchingData.sum : 0;
          transformedDayData.push({ date: String(currentDate.getDate() - day), sum });
        }

        return transformedDayData;
      default:
        return [];
    }
  };

  useEffect(() => {
    const id = localStorage.getItem('store_id');
    //판매 정보 데이터를 가져오는 코드
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/sales/${id}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          },
        });

        const transformedYearlySales = transformData(response.data, 'yearly');
        const transformedMonthlySales = transformData(response.data, 'monthly');
        const transformedDailySales = transformData(response.data, 'daily');

        setDailySales(transformedDailySales);
        setMonthlySales(transformedMonthlySales);
        setYearlySales(transformedYearlySales);
        console.log('저장된 yearly 데이터', yearlySales);
        // setMenuSales(response.data); // Assuming the server returns an array of menu sales data
      } catch (error) {
        console.error('Error fetching menu sales:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('yearlySales', yearlySales, monthlySales, dailySales);

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    let data, labels;

    switch (salesType) {
      case 'yearly':
        data = yearlySales.map(item => item.sum);
        labels = yearlySales.map(item => item.date);
        // labels = [2020, 2021, 2022, 2023];
        break;
      case 'monthly':
        data = monthlySales.map(item => item.sum);
        labels = Array.from({ length: 12 }, (_, index) => (index + 1).toString());
        // labels = monthlySales.map(item => item.date);
        break;
      case 'daily':
        data = dailySales.map(item => item.sum);
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
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              mirror: false,
              padding: 10,
              callback: function (value, index, values) {
                return value; // This ensures that the label value is used as-is without modification
              },
            }
          }
        }
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
        {/* <p>{`${salesType === 'daily' ? '이번 주' : salesType === 'monthly' ? '월별' : '연도별'} 매출 총 합계: ${dailyTotal}`}</p> */}
        <p>{`${salesType === 'daily' ? '이번 주' : salesType === 'monthly' ? '월별' : '연도별'} 매출 총 합계: `}</p>
        <canvas ref={canvasRef} />
      </div>

    </div>
  );
};

export default Sales;