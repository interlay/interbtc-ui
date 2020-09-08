import React, { Component } from "react";
import AppState from "../types/AppState";
import polkaBTCLogo from "../../assets/img/polkabtc/PolkaBTC_black.png";
import { Navbar, Nav, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsFillEjectFill, BsUnlockFill, BsFillBarChartFill } from "react-icons/bs";
import { IoMdCash } from "react-icons/io";

export default class Topbar extends Component<AppState, {}> {

  render() {
    return(
      <Navbar bg="light" expand="lg" className="border-bottom shadow-sm">
        <Navbar.Brand>
          <Link className="text-decoration-none" to="/">
            <Image src={polkaBTCLogo} width="90" className="d-inline-block align-top" height="30" fluid />
          </Link>
          {/* <Link to="/" className="text-decoration-none"> XOpts</Link> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {(this.props.account !== undefined) &&
              <Link className="nav-link" to="/buy">
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
            {this.props.vault &&
              <Link className="nav-link" to="/vault">
                Vault <BsFillBarChartFill/>
              </Link>
            }
          </Nav>
          <Nav>
            {(this.props.address !== undefined) &&
              <Link className="nav-link" to="/">
                <Button variant="dark" size="sm" style={{borderRadius: "1em"}}>
                   Account: {this.props.address.substring(0, 10)}...{this.props.address.substring(38)}
                </Button>
              </Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
