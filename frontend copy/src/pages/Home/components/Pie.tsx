import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useDashboardDataQuery } from '../../../provider/queries/Users.query';
import { useLocation } from 'react-router-dom';
import Loader from '../../../components/Loader';

// Define types for chart data and options
interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }>;
}

interface ChartOptions {
  plugins: {
    legend: {
      labels: {
        usePointStyle: boolean;
      };
    };
  };
}

export default function PieChartDemo() {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState<ChartOptions>({ plugins: { legend: { labels: { usePointStyle: true } } } });
  
  const { data, isError, isLoading, isFetching } = useDashboardDataQuery({});
  const location = useLocation();

  useEffect(() => {
    if (!data) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const newChartData: ChartData = {
      labels: ['user', 'orders', 'sell'],
      datasets: [
        {
          data: [data.consumers, data.orders, data.sell],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
          ],
        },
      ],
    };

    const newOptions: ChartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    setChartData(newChartData);
    setChartOptions(newOptions);
  }, [data, location]);

  if (isFetching || isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <Chart type="pie" data={chartData} options={chartOptions} className="w-full lg:w-1/2" />
  );
}
