
// TODO: should use a picture tag
const InterlayImage = ({
  alt,
  ...rest
}: React.ComponentPropsWithRef<'img'>): JSX.Element => (
  <img
    alt={alt}
    {...rest} />
);

export default InterlayImage;
