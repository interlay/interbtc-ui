
// TODO: should use a picture tag
const InterlayImage = ({
  alt,
  ...rest
}: React.ComponentPropsWithRef<'img'>) => (
  <img
    alt={alt}
    {...rest} />
);

export default InterlayImage;
