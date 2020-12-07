import React from "react";
import ButtonMaybePending from "../../src/common/components/pending-button";
import { expect } from "chai";
import { shallow } from "enzyme";

describe("Component: ButtonMaybePending: ", () => {
    it("1. show hour glass if is panding ", () => {
        const wrap = shallow(<ButtonMaybePending isPending={true}></ButtonMaybePending>);
        expect(wrap.find("FaHourglass")).to.have.lengthOf(1);
    });

    it("2. hide hour glass if not panding ", () => {
        const wrap = shallow(<ButtonMaybePending isPending={false}></ButtonMaybePending>);
        expect(wrap.find("FaHourglass")).to.have.lengthOf(0);
    });
});
