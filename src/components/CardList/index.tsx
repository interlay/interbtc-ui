/** @jsxImportSource @emotion/react */

import clsx from 'clsx';
import tw, { TwStyle } from 'twin.macro';

interface Props {
  twStyle?: TwStyle;
}

const Card = ({
  twStyle,
  ...rest
}: Props & React.ComponentPropsWithRef<'li'>) => (
  <li
    css={[
      tw`flex`,
      tw`flex-col`,
      tw `justify-center`,
      tw`items-center`,
      tw`lg:w-80`,
      tw`h-32`,
      tw`px-4`,
      tw`py-8`,
      tw`my-4`,
      tw`lg:m-2`,
      tw`rounded`,
      tw`border`,
      tw`border-solid`,
      tw`border-gray-300`,
      tw`shadow-sm`,
      twStyle
    ]}
    {...rest} />
);

const CardHeader = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'h2'>) => (
  <h2
    // TODO: hardcoded for now
    style={{
      fontWeight: 700
    }}
    className={clsx(
      'text-base',
      'font-bold',
      className
    )}
    {...rest}>
    {children}
  </h2>
);

const CardContent = (props: React.ComponentPropsWithRef<'div'>) => (
  <div {...props} />
);

const CardList = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'ul'>) => (
  <ul
    className={clsx(
      'lg:flex',
      'lg:justify-center',
      'lg:flex-wrap',
      className
    )}
    {...rest} />
);

export {
  Card,
  CardHeader,
  CardContent
};

export default CardList;
