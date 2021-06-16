import React from 'react';
import '../dashboard.page.scss';
import { ReactComponent as ExternalLinkIcon } from 'assets/img/icons/external-link.svg';
import { getAccents } from '../dashboard-colors';
import InterlayRouterLink from 'components/UI/InterlayLink/router';

type buttonProps = {
  buttonName: string;
  propsButtonColor: string;
  buttonId: string;
  buttonLink: string;
};

const ButtonComponent = (props: buttonProps): React.ReactElement => {
  const accent = getAccents(props.propsButtonColor);
  const buttonColor = {
    border: `1.7px solid ${accent.color}`,
    color: `${accent.color}`
  };
  const buttonId = document.getElementById(`${props.buttonId}-button-id`) as HTMLElement;
  const buttonTextId = document.getElementById(`${props.buttonId}-button-text`) as HTMLElement;
  const linkId = document.getElementById(`${props.buttonId}-arrow`) as HTMLElement;
  const handleHoverOn = () => {
    if (!buttonId) return;
    buttonId.style.backgroundColor = `${accent.color}`;
    buttonTextId.style.color = '#ffffff';
    linkId.style.filter = 'invert(100%) sepia(3%) saturate(3%) hue-rotate(71deg) brightness(106%) contrast(100%)';
  };

  const handleHoverOut = () => {
    if (!buttonId) return;
    buttonId.style.backgroundColor = '#ffffff';
    buttonTextId.style.color = `${accent.color}`;
    linkId.style.filter = `${accent.filter}`;
  };
  return (
    <InterlayRouterLink
      className='button-assets-container'
      to={props.buttonLink}>
      <button
        className='temp-dashboard-button'
        style={buttonColor}
        onMouseOver={() => handleHoverOn()}
        onMouseOut={() => {
          handleHoverOut();
        }}
        id={`${props.buttonId}-button-id`}>
        <h3
          id={`${props.buttonId}-button-text`}
          style={{ color: buttonColor.color }}>
          {props.buttonName}
        </h3>
        <ExternalLinkIcon
          id={`${props.buttonId}-arrow`}
          style={{ color: `${accent.color}` }}
          className='ml-1' />
      </button>
    </InterlayRouterLink>
  );
};

export default ButtonComponent;
