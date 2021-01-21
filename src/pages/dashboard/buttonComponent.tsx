import React from "react";
import "./dashboard.page.scss";
import Icon_external_link from "../../assets/img/icons/Icon-external-link.svg";
type buttonProps = {
    buttonName: String;
    buttonColorName: String;
    // buttonLink: String;
};

const ButtonComponent = (props: buttonProps): React.ReactElement => {
    const buttonColor = {
        border: `1.6px solid ${props.buttonColorName}`,
        color: `${props.buttonColorName}`,
    };
    return (
        <button style={buttonColor}>
            <div className="button-assets-container">
                <h3>{props.buttonName}</h3>
                <img className="external-link" src={Icon_external_link} alt="" />
            </div>
        </button>
    );
};

export default ButtonComponent;
