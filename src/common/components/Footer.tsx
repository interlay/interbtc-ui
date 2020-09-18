import { Container, Image } from "react-bootstrap";
import React, { Component } from "react";
import { FaTelegramPlane, FaMediumM, FaGithub, FaTwitter } from 'react-icons/fa';
import interlayImg from "../../assets/img/interlay.png";


export default class Footer extends Component {

    render() {
        return (
            <footer className="footer mt-5 flex-fill fixed-bottom">
                <Container>
                    <div className="row">
                        <div className="col-lg-4 col-xs-12 float-left">
                        <div className="float-left nav-link text-capitalize">
                            A project by &nbsp; <a href="https://www.interlay.io/" target="__blank"><Image src={interlayImg} height="20rem"></Image></a>
                            </div>
                        </div>
                        <div className="col-lg-4 col-xs-12">
                            <div className="float-left nav-link text-capitalize">
                                &copy;
                        <script>
                                    document.write(new Date().getFullYear())
                        </script> Interlay. All Rights Reserved | <a className=" text-capitalize" rel="tooltip" title="" data-placement="bottom"
                                    href="../docs/privacy-policy.pdf" target="_blank">Privacy Policy
                        </a>
                            </div>
                        </div>
                        <div className="col-lg-4 col-xs-12">
                            <div className="float-lg-right float-md-left">
                                <a className="nav-link lowercase" title="" data-placement="bottom" rel="noopener noreferrer"
                                href="mailto:contact@interlay.io" target="_blank" data-original-title="Drop us an email">
                                    contact@interlay.io
                                     </a>
                            </div>
                            <div className="float-lg-right float-md-left">
                                <a className="nav-link" rel="noopener noreferrer" title="" data-placement="bottom"
                                    href="https://t.me/interlay" target="_blank"
                                    data-original-title="Join our Telegram channel">
                                    <FaTelegramPlane></FaTelegramPlane>
                                </a>
                            </div>
                            <div className="float-lg-right float-md-left">
                                <a className="nav-link" rel="noopener noreferrer" title="" data-placement="bottom"
                                    href="https://medium.com/Interlay" target="_blank" data-original-title="Follow us on Medium">
                                    <FaMediumM></FaMediumM>
                                </a>
                            </div>
                            <div className="float-lg-right float-md-left">
                                <a className="nav-link" rel="noopener noreferrer" title="" data-placement="bottom"
                                    href="https://github.com/interlay" target="_blank" data-original-title="Follow us on Github">
                                    <FaGithub></FaGithub>
                                </a>
                            </div>
                            <div className="float-lg-right float-md-left">
                                <a className="nav-link" rel="noopener noreferrer" title="" data-placement="bottom"
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

// export default withRouter(Footer);