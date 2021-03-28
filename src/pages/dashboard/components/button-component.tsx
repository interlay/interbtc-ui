import React from 'react';
import '../dashboard.page.scss';
import iconExternalLink from '../../../assets/img/icons/Icon-external-link.svg';
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
    // TODO: should create `LinkButton`
    <InterlayRouterLink
      // TODO: hardcoded
      style={{
        textDecoration: 'none'
      }}
      className='button-assets-container'
      to={props.buttonLink}>
      <button
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
        <img
          style={{
            filter: `${accent.filter}`
          }}
          className='external-link'
          src={iconExternalLink}
          alt=''
          id={`${props.buttonId}-arrow`} />
      </button>
    </InterlayRouterLink>
  );
};

export default ButtonComponent;
