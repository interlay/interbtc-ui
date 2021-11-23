
// TODO: should refactor by using a better package (https://github.com/recharts/recharts)
import { Line } from 'react-chartjs-2';

import {
  POLKADOT,
  KUSAMA
} from 'utils/constants/relay-chain-names';
import {
  INTERLAY_TEXT_PRIMARY_IN_LIGHT_MODE,
  KINTSUGI_TEXT_PRIMARY_IN_DARK_MODE
} from 'utils/constants/colors';

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
  datasets: number[][] | string[][];
  wrapperClassName?: string;
}

const LineChart = ({
  colors,
  labels,
  yLabels,
  yAxes,
  datasets,
  wrapperClassName
}: Props): JSX.Element => {
  const data = {
    labels: yLabels,
    datasets: datasets.map((dataset: number[] | string[], index: number) => ({
      label: labels[index],
      yAxisID: index.toString(),
      fill: false,
      borderWidth: 1,
      borderColor: colors[index],
      pointBackgroundColor: colors[index],
      pointHoverBackgroundColor: colors[index],
      data: dataset
    }))
  };

  let textPrimaryColor;
  if (process.env.REACT_APP_RELAY_CHAIN_NAME === POLKADOT || process.env.NODE_ENV !== 'production') {
    textPrimaryColor = INTERLAY_TEXT_PRIMARY_IN_LIGHT_MODE;
  } else if (process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA) {
    textPrimaryColor = KINTSUGI_TEXT_PRIMARY_IN_DARK_MODE;
  } else {
    throw new Error('Something went wrong!');
  }

  const options = {
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontSize: 12,
        fontColor: textPrimaryColor
      }
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: textPrimaryColor
          }
        }
      ],
      yAxes: yAxes.map(({
        ticks,
        ...rest
      }, index) => ({
        id: index.toString(),
        type: 'linear',
        display: true,
        ticks: {
          fontColor: colors[index],
          ...ticks
        },
        ...rest
      }))
    }
  };

  return (
    <div className={wrapperClassName}>
      <Line
        data={data}
        options={options} />
    </div>
  );
};

export default LineChart;
