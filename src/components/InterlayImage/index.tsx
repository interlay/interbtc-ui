
interface Props {
  alt: string;
}

// TODO: should use a picture tag
const InterlayImage = ({
  alt,
  ...rest
}: Props & React.ComponentPropsWithoutRef<'img'>) => (
  <img
    alt={alt}
    {...rest} />
);

export default InterlayImage;
