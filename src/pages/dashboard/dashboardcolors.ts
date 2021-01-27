export interface Style {
    colour: string;
    filter?: string;
}

export function getAccents(colour: string): Style {
    let accent = { colour: "#000000", filter: "none" };
    switch (colour) {
        case "d_yellow":
            accent.colour = "#f7931a";
            accent.filter =
                "brightness(0) saturate(100%) invert(77%) sepia(49%) saturate(5098%) hue-rotate(350deg) brightness(102%) contrast(94%)";
            break;
        case "d_pink":
            accent.colour = "#e6007a";
            accent.filter =
                "brightness(0) saturate(100%) invert(16%) sepia(99%) saturate(6939%) hue-rotate(321deg) brightness(90%) contrast(102%)";
            break;
        case "d_blue":
            accent.colour = "#1c86ee";
            accent.filter =
                "brightness(0) saturate(100%) invert(39%) sepia(98%) saturate(1790%) hue-rotate(192deg) brightness(96%) contrast(95%)";
            break;
        case "d_orange":
            accent.colour = "#f95738";
            accent.filter =
                "brightness(0) saturate(100%) invert(44%) sepia(57%) saturate(2809%) hue-rotate(339deg) brightness(99%) contrast(97%)";
            break;
        case "d_green":
            accent.colour = "#4ac948";
            accent.filter =
                "brightness(0) saturate(100%) invert(68%) sepia(64%) saturate(530%) hue-rotate(66deg) brightness(89%) contrast(85%)";
            break;
        case "d_red":
            accent.colour = "#f32013";
            break;
        default:
            accent.colour = "#a9a9a9";
            accent.filter =
                "brightness(0) saturate(100%) invert(82%) sepia(7%) saturate(9%) hue-rotate(142deg) brightness(83%) contrast(85%)";
            break;
    }
    return accent;
}
