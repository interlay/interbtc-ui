
import clsx from 'clsx';

interface CustomProps {
  image: string;
  width: number;
  description: string;
}

const Advert = ({
  href,
  image,
  width,
  description,
  className,
  ...rest
}: CustomProps & React.ComponentPropsWithRef<'a'>): JSX.Element => (
  <a
    className={clsx(
      'flex',
      'justify-center',
      className
    )}
    href={href}
    target='_blank'
    rel='noreferrer'
    {...rest}>
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
