import React, {CSSProperties, useEffect, useState} from 'react';
import {findLeaveWaitApprovalList, resolveLeave} from '../../../component/axios/api';
import {PullStatus} from "antd-mobile/es/components/pull-to-refresh";
import {Dialog, DotLoading, List, PullToRefresh, Result, Toast} from "antd-mobile";
import {AutoSizer, List as VirtualizedList} from "react-virtualized";
import {useStyles} from "../../../styles/mobileStyle";

const statusRecord: Record<PullStatus, string> = {
    pulling: '下拉获取待审批申请',
    canRelease: '松开获取待审批申请',
    refreshing: '正在获取请假申请...',
    complete: '获取请假申请成功',
}

const red = 'rgba(243,36,1,1)';
const green = 'rgba(0,108,1,1)';

const Leave: React.FC = () => {

    const classes = useStyles();

    const [isRenderList, setIsRenderList] = useState<boolean>(false);
    const [listHeight, setListHeight] = useState<number>(0);
    const [resultTitle, setResultTitle] = useState<JSX.Element>(<span>正在获取待审批申请<DotLoading/></span>);
    const [resultType, setResultType] = useState<"waiting" | "success" | "error" | "info" | "warning">('waiting');
    const [dataSource, setDataSource] = useState<any>([]);

    useEffect(() => {
        // 获取屏幕高度
        const height = document.documentElement.clientHeight;
        setListHeight(height - 48 - 36 - 2);
    }, []);

    const showResolveConfirm = (e: string) => {
        Dialog.confirm({
            content: '同意当前申请吗？',
            onConfirm: async () => {
                await resolveLeave(e).then((res: any) => {
                    if (res.code === 200) {
                        Toast.show({
                            icon: 'success',
                            content: res.msg,
                            position: 'bottom',
                        })
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        if (arr.length === 0) {
                            setIsRenderList(false)
                            setResultType('warning')
                            setResultTitle(<span>暂无待审批申请</span>)
                        } else {
                            setDataSource(arr);
                        }
                    } else {
                        Toast.show({
                            icon: 'fail',
                            content: '审批失败',
                            position: 'bottom',
                        })
                    }
                })
            },
        })
    }

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        findLeaveWaitApprovalList().then((res: any) => {
            if (res.code === 200) {
                const arr = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        key: item.uid,
                        id: index + 1,
                    }
                })
                setDataSource(arr)
                setIsRenderList(true)
            } else {
                setResultTitle(<span>暂无待审批申请</span>)
                setResultType('warning')
                setDataSource([])
            }
        })
    }

    const RenderReason = (content: string) => {
        // 判断 content 的长度，如果超过 10 个字，就截取前 10 个字，然后加上 ...
        if (content.length > 10) {
            return content.slice(0, 10) + '...'
        } else {
            return content
        }
    }

    const style = {
        width: '100%',
        height: '100%',
        maxHeight: '200px',
        overflow: 'auto',
    }

    const RenderDialogContent = (item: any) => {
        return (
            <div style={style}>
                <p>申请人：{item.releaseUid}</p>
                <p>请假时间：{item.start_time}</p>
                <p>销假时间：{item.end_time}</p>
                <p>提交时间：{item.create_time}</p>
                <p>更新时间：{item.update_time}</p>
                <p>原因：</p>
                <div className={classes.outPutHtml} dangerouslySetInnerHTML={{__html: item.reason}}/>
            </div>
        )
    }

    function rowRenderer({
                             index,
                             style,
                         }: {
        index: number
        style: CSSProperties
    }) {
        const item = dataSource[index]
        return (
            <List.Item
                key={item.uid}
                style={style}
                description={RenderReason(item.reason)}
                onClick={() => {
                    Dialog.show({
                        content: RenderDialogContent(item),
                        closeOnAction: true,
                        actions: [{
                            key: 'resolve',
                            text: '通过',
                            style: {
                                color: green
                            },
                            bold: true,
                            onClick: () => {
                                showResolveConfirm(item.uid)
                            }
                        }, {
                            key: 'reject',
                            text: '移动端暂不支持驳回',
                            style: {
                                color: red
                            },
                            bold: true,
                            disabled: true,
                        }, {
                            key: 'close',
                            text: '关闭',
                        }],
                    })
                }}
            >
                {item.releaseUid}
            </List.Item>
        )
    }

    return (
        <PullToRefresh
            renderText={status => {
                return <div>{statusRecord[status]}</div>
            }}
            onRefresh={async () => {
                await findLeaveWaitApprovalList().then((res: any) => {
                    if (res.code === 200) {
                        const arr = res.body.map((item: any, index: number) => {
                            return {
                                ...item,
                                key: item.uid,
                                id: index + 1
                            }
                        })
                        setDataSource(arr)
                        setIsRenderList(true)
                    } else {
                        setResultTitle(<span>暂无待审批申请</span>)
                        setResultType('warning')
                        setDataSource([])
                    }
                })
            }}
        >
            {
                isRenderList ? (
                    <List>
                        {/*// @ts-ignore*/}
                        <AutoSizer disableHeight>
                            {({width}: { width: number }) => (
                                // @ts-ignore
                                <VirtualizedList
                                    rowCount={dataSource.length}
                                    rowRenderer={rowRenderer}
                                    width={width}
                                    height={listHeight}
                                    rowHeight={100}
                                    overscanRowCount={10}
                                />
                            )}
                        </AutoSizer>
                    </List>) : (
                    <Result
                        status={resultType}
                        title={resultTitle}
                    />
                )
            }
        </PullToRefresh>
    );
};

export default Leave;
