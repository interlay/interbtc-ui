import React from "react";
import "../dashboard.page.scss";
import Icon_external_link from "../../../assets/img/icons/Icon-external-link.svg";
import { getAccents } from "../dashboard-colors";
type buttonProps = {
    buttonName: string;
    propsButtonColor: string;
    buttonId: string;
    // buttonLink: String;
};

const ButtonComponent = (props: buttonProps): React.ReactElement => {
    const accent = getAccents(`${props.propsButtonColor}`);
    const buttonColor = {
        border: `1.7px solid ${accent.colour}`,
        color: `${accent.colour}`,
    };
    const buttonId = document.getElementById(`${props.buttonId}-button-id`) as HTMLElement;
    const buttonTextId = document.getElementById(`${props.buttonId}-button-text`) as HTMLElement;
    const linkId = document.getElementById(`${props.buttonId}-arrow`) as HTMLElement;
    const handleHoverOn = () => {
        buttonId.style.backgroundColor = `${accent.colour}`;
        buttonTextId.style.color = "#ffffff";
        linkId.style.filter = "invert(100%) sepia(3%) saturate(3%) hue-rotate(71deg) brightness(106%) contrast(100%)";
    };

    const handleHoverOut = () => {
        buttonId.style.backgroundColor = "#ffffff";
        buttonTextId.style.color = `${accent.colour}`;
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
            <div className="button-assets-container">
                <h3 id={`${props.buttonId}-button-text`}>{props.buttonName}</h3>
                <img
                    style={{
                        filter: `${accent.filter}`,
                    }}
                    className="external-link"
                    src={Icon_external_link}
                    alt=""
                    id={`${props.buttonId}-arrow`}
                />
            </div>
        </button>
    );
};

export default ButtonComponent;
