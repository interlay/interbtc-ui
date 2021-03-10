
interface Props {
  children: React.ReactNode;
}

const InterlayLink = ({
  children,
  ...rest
}: Props & React.ComponentPropsWithoutRef<'a'>) => (
  <a {...rest}>
    {children}
  </a>
);

export default InterlayLink;
