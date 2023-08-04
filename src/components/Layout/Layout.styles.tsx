import styled from 'styled-components';

import dysonsphere from '@/assets/img/dysonsphere.svg';

const StyledWrapper = styled.div`
  background: url(${dysonsphere}) no-repeat;
  background-size: 40%;
  background-position: right bottom;
  background-attachment: fixed;
  position: relative;
  min-height: 100vh;
`;

export { StyledWrapper };
