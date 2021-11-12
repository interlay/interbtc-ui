
import { Line } from 'react-chartjs-2';

interface YAxis {
  position?: string;
  ticks: {
    beginAtZero?: boolean;
    precision?: number;
    maxTicksLimit?: number;
  };
}

interface Props {
  colors: string[];
  labels: string[];
  yLabels: string[];
  yAxes: YAxis[];
  datasets: number[][];
}

function getAccentColor(color: string): string {
  let accentColor;
  switch (color) {
  case 'd_interlayCalifornia':
    accentColor = '#ff9900';
    break;
  case 'd_interlayDenim':
    accentColor = '#075abc';
    break;
  default:
    // ray test touch <<
    accentColor = 'red';
    // accentColor = '#6b7280';
    // ray test touch >>
    break;
  }
  return accentColor;
}

// TODO: should refactor by using a better package
const LineChart = ({
  colors,
  labels,
  yLabels,
  yAxes,
  datasets
}: Props): JSX.Element => {
  const data = {
    labels: yLabels,
    datasets: datasets.map((dataset, index) => ({
      label: labels[index],
      yAxisID: index.toString(),
      fill: false,
      borderColor: getAccentColor(colors[index]),
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
      pointBackgroundColor: getAccentColor(colors[index]),
      pointBorderColor: 'rgba(255,255,255,0)',
      pointHoverBackgroundColor: getAccentColor(colors[index]),
      pointBorderWidth: 20,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 15,
      pointRadius: 4,
      data: dataset,
      backgroundColor: 'rgba(255,255,255,0)'
    }))
  };

  const options = {
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontSize: 9
      }
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: yAxes.map((yAxis, index) => ({
        id: index.toString(),
        type: 'linear',
        display: true,
        ...yAxis
      }))
    }
  };

  return (
    <div>
      <Line
        data={data}
        options={options} />
    </div>
  );
};

export default LineChart;
