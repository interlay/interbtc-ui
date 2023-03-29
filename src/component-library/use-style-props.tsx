import { StyledMarginProps } from './css/margin';
import { MarginProps } from './utils/prop-types';

type StyleProps = StyledMarginProps;

type ComponentProps<T extends Record<string, any>> = Omit<T, keyof MarginProps>;

type UseStylePropsResult<T extends Record<string, any>> = { styleProps: StyleProps; componentProps: ComponentProps<T> };

const useStyleProps = <T extends Record<string, any>>(props: T): UseStylePropsResult<T> => {
  const { margin, marginTop, marginBottom, marginLeft, marginRight, marginX, marginY, ...componentProps } = props;

  return {
    styleProps: {
      $margin: margin,
      $marginTop: marginTop,
      $marginBottom: marginBottom,
      $marginLeft: marginLeft,
      $marginRight: marginRight,
      $marginX: marginX,
      $marginY: marginY
    },
    componentProps
  };
};

export type { StyleProps, UseStylePropsResult };
export { useStyleProps };
