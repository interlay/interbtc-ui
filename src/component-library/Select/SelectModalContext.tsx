import { Node } from '@react-types/shared';
import React from 'react';

/*
  Used to allow styling inside modal items
*/

interface SelectModalConfig {
  selectedItem?: Node<any> | null;
}

const defaultContext = {};

const SelectModalContext = React.createContext<SelectModalConfig>(defaultContext);

const useSelectModalContext = (): SelectModalConfig => React.useContext<SelectModalConfig>(SelectModalContext);

export { SelectModalContext, useSelectModalContext };
export type { SelectModalConfig };
