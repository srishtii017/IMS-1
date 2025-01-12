import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { useDashboardDataQuery } from '../../../provider/queries/Users.query';
import Loader from '../../../components/Loader';
import { useLocation } from 'react-router-dom';

// Define types for chart data and options
interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string[];
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }>;
}

interface ChartOptions {
  scales: {
    y: {
      beginAtZero: boolean;
    };
  };
}

export default function BasicChart() {
  const { data, isError, isLoading, isFetching } = useDashboardDataQuery({});
  const location = useLocation();

  // State variables with defined types
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState<ChartOptions>({ scales: { y: { beginAtZero: true } } });

  useEffect(() => {
    if (!data) return;

    const newChartData: ChartData = {
      labels: ['user', 'orders', 'sell'],
      datasets: [
        {
          label: ['Total'],
          data: [data.consumers, data.orders, data.sell],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const newOptions: ChartOptions = {
      scales: {
        y: {
          beginAtZero: true,
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

  return <Chart type="bar" data={chartData} options={chartOptions} className="w-full lg:w-1/2" />;
}