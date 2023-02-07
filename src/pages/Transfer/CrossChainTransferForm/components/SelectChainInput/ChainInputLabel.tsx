import { Flex } from '@/component-library/Flex';
import { Label, LabelProps } from '@/component-library/Label';

const ChainInputLabel = ({ children, ...props }: LabelProps): JSX.Element => {
  const hasLabel = !!children;

  return (
    <Flex gap='spacing0' justifyContent={hasLabel ? 'space-between' : 'flex-end'}>
      {hasLabel && <Label {...props}>{children}</Label>}
    </Flex>
  );
};

export { ChainInputLabel };
