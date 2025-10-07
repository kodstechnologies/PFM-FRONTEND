import React from 'react';
import ApexCharts from 'react-apexcharts';

type SalesByCategoryChartProps = {
  isDark?: boolean;
  labels: string[];
  series: number[];
};

const SalesByCategoryChart: React.FC<SalesByCategoryChartProps> = ({
  isDark = false,
  labels,
  series,
}) => {
  const topPlaces = [
    { name: 'Kormangla', value: '32%', trend: 'up' },
    { name: 'Inderanagar', value: '28%', trend: 'up' },
    { name: 'Jayanagar', value: '22%', trend: 'down' },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      height: '100%',
      fontFamily: 'Inter, sans-serif',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        }
      },
      sparkline: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    labels,
    colors: ['#E8A0BF', '#BA90C6', '#C0DBEA'],
    // colors: ['#61D8D9', '#F3BB8B', '#C5E3FB'],
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      markers: {
        // radius: 2,
        // width: 10,
        // height: 10,
        offsetX: -4
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '15px',
              fontWeight: 600,
              color: isDark ? '#E5E7EB' : '#374151',
              offsetY: -4
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: 700,
              color: isDark ? '#F9FAFB' : '#111827',
              offsetY: 4,
              formatter: (val) => `${val}`
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 600,
              color: isDark ? '#9CA3AF' : '#6B7280',
              formatter: () => '100%'
            }
          }
        }
      }
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      }
    }
  };

  return (
    <div className={`rounded-xl shadow-sm overflow-hidden`}>
      <div className=" ">
        {/* Chart Container */}
        <div className="relative w-full aspect-square mb-6  h-[20rem]">
          <ApexCharts 
            options={options} 
            series={series} 
            type="donut" 
            height="100%" 
            width="100%"
          />
        </div>

       
      </div>
    </div>
  );
};

export default SalesByCategoryChart;