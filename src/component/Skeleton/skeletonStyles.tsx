import {createUseStyles} from "react-jss";

export const useStyles = createUseStyles({
    fullScreen: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    tipsFont: {
        fontSize: "16px",
        margin: "16px 0"
    }
});