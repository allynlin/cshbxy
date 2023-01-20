import {createUseStyles} from "react-jss";

export const useStyles = createUseStyles({
    webHeader: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e8e8e8',
    },
    headerTit: {
        marginTop: '1em'
    },
    webLayoutContent: {
        padding: 24,
        marginTop: 16,
        minHeight: 600,
        borderRadius: 6,
        overflow: 'auto',
    },
    webLayoutFooter: {
        textAlign: 'center',
    },
    flexCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    webWaiting: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
    },
    webWaitingImg: {
        width: 100,
    },
    webWaitingProgress: {
        width: '50%'
    }
})