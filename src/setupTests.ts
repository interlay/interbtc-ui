import register from "ignore-styles";
import "jsdom-global/register";
import "raf/polyfill";

register([".sass", ".scss", ".png", ".svg", ".jpg"]);

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
