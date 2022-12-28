import {createUseStyles} from "react-jss";

export const useStyles = createUseStyles({
    mobileHomeBody: {
        width: "100%",
        height: "100%",
        maxWidth: 600,
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        "::-webkit-scrollbar": {
            width: 4,
            height: 6,
            backgroundColor: "#fff",
        },
        "::-webkit-scrollbar-thumb": {
            backgroundColor: "#bfbfbf",
        }
    },
    outlet: {
        width: "100%",
        height: "calc(100% - 49px)",
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "#fff",
        "[data-prefers-color-scheme=dark] &": {
            backgroundColor: "rgba(26, 26, 26, 1)",
        }
    },
    tabBar: {
        width: "100%",
        height: 49,
        maxWidth: 600,
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        "[data-prefers-color-scheme=dark] &": {
            backgroundColor: "#000",
        }
    },
    tabBarContainer: {
        width: "100%",
        height: "100%",
    },
    tabs: {
        height: 42,
        width: "100%",
        position: "fixed",
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: "#fff",
        "[data-prefers-color-scheme=dark] &": {
            backgroundColor: "#000",
        }
    },
    tabBarOutlet: {
        width: "100%",
        height: 'calc(100% - 42px)',
        position: "relative",
        top: 42,
        left: 0,
        overflow: "hidden",
        backgroundColor: "#fff",
        "[data-prefers-color-scheme=dark] &": {
            backgroundColor: "rgba(26, 26, 26, 1)",
        }
    },
    copy: {
        fontSize: 12,
        textAlign: "center",
        color: "rgba(0, 0, 0, .45)",
        marginTop: 20,
        "[data-prefers-color-scheme='dark'] &": {
            color: "rgba(255, 255, 255, .45)",
        }
    },
    errorBlock: {
        padding: 20
    }
})
