type IconVariant = 'crossmark' | 'checkmark';

interface IconProps {
  variant: IconVariant;
}

const Icon = ({ variant }: IconProps): JSX.Element | null => {
  switch (variant) {
    case 'crossmark':
      return <CrossmarkIcon />;
    case 'checkmark':
      return <CheckmarkIcon />;
  }
};
