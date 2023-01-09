import {createUseStyles} from "react-jss";

export const useStyles = createUseStyles({
    webHomeBody: {
        width: '100%',
        height: '100%',
    },
    webHeader: {
        width: '100%',
        minWidth: 800,
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
    contentBody: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    contentHead: {
        width: '100%',
        height: 50,
        display: 'flex',
        justifyContent: 'space-between',
    },
    tit: {
        marginTop: -5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    skeletonLoading: {
        width: '100%',
        height: 'calc(100% - 200x)',
        position: 'absolute',
        top: 80,
        left: 20,
        zIndex: 1000,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
    },
    skeletonThead: {
        width: '100%',
        height: 35,
    },
    skeletonTbody: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'calc(100% - 40px)',
        height: '100%'
    },
    skeletonTbodyTr: {
        width: 'calc(100% - 4px)',
        height: 50,
        margin: 2
    },
    skeletonFile: {
        width: '100%',
        height: 150,
        display: 'flex',
        flexDirection: 'column',
        "> antSkeleton.antSkeletonElement": {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            antSkeletonImage: {
                width: '100%',
                height: '100%',
            }
        }
    },
    skeletonFiles: {
        fontSize: 60,
        color: '#bfbfbf'
    },
    showFile: {
        padding: 16,
        width: '100%',
        height: 150,
        overflowX: 'auto',
        overflowY: 'hidden',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(236, 236, 236, 0.5)',
        borderRadius: 3,
        marginBottom: 16,
        "[data-scheme='dark'] &": {
            backgroundColor: 'rgba(50, 49, 48, 0.5)',
        }
    },
    fileItem: {
        marginLeft: 10,
        width: 200
    },
    cshbxy100Per: {
        width: '100%',
        height: '100%',
    },
    flex: {
        display: 'flex',
    },
    flexCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outPutHtml: {
        backgroundColor: "rgba(236, 236, 236,0.5)",
        borderRadius: 6,
        marginBottom: '1em',
        width: "100%",
        padding: 10,
        "&>p": {
            margin: 0,
        },
        "[data-scheme='dark'] &": {
            backgroundColor: "rgba(50, 49, 48,0.5)",
        }
    },
    settingGaussianBlurShowDiv: {
        width: '100%',
        height: '100px',
        marginBottom: 16,
        position: 'relative',
    },
    settingGaussianBlurImg: {
        width: '100%',
        height: '100px',
        position: 'absolute',
        top: 0,
        left: 0,
        objectFit: 'cover',
        objectPosition: 'center',
    },
    settingGaussianBlurCard: {
        width: '90%',
        height: '80%',
        borderRadius: 10,
        border: '1px solid #e8e8e8',
        position: 'absolute',
        top: '10%',
        left: '5%',
        zIndex: 1000,
    }
})
