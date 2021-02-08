import React from "react";
import { Link } from "react-router-dom";
import "../dashboard.page.scss";
import Icon_external_link from "../../../assets/img/icons/Icon-external-link.svg";
import { getAccents } from "../dashboard-colors";
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
        color: `${accent.color}`,
    };
    const buttonId = document.getElementById(`${props.buttonId}-button-id`) as HTMLElement;
    const buttonTextId = document.getElementById(`${props.buttonId}-button-text`) as HTMLElement;
    const linkId = document.getElementById(`${props.buttonId}-arrow`) as HTMLElement;
    const handleHoverOn = () => {
        buttonId.style.backgroundColor = `${accent.color}`;
        buttonTextId.style.color = "#ffffff";
        linkId.style.filter = "invert(100%) sepia(3%) saturate(3%) hue-rotate(71deg) brightness(106%) contrast(100%)";
    };

    const handleHoverOut = () => {
        buttonId.style.backgroundColor = "#ffffff";
        buttonTextId.style.color = `${accent.color}`;
        linkId.style.filter = `${accent.filter}`;
    };
    return (
        <button
            style={buttonColor}
            onMouseOver={() => handleHoverOn()}
            onMouseOut={() => {
                handleHoverOut();
            }}
            id={`${props.buttonId}-button-id`}
        >
            <Link className="button-assets-container" to={props.buttonLink}>
                <h3 id={`${props.buttonId}-button-text`} style={{ color: buttonColor.color }}>
                    {props.buttonName}
                </h3>
                <img
                    style={{
                        filter: `${accent.filter}`,
                    }}
                    className="external-link"
                    src={Icon_external_link}
                    alt=""
                    id={`${props.buttonId}-arrow`}
                />
            </Link>
        </button>
    );
};

export default ButtonComponent;
