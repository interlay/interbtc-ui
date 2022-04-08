
import clsx from 'clsx';

interface Props {
  link: string;
  image: string;
  width: number;
  description: string;
}

const Advert = ({
  link,
  image,
  width,
  description
}: Props): JSX.Element => (
  <a
    data-dd-action-name='Solarbeam liquidity pool'
    className={clsx(
      'flex',
      'justify-center'
    )}
    href={link}>
    <img
      className={clsx(
        'border',
        'border-transparent',
        'hover:border-white',
        'rounded-xl'
      )}
      src={image}
      width={width}
      alt={description}
      title={description} />
  </a>
);

export default Advert;
