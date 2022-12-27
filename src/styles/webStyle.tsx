import React from "react";
import {createUseStyles} from "react-jss";

export const useStyles = createUseStyles({
    webHomeBody: {
        width: '100%',
        height: '100%',
        padding: 10
    },
    webHeader: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e8e8e8',
        tit: {
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            lineHeight: 54
        }
    },
    webLayoutContent: {
        padding: 24,
        marginTop: 16,
        minHeight: 600,
        borderRadius: 6,
        overflow: 'auto',
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
        height: 55
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
        height: 51,
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
        width: '100%',
        height: 150,
        overflowX: 'auto',
        overflowY: 'hidden',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(236, 236, 236, 1)',
        borderRadius: 3,
        marginBottom: 16,
        "[data-scheme='dark'] &": {
            backgroundColor: 'rgba(50, 49, 48, 1)',
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
    }
})
