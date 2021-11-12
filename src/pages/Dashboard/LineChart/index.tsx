
import { Line } from 'react-chartjs-2';

interface YAxisConfig {
  beginAtZero?: boolean;
  position?: string;
  precision?: number;
  max?: number;
  maxTicksLimit?: number;
}

interface Props {
  color: string[];
  label: string[];
  yLabels: string[];
  yAxisProps: YAxisConfig[];
  data: number[][];
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
const LineChart = (props: Props): JSX.Element => {
  const data = {
    labels: props.yLabels,
    datasets: props.data.map((dataset, index) => ({
      label: props.label[index],
      yAxisID: index.toString(),
      fill: false,
      borderColor: getAccentColor(props.color[index]),
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
      pointBackgroundColor: getAccentColor(props.color[index]),
      pointBorderColor: 'rgba(255,255,255,0)',
      pointHoverBackgroundColor: getAccentColor(props.color[index]),
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
      yAxes: props.yAxisProps.map((yArgs, index) => ({
        id: index.toString(),
        type: 'linear',
        display: true,
        ticks: {
          ...(yArgs.beginAtZero ? { beginAtZero: true } : {}),
          ...(yArgs.precision === undefined ? {} : { precision: yArgs.precision }),
          ...(yArgs.max === undefined ? {} : { max: yArgs.max }),
          ...(yArgs.maxTicksLimit === undefined ? {} : { maxTicksLimit: yArgs.maxTicksLimit })
        },
        ...(yArgs.position === undefined ? {} : { position: yArgs.position })
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
