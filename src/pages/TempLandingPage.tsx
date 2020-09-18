import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { Image, Button, Col, Row } from "react-bootstrap";

import PolkaBTCImg from "../assets/img/polkabtc/PolkaBTC_white.svg";

// class LandingPage extends Component<AppState & RouteComponentProps, LandingProps> {
class TempLandingPage extends Component {

    componentDidMount(): void {
    }

    render(): JSX.Element {
        return (
            <div>
                <section className="jumbotron min-vh-100 text-center polkabtc-background no-margin-bottom">
                    <div className="container mt-5">
                        <Link to="/">
                            <Image src={PolkaBTCImg} width="256"></Image>
                        </Link>
                        <h1 style={{ color: "white" }} className="mt-3">
                            PolkaBTC: Trustless Bitcoin on Polkadot
                      </h1>
                        <h4 style={{ color: "white" }} className="mt-3">
                            More infos soon...</h4>
                    </div>
                </section>
            </div>
        );
    }
}

// export default withRouter(LandingPage);
export default TempLandingPage;
