import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const KAR = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>KAR</title>
    <g clipPath='url(#clip0_27_14)'>
      <circle cx='12' cy='12' r='11.5' fill='#1B1B1B' stroke='#F53448' />
      <path
        d='M10.8106 10.9011C10.6733 11.1288 10.6733 11.1985 10.6733 11.1985C10.6733 11.1985 11.1539 11.1174 11.2839 10.5466C11.2851 10.5466 10.977 10.6256 10.8106 10.9011Z'
        fill='url(#paint0_linear_27_14)'
      />
      <path
        d='M14.7728 6.69922L11.539 9.63661C11.2041 9.94124 10.7682 10.1097 10.3161 10.1118L9.3522 10.1139L9.3494 6.69922H7.60632V16.4574H8.55684C9.08819 16.4574 9.58437 16.1756 9.84391 15.7129C9.84614 15.7101 9.84726 15.7067 9.84949 15.7045C10.022 15.3947 10.1079 14.7825 10.0917 14.3644C10.0543 13.4089 9.90029 13.1604 9.90029 13.1604C9.86791 13.8152 9.18364 13.8509 9.18364 13.8509C9.67033 13.386 9.40522 13.0346 9.40522 13.0346C8.54345 13.6483 8.328 12.993 8.31125 12.9337C8.3386 12.9566 8.58362 13.1614 9.04967 12.523C9.54251 11.8482 10.1995 10.7231 10.6175 10.4341C11.0367 10.144 11.434 10.1679 11.434 10.1679C11.434 10.1679 11.6629 9.85808 12.2679 9.60022C12.8729 9.34442 13.2608 9.71977 13.2608 9.71977C12.6419 10.2189 11.8019 11.0382 11.755 12.2121C11.7176 13.1624 13.7659 14.7931 13.4065 17.2009C13.6214 16.6539 13.7079 16.1058 13.6342 15.4282C13.5745 14.8812 13.2223 13.7387 13.2223 13.7387L15.1898 16.4563H17.3648L13.1129 10.616L17.3648 6.69922H14.7728Z'
        fill='url(#paint1_linear_27_14)'
      />
    </g>
    <defs>
      <linearGradient
        id='paint0_linear_27_14'
        x1='11.313'
        y1='12.5349'
        x2='11.9794'
        y2='12.2027'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#FF4C3B' />
        <stop offset='1' stopColor='#E40C5B' />
      </linearGradient>
      <linearGradient
        id='paint1_linear_27_14'
        x1='17.8309'
        y1='38.7295'
        x2='28.5193'
        y2='33.4423'
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#FF4C3B' />
        <stop offset='1' stopColor='#E40C5B' />
      </linearGradient>
      <clipPath id='clip0_27_14'>
        <rect width='24' height='24' fill='white' />
      </clipPath>
    </defs>
  </Icon>
));

KAR.displayName = 'KAR';

export { KAR };
