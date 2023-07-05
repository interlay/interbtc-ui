import { forwardRef } from 'react';

import { Icon, IconProps } from '@/component-library/Icon';

const ParitySignerCompanion = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <title>Parity Signer Companion</title>
    <path d="M24.617 0 0 15.387l3.235 5.17 6.823-4.22v-3.325h5.343l12.51-7.756L24.617 0Zm4.154 6.648-10.28 6.383h11.514l1.979-1.212-3.213-5.17Zm4.091 6.527-2.621 1.599v2.988h-4.819l-6.687 4.159h10.908l6.247-3.875-3.028-4.871Zm-22.036 4.601L4.1 21.957l3.212 5.145 2.773-1.717v-3.464h5.568l6.687-4.145H10.826Zm25.925 1.648-6.473 4.026v3.22h-5.214l-12.982 8.048 3.3 5.282L40 24.613l-3.25-5.19ZM11.077 26.67l-2.898 1.8 3.05 4.874 10.748-6.674h-10.9Z" fill="#aeaeae"/>
  </Icon>
));

ParitySignerCompanion.displayName = 'Parity Signer Companion';

export { ParitySignerCompanion };
