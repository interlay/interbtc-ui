
import clsx from 'clsx';

interface Props {
  link: string;
  image: string;
}

const Advert = ({
  link,
  image
}: Props): JSX.Element => (
  <a
    className={clsx(
      'flex'
    )}
    href={link}>
    <img
      className={clsx(
        'justify-center',
        'hover:opacity-70'
      )}
      src={image}
      width='230'
      height='412'
      alt='' />
  </a>
);

export default Advert;
