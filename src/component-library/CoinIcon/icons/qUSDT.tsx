import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const qUSDT = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>qUSDT</title>
    <g clipPath='url(#clip0_1_412)'>
      <circle cx='12' cy='12' r='11.5' fill='#311CAF' stroke='#0547F2' />
      <path
        d='M13.423 10.3653V8.63558H17.3464V6H6.66287V8.63558H10.5867V10.364C7.39777 10.5116 5 11.1484 5 11.9112C5 12.674 7.39892 13.3107 10.5867 13.4593V19H13.4239V13.4588C16.6071 13.3107 19 12.6744 19 11.9123C19 11.1502 16.6071 10.514 13.4239 10.3658M13.4239 12.9895V12.9881C13.3439 12.9933 12.9326 13.0181 12.0168 13.0181C11.2847 13.0181 10.7696 12.9972 10.5881 12.9877V12.99C7.77075 12.8642 5.66778 12.3695 5.66778 11.7777C5.66778 11.1858 7.77098 10.6919 10.5881 10.5658V12.4972C10.7726 12.51 11.3004 12.5414 12.0288 12.5414C12.9037 12.5414 13.3436 12.5047 13.4244 12.4972V10.5658C16.2362 10.6921 18.3343 11.1872 18.3343 11.777C18.3343 12.3667 16.2352 12.8621 13.4244 12.9884'
        fill='white'
      />
    </g>
    <defs>
      <clipPath id='clip0_1_412'>
        <rect width='24' height='24' fill='white' />
      </clipPath>
    </defs>
  </Icon>
));

qUSDT.displayName = 'qUSDT';

export { qUSDT };
