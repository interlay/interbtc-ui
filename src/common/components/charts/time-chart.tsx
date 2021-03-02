import React, { ReactElement } from 'react';
import { Line } from 'react-chartjs-2';
import { TimeDataPoint } from '../../../common/types/util.types';

type TimeChartProps = {
    title: string[];
    data: TimeDataPoint[];
};

export default function TimeChart(props: TimeChartProps): ReactElement {
  const chartProps = {
    data: {
      datasets: [
        {
          label: 'Total',
          data: props.data,
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        position: 'top',
        text: props.title,
        fontSize: 24
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              round: 'day',
              unit: 'day'
            }
          }
        ]
      }
    }
  };
  return <Line {...chartProps} />;
}
