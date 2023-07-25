import { StyledWrapper } from './Wrapper.style';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Wrapper = ({ className, children }: Props): JSX.Element => {
  return <StyledWrapper className={className}>{children}</StyledWrapper>;
};

export { Wrapper };
