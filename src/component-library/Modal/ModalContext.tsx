import { DOMAttributes } from '@react-types/shared';
import React from 'react';

interface ModalConfig {
  titleProps?: DOMAttributes;
}

const defaultContext = {};

const ModalContext = React.createContext<ModalConfig>(defaultContext);

const useModalContext = (): ModalConfig => React.useContext<ModalConfig>(ModalContext);

export { ModalContext, useModalContext };
export type { ModalConfig };
