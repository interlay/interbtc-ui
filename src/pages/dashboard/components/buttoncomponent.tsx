import React from "react";
import "../dashboard.page.scss";
import Icon_external_link from "../../../assets/img/icons/Icon-external-link.svg";
import { getAccents } from "../dashboardcolors";
type buttonProps = {
    buttonName: string;
    propsButtonColor: string;
    // buttonLink: String;
};

const ButtonComponent = (props: buttonProps): React.ReactElement => {
    const accent = getAccents(`${props.propsButtonColor}`);
    const buttonColor = {
        border: `1.7px solid ${accent.colour}`,
        color: `${accent.colour}`,
    };
    return (
        <button style={buttonColor}>
            <div className="button-assets-container">
                <h3>{props.buttonName}</h3>
                <img
                    style={{
                        filter: `${accent.filter}`,
                    }}
                    className="external-link"
                    src={Icon_external_link}
                    alt=""
                />
            </div>
        </button>
    );
};

export default ButtonComponent;
