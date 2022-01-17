import { Colors } from "../models";

export function getControllersStyle(colors: Colors) {
  return `
    .paranoid-controls {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .paranoid-button {
        margin-left: 12px;
        border-radius: 4px;
        height: 36px;
        width: 36px;
        line-height: 13px;
        font-family: YS Text;
        font-size: 13px;
        text-align: center;
        padding: 0;
        box-shadow: 0px 5px 6px ${colors.nodeShadow};
        border: 1px solid ${colors.buttonBorderColor};
        background-color: ${colors.nodeFill};
        color: ${colors.textColor};
        cursor: pointer;
    }
    .paranoid-button:focus {
        outline: none;
    }
    .paranoid-button:active {
        border: 1px solid ${colors.buttonBorderColor};
    }
    .paranoid-button_plus {
        margin-left: 0;
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .paranoid-button_minus {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
`;
}
