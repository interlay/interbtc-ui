import { Container, Image } from "react-bootstrap";
import React, { Component } from "react";
import { FaTelegramPlane, FaMediumM, FaGithub, FaTwitter } from 'react-icons/fa';
import interlayImg from "../../assets/img/interlay.png";
import web3FoundationImg from "../../assets/img/web3foundation_grants_badge_black.png"

export default class Footer extends Component {

    render() {
        return (
            <footer className="footer mt-5 flex-fill fixed-bottom">
                <Container>
                    <div className="row">
                        <div className="col-md-12 float-md-left">
                            <h3 style={{ fontSize: "1.5em", color: "white" }}  className="lead mt-3">PolkaBTC is built and powered by   &nbsp; &nbsp; &nbsp; &nbsp;
                    <a href="https://www.interlay.io/" target="__blank"><Image src={interlayImg} height="30em"></Image></a>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                            <a href="https://web3.foundation/" target="__blank"><Image src={web3FoundationImg} height="40rem"></Image></a>
                            </h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 float-md-left">
                        <h4 style={{ fontSize: "1.2em", color: "white" }} className="lead">
                            <a  rel="noopener noreferrer" title="" data-placement="bottom"
                                href="https://t.me/interlay" target="_blank"
                                data-original-title="Join our Telegram channel">
                                <FaTelegramPlane></FaTelegramPlane>
                            </a>
                            &nbsp; &nbsp; &nbsp;
                            <a rel="noopener noreferrer" title="" data-placement="bottom"
                                href="https://medium.com/Interlay" target="_blank" data-original-title="Follow us on Medium">
                                <FaMediumM></FaMediumM>
                            </a>
                            &nbsp; &nbsp; &nbsp;
                                <a rel="noopener noreferrer" title="" data-placement="bottom"
                                href="https://github.com/interlay" target="_blank" data-original-title="Follow us on Github">
                                <FaGithub></FaGithub>
                            </a>
                            &nbsp; &nbsp; &nbsp;
                            <a rel="noopener noreferrer" title="" data-placement="bottom"
                                href="https://twitter.com/interlayHQ" target="_blank"
                                data-original-title="Follow us on Twitter">
                                <FaTwitter></FaTwitter>
                            </a>
                            </h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 float-md-left">
                            <h3 style={{ fontSize: "0.8em", color: "white" }} className="lead mt-3">&copy; 2020 Interlay. All Rights Reserved
                            </h3>
                        </div>
                    </div>
                </Container>
            </footer>
        );
    }
}

// export default withRouter(Footer);