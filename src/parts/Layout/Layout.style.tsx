import styled from 'styled-components';

import dysonsphere from '@/assets/img/dysonsphere.svg';

const StyledLayout = styled('div')`
  background: url(${dysonsphere}) no-repeat;
  background-size: cover;
  background-position: top 0 right 100%;
  background-attachment: fixed;
`;

export { StyledLayout };
