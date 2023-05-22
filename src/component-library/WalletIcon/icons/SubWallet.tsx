import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const SubWallet = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 78 78' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>SubWallet</title>
    <circle cx='39' cy='39' r='39' fill='#080120' />
    <path d='M55.932 53s-7.163 10-16 10-16-10-16-10 7.163-10 16-10 16 10 16 10Z' fill='#080120' />
    <path
      d='M24.652 53.122a22.458 22.458 0 0 1-.095-.122 27.45 27.45 0 0 1 1.01-1.236 33.198 33.198 0 0 1 3.378-3.385c2.865-2.474 6.75-4.879 10.987-4.879s8.121 2.405 10.986 4.879a33.19 33.19 0 0 1 4.294 4.499l.095.122-.095.122a33.19 33.19 0 0 1-4.294 4.5c-2.865 2.473-6.75 4.877-10.986 4.877-4.237 0-8.122-2.404-10.987-4.878a33.198 33.198 0 0 1-4.293-4.499Z'
      stroke='#080120'
      strokeWidth='1.001'
    />
    <path
      d='m53.118 35.965-.007-7.932L24 12.947v23.01l18.636 9.956 6.81-3-20.506-10.88.015-8.718 24.163 12.65Z'
      fill='url(#a)'
    />
    <path d='M35.315 26.643v2.71l-6.398 2.742.046-8.887 6.352 3.436Z' fill='url(#b)' />
    <path
      d='m35.338 49.127 14.109-6.214L28.94 32.087l6.337-2.733 26.362 13.773L35.39 54.578l-.053-5.45Z'
      fill='url(#c)'
    />
    <path d='m28.963 47.287 6.298-2.718.138 10.002 26.24-11.444v8.535L28.909 66l.054-18.713Z' fill='url(#d)' />
    <path d='m24 44.707 4.94 2.58-.03 18.682L24 63.503V44.707Z' fill='url(#e)' />
    <path d='m30.238 41.928 5.023 2.642-6.321 2.718-4.94-2.58 6.238-2.78Z' fill='url(#f)' />
    <path d='m61.639 32.27-.03-7.986-8.483 3.75v7.94l8.513-3.704Z' fill='url(#g)' />
    <path d='M24 12.947 32.574 9l29.05 15.27-8.498 3.763L24 12.947Z' fill='url(#h)' />
    <defs>
      <linearGradient id='a' x1='16.717' y1='29.43' x2='68.151' y2='29.43' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#FFD4B2' />
        <stop offset='.36' stopColor='#9ACEB7' />
        <stop offset='.67' stopColor='#47C8BB' />
        <stop offset='.89' stopColor='#14C5BE' />
        <stop offset='1' stopColor='#00C4BF' />
      </linearGradient>
      <linearGradient id='b' x1='32.116' y1='35.263' x2='32.116' y2='15.337' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#00FECF' />
        <stop offset='.08' stopColor='#00E5D0' />
        <stop offset='.24' stopColor='#00A5D1' />
        <stop offset='.48' stopColor='#0040D4' />
        <stop offset='.54' stopColor='#0025D5' />
        <stop offset='1' />
      </linearGradient>
      <linearGradient id='c' x1='28.94' y1='41.966' x2='81.321' y2='41.966' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#FDEC9F' />
        <stop offset='.08' stopColor='#E4D8A4' />
        <stop offset='.24' stopColor='#A4A6B2' />
        <stop offset='.47' stopColor='#3F57C8' />
        <stop offset='.61' stopColor='#0025D5' />
        <stop offset='1' />
      </linearGradient>
      <linearGradient id='d' x1='18.229' y1='54.563' x2='85.207' y2='54.563' gradientUnits='userSpaceOnUse'>
        <stop offset='.05' stopColor='#62A5FF' />
        <stop offset='.45' stopColor='#1032D1' />
        <stop offset='1' />
      </linearGradient>
      <linearGradient id='e' x1='311.928' y1='1558.16' x2='392.829' y2='1559.21' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#FFD4B2' />
        <stop offset='.36' stopColor='#9ACEB7' />
        <stop offset='.67' stopColor='#47C8BB' />
        <stop offset='.89' stopColor='#14C5BE' />
        <stop offset='1' stopColor='#00C4BF' />
      </linearGradient>
      <linearGradient id='f' x1='22.794' y1='44.608' x2='45.759' y2='44.608' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#00FECF' />
        <stop offset='.08' stopColor='#00E5D0' />
        <stop offset='.25' stopColor='#00A5D1' />
        <stop offset='.49' stopColor='#0040D4' />
        <stop offset='.56' stopColor='#0025D5' />
      </linearGradient>
      <linearGradient id='g' x1='44.98' y1='30.354' x2='101.507' y2='29.331' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#00FECF' />
        <stop offset='.05' stopColor='#00E5D0' />
        <stop offset='.15' stopColor='#00A5D1' />
        <stop offset='.29' stopColor='#0040D4' />
        <stop offset='.33' stopColor='#0025D5' />
      </linearGradient>
      <linearGradient id='h' x1='24' y1='18.52' x2='94.124' y2='18.52' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#FFD4AF' />
        <stop offset='.1' stopColor='#E6D5BA' />
        <stop offset='.31' stopColor='#A7D6D5' />
        <stop offset='.61' stopColor='#43D9FF' />
        <stop offset='.63' stopColor='#37B1D0' />
        <stop offset='.65' stopColor='#2B8CA5' />
        <stop offset='.67' stopColor='#216B7D' />
        <stop offset='.7' stopColor='#184E5B' />
        <stop offset='.72' stopColor='#10353F' />
        <stop offset='.75' stopColor='#0A2228' />
        <stop offset='.78' stopColor='#061316' />
        <stop offset='.82' stopColor='#020809' />
        <stop offset='.88' stopColor='#010202' />
        <stop offset='1' />
      </linearGradient>
    </defs>
  </Icon>
));

SubWallet.displayName = 'SubWallet';

export { SubWallet };
