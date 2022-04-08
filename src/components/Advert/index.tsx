
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
    className={clsx(
      'flex',
      'justify-center'
    )}
    href={link}
    target='_blank'
    rel='noreferrer'>
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
