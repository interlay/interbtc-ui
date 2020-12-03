import { JSDOM } from "jsdom";
import register from "ignore-styles";

register([".sass", ".scss"]);

interface Global extends NodeJS.Global {
    window: Window;
    document: Document;
    navigator: {
        userAgent: string;
    };
}

const globalNode: Global = {
    ...global,
    window: window,
    document: window.document,
    navigator: {
        userAgent: "node.js",
    },
};

// Simulate window for Node.js
if (!globalNode.window && !globalNode.document) {
    const { window } = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>", {
        beforeParse(win) {
            win.scrollTo = () => {
                console.log("scroll");
            };
        },
        pretendToBeVisual: false,
        userAgent: "mocha",
    });

    // configure global variables wich like to be used in testing
    globalNode.document = window.document;
    globalNode.navigator = window.navigator;
}

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
