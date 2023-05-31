import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import { theme } from '@/component-library';

const StyledToastContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    color: ${theme.colors.textPrimary};
    padding: 0 ${theme.spacing.spacing4};
  }

  @media ${theme.breakpoints.up('sm')} {
    &&&.Toastify__toast-container {
      padding: 0;
    }
  }

  .Toastify__toast {
    margin-bottom: 1rem;
    padding: 0;
    border-radius: 12px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    font-family: inherit;
    background: ${theme.colors.bgPrimary};
    border: ${theme.border.default};
  }

  .Toastify__toast-body {
    padding: 0;
  }
`;

export { StyledToastContainer };
