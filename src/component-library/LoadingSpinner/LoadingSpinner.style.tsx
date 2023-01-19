import styled from 'styled-components';

const StyledPath = styled.path`
  transform-origin: center;
  animation: load 0.75s infinite linear;

  @keyframes load {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export { StyledPath };
