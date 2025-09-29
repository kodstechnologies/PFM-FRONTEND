// import React from 'react';
// import ApexCharts from 'react-apexcharts';

// type SalesByCategoryChartProps = {
//   isDark?: boolean;
//   labels: string[];
//   series: number[];
// };

// const SalesByCategoryChart: React.FC<SalesByCategoryChartProps> = ({
//   isDark = false,
//   labels,
//   series,
// }) => {
//   const topPlaces = [
//     { name: 'Kormangla', value: '32%', trend: 'up' },
//     { name: 'Inderanagar', value: '28%', trend: 'up' },
//     { name: 'Jayanagar', value: '22%', trend: 'down' },
//   ];

//   const options: ApexCharts.ApexOptions = {
//     chart: {
//       type: 'donut',
//       height: '100%',
//       fontFamily: 'Inter, sans-serif',
//       animations: {
//         enabled: true,
//         speed: 800,
//         animateGradually: {
//           enabled: true,
//           delay: 150
//         }
//       },
//       sparkline: {
//         enabled: false
//       },
//       toolbar: {
//         show: false
//       }
//     },
//     labels,
//     colors: ['#E8A0BF', '#BA90C6', '#C0DBEA'],
//     // colors: ['#61D8D9', '#F3BB8B', '#C5E3FB'],
//     stroke: {
//       show: false,
//     },
//     dataLabels: {
//       enabled: false
//     },
//     legend: {
//       position: 'bottom',
//       horizontalAlign: 'center',
//       fontSize: '13px',
//       markers: {
//         // radius: 2,
//         // width: 10,
//         // height: 10,
//         offsetX: -4
//       },
//       itemMargin: {
//         horizontal: 8,
//         vertical: 4
//       }
//     },
//     plotOptions: {
//       pie: {
//         donut: {
//           size: '65%',
//           labels: {
//             show: true,
//             name: {
//               show: true,
//               fontSize: '15px',
//               fontWeight: 600,
//               color: isDark ? '#E5E7EB' : '#374151',
//               offsetY: -4
//             },
//             value: {
//               show: true,
//               fontSize: '22px',
//               fontWeight: 700,
//               color: isDark ? '#F9FAFB' : '#111827',
//               offsetY: 4,
//               formatter: (val) => `${val}`
//             },
//             total: {
//               show: true,
//               label: 'Total',
//               fontSize: '16px',
//               fontWeight: 600,
//               color: isDark ? '#9CA3AF' : '#6B7280',
//               formatter: () => '100%'
//             }
//           }
//         }
//       }
//     },
//     states: {
//       hover: {
//         filter: {
//           type: 'none'
//         }
//       }
//     }
//   };

//   return (
//     <div className={`rounded-xl shadow-sm overflow-hidden`}>
//       <div className=" ">
//         {/* Chart Container */}
//         <div className="relative w-full aspect-square mb-6  h-[20rem]">
//           <ApexCharts 
//             options={options} 
//             series={series} 
//             type="donut" 
//             height="100%" 
//             width="100%"
//           />
//         </div>


//       </div>
//     </div>
//   );
// };

// export default SalesByCategoryChart;



// import React from 'react';
// import ApexCharts from 'react-apexcharts';

// type CategoryCount = {
//   name: string;
//   count: number; // number of subcategories/items in this category
// };

// type SalesByCategoryChartProps = {
//   isDark?: boolean;
//   categories: CategoryCount[];
// };

// const SalesByCategoryChart: React.FC<SalesByCategoryChartProps> = ({
//   isDark = false,
//   categories = [],
// }) => {
//   const series = categories.map(cat => cat.count);

//   const options: ApexCharts.ApexOptions = {
//     chart: {
//       type: 'donut',
//       height: '100%',
//       fontFamily: 'Inter, sans-serif',
//       toolbar: { show: false },
//       animations: { enabled: true },
//     },
//     labels: categories.map(cat => cat.name), // used only for hover tooltip
//     dataLabels: { enabled: false }, // hide labels on slices
//     legend: { show: false }, // hide legend
//     plotOptions: {
//       pie: {
//         donut: { size: '65%', labels: { show: false } }, // hide center text
//       },
//     },
//     stroke: { width: 0 },
//     tooltip: { enabled: true, y: { formatter: () => '' } }, // show name on hover
//     states: { hover: { filter: { type: 'lighten' } } },
//     colors: [
//       '#E8A0BF', '#BA90C6', '#C0DBEA', '#61D8D9', '#F3BB8B',
//       '#C5E3FB', '#F6A89E', '#A3E1D4', '#F3C78B', '#B8B8F3', '#FFB6B9'
//     ],
//   };

//   return (
//     // <div className={`rounded-xl shadow-md overflow-hidden p-4`}>
//     <div className="relative w-full aspect-square">
//       <ApexCharts
//         options={options}
//         series={series}
//         type="donut"
//         height="100%"
//         width="100%"
//       />
//     </div>
//     // </div>
//   );
// };

// export default SalesByCategoryChart;


import React from 'react';
import ApexCharts from 'react-apexcharts';

type CategoryCount = {
  name: string;
  count: number; // number of subcategories/items in this category
};

type SalesByCategoryChartProps = {
  isDark?: boolean;
  categories: CategoryCount[];
};

const SalesByCategoryChart: React.FC<SalesByCategoryChartProps> = ({
  isDark = false,
  categories = [],
}) => {
  const series = categories.map(cat => cat.count);
  const total = series.reduce((acc, cur) => acc + cur, 0);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      height: '100%',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      animations: { enabled: true },
    },
    labels: categories.map(cat => cat.name),
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
      style: {
        fontSize: '12px',
        fontWeight: 500,
        colors: ['#000'],
      },
      formatter: (val: number, opts?: any) => {
        const name = categories[opts.seriesIndex].name;
        const percentage = (Number(val)).toFixed(1);
        return `${name} ${percentage}%`;
      },
    },
    legend: {
      show: false, // 👈 disable the bottom legend
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '15px',
              fontWeight: 600,
              color: isDark ? '#e5e7eb' : '#374151',
              offsetY: -8,
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 700,
              color: isDark ? '#f3f4f6' : '#111827',
              offsetY: 8,
              formatter: (val: string | number) => {
                const numVal = Number(val);
                const percentage = ((numVal / total) * 100).toFixed(1);
                return `${numVal} (${percentage}%)`;
              },
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 600,
              color: isDark ? '#d1d5db' : '#374151',
              formatter: () => total.toString(),
            },
          },
        },
      },
    },
    stroke: { width: 2, colors: [isDark ? '#1f2937' : '#BFDBFE'] },
    tooltip: {
      enabled: true,
      style: { fontSize: '13px' },
      y: {
        formatter: (val: number) => {
          const percentage = ((val / total) * 100).toFixed(1);
          return `${val} items (${percentage}%)`;
        },
      },
    },
    states: { hover: { filter: { type: 'light' } } },
    colors: [
      '#E8A0BF', '#BA90C6', '#C0DBEA', '#61D8D9', '#F3BB8B',
      '#C5E3FB', '#F6A89E', '#A3E1D4', '#F3C78B', '#B8B8F3', '#FFB6B9'
    ],
  };


  return (
    <div
      className={`relative w-[70%] aspect-square  `}
    >
      <ApexCharts
        options={options}
        series={series}
        type="donut"
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default SalesByCategoryChart;
