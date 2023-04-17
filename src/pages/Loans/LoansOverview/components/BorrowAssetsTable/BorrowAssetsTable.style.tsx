import styled from 'styled-components';

import { AssetCell } from '@/components';

const StyledAssetCell = styled(AssetCell)`
  // Needs a specific rem so that row size matches on both lending and borrow tables
  padding: 0.5625rem 0;
`;

export { StyledAssetCell };
