import { Container, Image } from "react-bootstrap";
import React, { Component } from "react";
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import interlayImg from "../../../assets/img/interlay.png";
import web3FoundationImg from "../../../assets/img/polkabtc/web3 foundation_grants_badge_black.png"
import "./footer.scss";

// eslint-disable-next-line
const privacyPolicy = require("../../../assets/docs/privacy-policy.pdf");
const pkg = require("../../../../package.json");
export default class Footer extends Component {

    render() {
        return (
            <footer className="footer flex-fill transparent-background text-white">
                <Container>
                    <div className="col-xs-12 col-lg-8 offset-lg-2">
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12  col-xs-12">
                                <div className="nav-link text-capitalize">
                                    <h3 style={{ fontSize: "1.5em", color: "white" }}>
                                        PolkaBTC is built and powered by &nbsp; <a href="https://www.interlay.io/" target="__blank"><Image src={interlayImg} height="30em"></Image></a>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                            <a href="https://web3.foundation/" target="__blank"><Image src={web3FoundationImg} height="40rem"></Image></a>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12  col-xs-12">
                                <div className="nav-link text-capitalize">
                                    <a href="https://github.com/interlay/polkabtc-ui" target="__blank">v{pkg.version}</a> &nbsp;
                                    &copy; 2020 Interlay. All Rights Reserved | <a className=" text-capitalize" rel="noopener noreferrer"
                                        href={privacyPolicy} target="_blank">Privacy Policy</a>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12  col-xs-12">
                                <a className="nav-link d-inline" title="" data-placement="bottom" rel="noopener noreferrer"
                                    href="mailto:polkabtc@interlay.io" target="_blank" data-original-title="Drop us an email">
                                    polkabtc@interlay.io
                                     </a>
                           
                                <a className="nav-link d-inline" rel="noopener noreferrer" title="" data-placement="bottom"
                                    href="https://discord.gg/C8tjMbgVXh" target="_blank"
                                    data-original-title="Join our Telegram channel">
                                    <FaDiscord></FaDiscord>
                                </a>
                            
                                <a className="nav-link d-inline" rel="noopener noreferrer" title="" data-placement="bottom"
                                    href="https://github.com/interlay" target="_blank" data-original-title="Follow us on Github">
                                    <FaGithub></FaGithub>
                                </a>
                            
                                <a className="nav-link d-inline" rel="noopener noreferrer" title="" data-placement="bottom"
                                    href="https://twitter.com/interlayHQ" target="_blank"
                                    data-original-title="Follow us on Twitter">
                                    <FaTwitter></FaTwitter>
                                </a>
                            </div>
                        </div>
                    </div>
                </Container>
            </footer>
        );
    }
}
