
import React from "react";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import Topbar from "../../src/common/components/topbar";
import { expect } from "chai";
import { mount } from "enzyme";
import { BrowserRouter as Router, Switch } from "react-router-dom";

const mockStore = configureMockStore([]);

const requestDotMocked = async (): Promise<void> => {
    return Promise.resolve();
}

describe("Component: Topbar ", () => {
    before(() => {
    })

    it("1. Hide Topbar if is loading", (done) => {
        
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: [],
                relayerLoaded: false,
                vaultClientLoaded: true, 
                polkaBtcLoaded: true
            },
        });

        window["relayer"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };
        window["vaultClient"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };

        const wrapper = mount(<Provider store={store}>
            <Router>
                <Topbar 
                    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
                    requestDOT={requestDotMocked} />
                <Switch>
                </Switch>
            </Router>
        </Provider>);

        setTimeout(()=>{
            wrapper.update();
            expect(wrapper.find("#pbtc-topbar")).to.have.lengthOf(2);
            expect(wrapper.find("#basic-navbar-nav")).to.have.lengthOf(0);
            done();
        });       
    });

    it("2. Show Topbar after loading", (done) => {
        
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: [],
                relayerLoaded: true,
                vaultClientLoaded: true, 
                polkaBtcLoaded: true
            },
        });

        window["relayer"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };
        window["vaultClient"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };

        const wrapper = mount(<Provider store={store}>
            <Router>
                <Topbar 
                    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
                    requestDOT={requestDotMocked} />
                <Switch>
                </Switch>
            </Router>
        </Provider>);
        
        setTimeout(()=>{
            expect(wrapper.find("#pbtc-topbar")).to.have.lengthOf(2);
            expect(wrapper.find("#basic-navbar-nav")).to.have.lengthOf(0);
            wrapper.update();
            expect(wrapper.find("#basic-navbar-nav")).to.have.lengthOf(4);
            done();
        });       
    });

    it("3. Hide relayer tab", (done) => {
        
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: [],
                relayerLoaded: true,
                vaultClientLoaded: true, 
                polkaBtcLoaded: true
            },
        });

        window["relayer"] = {
            isConnected: () => new Promise((resolve) => resolve(false))
        };
        window["vaultClient"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };

        const wrapper = mount(<Provider store={store}>
            <Router>
                <Topbar 
                    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
                    requestDOT={requestDotMocked} />
                <Switch>
                </Switch>
            </Router>
        </Provider>);
        
        setTimeout(()=>{
            expect(wrapper.find("#pbtc-topbar")).to.have.lengthOf(2);
            expect(wrapper.find("#basic-navbar-nav")).to.have.lengthOf(0);
            expect(wrapper.find("#relayer-nav-item")).to.have.lengthOf(0);
            wrapper.update();
            expect(wrapper.find("#relayer-nav-item")).to.have.lengthOf(0);
            expect(wrapper.find("#basic-navbar-nav")).to.have.lengthOf(4);
            done();
        });       
    });

    it("4. Hide vault tab", (done) => {
        
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: [],
                relayerLoaded: true,
                vaultClientLoaded: true, 
                polkaBtcLoaded: true
            },
        });

        window["relayer"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };
        window["vaultClient"] = {
            isConnected: () => new Promise((resolve) => resolve(false))
        };

        const wrapper = mount(<Provider store={store}>
            <Router>
                <Topbar 
                    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
                    requestDOT={requestDotMocked} />
                <Switch>
                </Switch>
            </Router>
        </Provider>);
        
        setTimeout(()=>{
            expect(wrapper.find("#pbtc-topbar")).to.have.lengthOf(2);
            expect(wrapper.find("#basic-navbar-nav")).to.have.lengthOf(0);
            expect(wrapper.find("#vault-nav-item")).to.have.lengthOf(0);
            wrapper.update();
            expect(wrapper.find("#vault-nav-item")).to.have.lengthOf(0);
            expect(wrapper.find("#basic-navbar-nav")).to.have.lengthOf(4);
            done();
        });       
    });

    it("5. Hide account button", (done) => {
        
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: [],
                address: undefined,
                relayerLoaded: true,
                vaultClientLoaded: true, 
                polkaBtcLoaded: true
            },
        });

        window["relayer"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };
        window["vaultClient"] = {
            isConnected: () => new Promise((resolve) => resolve(false))
        };

        const wrapper = mount(<Provider store={store}>
            <Router>
                <Topbar 
                    address={undefined}
                    requestDOT={requestDotMocked} />
                <Switch>
                </Switch>
            </Router>
        </Provider>);
        
        setTimeout(()=>{
            wrapper.update();
            expect(wrapper.find("#account-button")).to.have.lengthOf(0);
            done();
        });
    });

    it("6. Show account button", (done) => {
        
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: [],
                relayerLoaded: true,
                vaultClientLoaded: true, 
                polkaBtcLoaded: true
            },
        });

        window["relayer"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };
        window["vaultClient"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };

        const wrapper = mount(<Provider store={store}>
            <Router>
                <Topbar 
                    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
                    requestDOT={requestDotMocked} />
                <Switch>
                </Switch>
            </Router>
        </Provider>);

        setTimeout(()=>{
            wrapper.update();
            expect(wrapper.find("#account-button")).to.have.lengthOf(3);
            done();
        });     
    });

    it("7. Show Select Account button", (done) => {
        
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: ["polkadot.js"],
                relayerLoaded: true,
                vaultClientLoaded: true, 
                polkaBtcLoaded: true
            },
        });

        window["relayer"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };
        window["vaultClient"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };

        const wrapper = mount(<Provider store={store}>
            <Router>
                <Topbar 
                    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
                    requestDOT={requestDotMocked} />
                <Switch>
                </Switch>
            </Router>
        </Provider>);

        setTimeout(()=>{
            wrapper.update();
            expect(wrapper.find("#account-button").at(0).text()).equal("Select Account");
            done();
        });     
    });

    it("8. Show Connect Wallet button", (done) => {
        
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: [],
                relayerLoaded: true,
                vaultClientLoaded: true, 
                polkaBtcLoaded: true
            },
        });

        window["relayer"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };
        window["vaultClient"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };

        const wrapper = mount(<Provider store={store}>
            <Router>
                <Topbar 
                    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
                    requestDOT={requestDotMocked} />
                <Switch>
                </Switch>
            </Router>
        </Provider>);

        setTimeout(()=>{
            wrapper.update();
            expect(wrapper.find("#account-button").at(0).text()).equal("Connect Wallet");
            done();
        });     
    });

    it("9. Show Account button", (done) => {
        
        const store = mockStore({
            general: {
                showAccountModal: true,
                address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
                accounts: [],
                extensions: ["polkadot.js"],
                relayerLoaded: true,
                vaultClientLoaded: true, 
                polkaBtcLoaded: true
            },
        });

        window["relayer"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };
        window["vaultClient"] = {
            isConnected: () => new Promise((resolve) => resolve(true))
        };

        const wrapper = mount(<Provider store={store}>
            <Router>
                <Topbar 
                    address={"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"}
                    requestDOT={requestDotMocked} />
                <Switch>
                </Switch>
            </Router>
        </Provider>);

        setTimeout(()=>{
            wrapper.update();
            expect(wrapper.find("#account-button").at(0).text()).equal("Account:5GrwvaEF5z...cNoHGKutQY");
            done();
        });     
    });
});