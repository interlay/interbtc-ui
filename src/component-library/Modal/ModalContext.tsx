import { DOMAttributes } from '@react-types/shared';
import React from 'react';

import { ModalBodyProps } from './ModalBody';

interface ModalConfig {
  titleProps?: DOMAttributes;
  bodyProps?: ModalBodyProps;
}

const defaultContext = {};

const ModalContext = React.createContext<ModalConfig>(defaultContext);

const useModalContext = (): ModalConfig => React.useContext<ModalConfig>(ModalContext);

export { ModalContext, useModalContext };
export type { ModalConfig };
