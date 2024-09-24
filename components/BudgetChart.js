import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetChart({ budgets }) {
  const data = {
    labels: budgets.map(budget => budget.name),
    datasets: [
      {
        data: budgets.map(budget => budget.amount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Budgets</h2>
      <Pie data={data} />
    </div>
  );
}
