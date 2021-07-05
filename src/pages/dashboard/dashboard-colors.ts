export interface Style {
  color: string;
  filter?: string;
}

// ray test touch <
export function getAccents(color: string): Style {
  const accent = { color: '#000000', filter: 'none' };
  switch (color) {
  case 'd_interlayCalifornia':
    accent.color = '#ff9900';
    break;
  case 'd_interlayDenim':
    accent.color = '#075abc';
    break;
  case 'd_blue':
    accent.color = '#075abc';
    break;
  case 'd_interlayMulberry':
    accent.color = '#db5aad';
    break;
  case 'd_interlayConifer':
    accent.color = '#a2e75e';
    break;
  case 'd_interlayCinnabar':
    accent.color = '#ef4444';
    break;
  case 'd_white':
    accent.color = '#ffffff';
    break;
  default:
    accent.color = '#6b7280';
    break;
  }
  return accent;
}
// ray test touch >
