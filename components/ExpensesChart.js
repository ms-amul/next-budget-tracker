import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ExpensesChart({ expenses }) {
  const data = {
    labels: expenses.map(expense => expense.category),
    datasets: [
      {
        label: 'Expenses',
        data: expenses.map(expense => expense.amount),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Expenses</h2>
      <Bar data={data} />
    </div>
  );
}
