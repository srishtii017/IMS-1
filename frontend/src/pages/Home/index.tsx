import BasicChart from "./components/Basic";
import PieChartDemo from "./components/Pie";

const HomePage = () => {
  return (
    <div className="w-full flex flex-wrap gap-4 justify-center p-4">
      <div className="flex-1 min-w-[300px]">
        <BasicChart />
      </div>
      <div className="flex-1 min-w-[300px]">
        <PieChartDemo />
      </div>
    </div>
  );
};

export default HomePage;