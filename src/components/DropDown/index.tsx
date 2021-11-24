import clsx from 'clsx';

type Option = {
  value: string;
  label: string;
}

interface DropDownProps {
  options: Array<Option>;
}

const DropDown = ({
  options
}: DropDownProps): JSX.Element => (
  <select
    className={clsx(
      'pl-0',
      'text-sm',
      'bg-transparent',
      'border-none',
      'focus:ring-transparent')}>
    {options.map(option =>
      <option
        key={option.label}
        value={option.value}>
        {option.label}
      </option>
    )}
  </select>);

export default DropDown;
