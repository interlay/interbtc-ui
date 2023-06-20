import styled from 'styled-components';

import dysonsphere from '@/assets/img/dysonsphere.svg';

const StyledWrapper = styled('div')`
  background: url(${dysonsphere}) no-repeat;
  /* background-size: cover; */
  background-position: right bottom;
  background-attachment: fixed;
`;

export { StyledWrapper };
