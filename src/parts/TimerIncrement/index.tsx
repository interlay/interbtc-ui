import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import useInterval from '@/utils/hooks/use-interval';

function TimerIncrement(): JSX.Element {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(0);

  useInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return t('last_updated', {
    seconds
  });
}

export default TimerIncrement;
