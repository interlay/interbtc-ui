import { KUSAMA, POLKADOT } from "../constants/relay-chain-names";

type RelayChain = 'kusama' | 'polkadot';
type ColorVariant = 'green' | 'yellow' | 'red';
type CssProperty = 'text' | 'bg' | 'ring' | 'border' | 'hover:bg';

type ColorShadeClasses = { [relayChain in RelayChain]: {
    [color in ColorVariant]: {
        [cssProperty in CssProperty]: string
    }
} }

const COLOR_SHADE_CLASSES: ColorShadeClasses = {
    [KUSAMA]: {
        green: {
            text: 'text-interlayConifer',
            bg: 'bg-interlayConifer',
            ring: 'ring-interlayConifer',
            border: 'border-interlayConifer',
            'hover:bg': 'hover:bg-interlayConifer'
        },
        yellow: {
            text: 'text-interlayCalifornia',
            bg: 'bg-interlayCalifornia',
            ring: 'ring-interlayCalifornia',
            border: 'border-interlayCalifornia',
            'hover:bg': 'hover:bg-interlayCalifornia'
        },
        red: {
            text: 'text-interlayCinnabar',
            bg: 'bg-interlayCinnabar',
            ring: 'ring-interlayCinnabar',
            border: 'border-interlayCinnabar',
            'hover:bg': 'hover:bg-interlayCinnabar'
        }
    },
    [POLKADOT]: {
        green: {
            text: 'text-interlayConifer-800',
            bg: 'bg-interlayConifer-800',
            ring: 'ring-interlayConifer-800',
            border: 'border-interlayConifer-800',
            'hover:bg': 'hover:bg-interlayConifer-800'
        },
        yellow: {
            text: 'text-interlayCalifornia-700',
            bg: 'bg-interlayCalifornia-700',
            ring: 'ring-interlayCalifornia-700',
            border: 'border-interlayCalifornia-700',
            'hover:bg': 'hover:bg-interlayCalifornia-700'
        },
        red: {
            text: 'text-interlayCinnabar-700',
            bg: 'bg-interlayCinnabar-700',
            ring: 'ring-interlayCinnabar-700',
            border: 'border-interlayCinnabar-700',
            'hover:bg': 'hover:bg-interlayCinnabar-700'
        }
    }
}

/**
 * Helper to get status color variant compatible with theme. 
 * @param {ColorVariant} colorVariant Color variant.
 * @param {CssProperty} cssProperty CSS Property to prefix color with.
 * @return {string} Appropriate color shade class.
 */
const getColorShade = (colorVariant: ColorVariant, cssProperty: CssProperty = 'text'): string => {
    const relayChain = process.env.REACT_APP_RELAY_CHAIN_NAME as RelayChain;

    return COLOR_SHADE_CLASSES[relayChain][colorVariant][cssProperty];
}

export { getColorShade };