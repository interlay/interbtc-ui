import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
`;

export {
  ModalOverlay,
  ModalContent
};
