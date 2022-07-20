import styled from 'styled-components';
import { SelectorIcon } from '@heroicons/react/solid';

interface ButtonProps {
  isOpen?: boolean;
  isFocusVisible?: boolean;
}

export const Button = styled.button<ButtonProps>`
  appearance: none;
  background: ${(props) => (props.isOpen ? '#eee' : 'white')};
  border: 1px solid;
  padding: 6px 2px 6px 8px;
  margin-top: 6px;
  outline: none;
  border-color: ${(props) => (props.isFocusVisible ? 'seagreen' : 'lightgray')};
  box-shadow: ${(props) => (props.isFocusVisible ? '0 0 0 3px rgba(143, 188, 143, 0.5)' : '')};
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 210px;
  text-align: left;
  font-size: 14px;
  color: black;
  z-index: 1000;
`;

export const Value = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const StyledIcon = styled(SelectorIcon)`
  width: 18px;
  height: 18px;
  padding: 6px 2px;
  margin: 0 4px;
  background: seagreen;
  border-radius: 4px;
  color: white;
`;

export const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  position: relative;
`;

export const Label = styled.label`
  display: block;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  font-size: 14px;
`;

export const TextField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
