import { KUSAMA } from "../constants/relay-chain-names";

/**
 * Helper to get status color variant compatible with theme. 
 * @param { 'green' | 'yellow' | 'red'} color Color variant.
 * @param {string} cssProperty CSS Property to prefix color with.
 * @return {string} Appropriate color shade.
 */
const getColorShade = (color: 'green' | 'yellow' | 'red', cssProperty = 'text'): string => {
    const isKintsugiTheme = process.env.REACT_APP_RELAY_CHAIN_NAME === KUSAMA;
    let colorVariation;

    if (color === 'green') {
        colorVariation = isKintsugiTheme ? 'interlayConifer' : 'interlayConifer-800'
    }
    if (color === 'yellow') {
        colorVariation = isKintsugiTheme ? 'interlayCalifornia' : 'interlayCalifornia-700';
    }
    if (color === 'red') {
        colorVariation = isKintsugiTheme ? 'interlayCinnabar' : 'interlayCinnabar-700';
    }

    return `${cssProperty}-${colorVariation}`;
}

export { getColorShade };