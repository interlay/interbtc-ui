
import useDarkMode from 'use-dark-mode';

import Toggle from 'components/Toggle';
import { CLASS_NAMES } from 'utils/constants/styles';
import { KUSAMA } from 'utils/constants/relay-chain-names';

// TODO: not used for now
const DarkModeToggle = (): JSX.Element => {
  const darkMode = useDarkMode(process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA, {
    classNameDark: CLASS_NAMES.DARK,
    classNameLight: CLASS_NAMES.LIGHT,
    element: document.documentElement
  });

  return (
    <Toggle
      checked={darkMode.value}
      onChange={darkMode.toggle} />
  );
};

export default DarkModeToggle;
