import React from "react";
import { mount } from "enzyme";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import AccountModal from "../../common/components/account-modal/account-modal";
import { expect } from "chai";

const mockStore = configureMockStore([]);

describe("Component: Testa Account Modal ", () => {
    const onSelect = (): Promise<void> => {
        return Promise.resolve();
    };

    it("1. No extensions, No Accounts", () => {
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: [],
            },
        });

        const wrapper = mount(
            <Provider store={store}>
                <AccountModal onSelected={onSelect} />
            </Provider>
        );
        expect(wrapper.find("#account-modal-title").text()).equal("Pick a wallet");
        expect(wrapper.find(".description")).to.be.lengthOf(1);
        expect(wrapper.find("#account-modal-no-account")).to.be.lengthOf(0);
    });

    it("2. One extension, No Accounts", () => {
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [],
                extensions: ["polkabtc-js"],
            },
        });

        const wrapper = mount(
            <Provider store={store}>
                <AccountModal onSelected={onSelect} />
            </Provider>
        );
        expect(wrapper.find("#account-modal-title").text()).equal("Select account");
        expect(wrapper.find("#account-modal-no-account")).to.be.lengthOf(1);
    });

    it("3. One extension, One Account", () => {
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: ["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
                extensions: ["polkabtc-js"],
            },
        });

        const wrapper = mount(
            <Provider store={store}>
                <AccountModal onSelected={onSelect} />
            </Provider>
        );
        expect(wrapper.find("#account-modal-title").text()).equal("Select account");
        expect(wrapper.find("#account-modal-no-account")).to.be.lengthOf(0);
        expect(wrapper.find(".one-account")).to.be.lengthOf(1);
    });

    it("4. One extension, Multiple accounts", () => {
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [
                    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
                    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
                    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
                ],
                extensions: ["polkadot-js"],
            },
        });

        const wrapper = mount(
            <Provider store={store}>
                <AccountModal onSelected={onSelect} />
            </Provider>
        );

        expect(wrapper.find("#account-modal-title").text()).equal("Select account");
        expect(wrapper.find("#account-modal-no-account")).to.be.lengthOf(0);
        expect(wrapper.find(".one-account")).to.be.lengthOf(3);
    });

    it("5. Test selecting", () => {
        const store = mockStore({
            general: {
                showAccountModal: true,
                accounts: [
                    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQ1",
                    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQ2",
                    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQ6",
                ],
                extensions: ["polkadot-js"],
            },
        });

        const onSelected = (selected: string): Promise<void> => {
            expect(selected).equals("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQ1");
            return Promise.resolve();
        };

        const wrapper = mount(
            <Provider store={store}>
                <AccountModal onSelected={onSelected} />
            </Provider>
        );

        wrapper.find(".one-account").at(0).simulate("click");
        expect(wrapper.find("#account-modal-title").text()).equal("Select account");
        expect(wrapper.find("#account-modal-no-account")).to.be.lengthOf(0);
        expect(wrapper.find(".one-account")).to.be.lengthOf(3);
    });
});
