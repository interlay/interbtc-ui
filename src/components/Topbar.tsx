import React, { Component } from "react";
import AppState from "../types/AppState";
import polkaBTCLogo from "../assets/img/polkabtc/PolkaBTC_black.png";
import { Navbar, Nav, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsFillEjectFill, BsUnlockFill } from "react-icons/bs";
import { IoMdCash } from "react-icons/io";

export default class Topbar extends Component<AppState, {}> {
  constructor(props: AppState) {
    super(props);
  }
  render() {
    return(
      <Navbar bg="light" expand="lg" className="border-bottom shadow-sm">
        <Navbar.Brand>
          <Image src={polkaBTCLogo} width="90" className="d-inline-block align-top" height="30" fluid />
          {/* <Link to="/" className="text-decoration-none"> XOpts</Link> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {(this.props.account !== undefined) &&
              <Link className="nav-link" to="/issue">
                Buy <IoMdCash/>
              </Link>

            }
            {(this.props.account !== undefined) &&
              <Link className="nav-link" to="/issue">
                Mint <BsUnlockFill/>
              </Link>

            }
            {(this.props.account !== undefined) &&
              <Link className="nav-link" to="/redeem">
                Redeem <BsFillEjectFill/>
              </Link>
            }
          </Nav>
          <Nav>
            {(this.props.account !== undefined) &&
              <Link className="nav-link" to="/">
                <Button variant="dark" size="sm" style={{borderRadius: "1em"}}>
                   Account: {this.props.account.substring(0, 10)}...{this.props.account.substring(38)}
                </Button>
              </Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
