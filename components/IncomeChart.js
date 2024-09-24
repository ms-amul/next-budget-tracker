import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

export default function IncomeChart({ incomes }) {
  const data = {
    labels: incomes.map(income => income.source),
    datasets: [
      {
        label: 'Incomes',
        data: incomes.map(income => income.amount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Incomes</h2>
      <Line data={data} />
    </div>
  );
}
