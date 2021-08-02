import React from 'react';
import { Line } from 'react-chartjs-2';

interface YAxisConfig {
  beginAtZero?: boolean;
  position?: string;
  precision?: number;
  max?: number;
  maxTicksLimit?: number;
}

interface SingleAxisProps {
  color: string;
  label: string;
  yLabels: string[];
  yAxisProps?: YAxisConfig;
  data: number[];
}
interface MultiAxisProps {
  color: string[];
  label: string[];
  yLabels: string[];
  yAxisProps: YAxisConfig[];
  data: number[][];
}
type ChartProps = SingleAxisProps | MultiAxisProps;

function getAccents(color: string): {
  color: string;
} {
  const accent = { color: '' };
  switch (color) {
  case 'd_interlayCalifornia':
    accent.color = '#ff9900';
    break;
  case 'd_interlayDenim':
    accent.color = '#075abc';
    break;
  default:
    accent.color = '#6b7280';
    break;
  }
  return accent;
}

// TODO: should refactor by using a better package
export default function LineChartComponent(propsArg: ChartProps): React.ReactElement {
  const props =
    typeof propsArg.color === 'string' ? // meaning propsArg isn't SingleAxisProps
      ((propsArg: SingleAxisProps) => ({
        color: [propsArg.color],
        label: [propsArg.label],
        yLabels: propsArg.yLabels,
        yAxisProps: [propsArg.yAxisProps === undefined ? {} : propsArg.yAxisProps],
        data: [propsArg.data]
      }))(propsArg as SingleAxisProps) :
      (propsArg as MultiAxisProps);

  const data = {
    labels: props.yLabels,
    datasets: props.data.map((dataset, i) => ({
      label: props.label[i],
      yAxisID: i.toString(),
      fill: false,
      borderColor: getAccents(props.color[i]).color,
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
      pointBackgroundColor: getAccents(props.color[i]).color,
      pointBorderColor: 'rgba(255,255,255,0)',
      pointHoverBackgroundColor: getAccents(props.color[i]).color,
      pointBorderWidth: 20,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 15,
      pointRadius: 4,
      data: dataset,
      backgroundColor: 'rgba(255,255,255,0)'
    }))
  };

  const chartProps = {
    data,
    options: {
      responsive: true,
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
        yAxes: props.yAxisProps.map((yArgs, i) => ({
          id: i.toString(),
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
    }
  };
  return (
    <div className='mt-5'>
      <Line {...chartProps} />
    </div>
  );
}
