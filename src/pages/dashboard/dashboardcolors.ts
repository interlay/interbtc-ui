export interface Style {
  color: string;
  filter?: string;
}

// ray test touch <<
export function getAccents(color: string): Style {
  const accent = { color: '#000000', filter: 'none' };
  switch (color) {
  case 'd_yellow':
    accent.color = '#ff9900';
    break;
  case 'd_pink':
    accent.color = '#075abc';
    break;
  case 'd_blue':
    accent.color = '#075abc';
    break;
  case 'd_orange':
    accent.color = '#db5aad';
    break;
  case 'd_green':
    accent.color = '#a2e75e';
    break;
  case 'd_red':
    accent.color = '#ef4444';
    break;
  default:
    accent.color = '#6b7280';
    break;
  }
  return accent;
}
// ray test touch >>
