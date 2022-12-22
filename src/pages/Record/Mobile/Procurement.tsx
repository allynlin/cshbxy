import React, {CSSProperties, useEffect, useState} from 'react';
import {deleteProcurement, findProcurementList} from '../../../component/axios/api';
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTagMobile";
import {PullStatus} from "antd-mobile/es/components/pull-to-refresh";
import {Dialog, DotLoading, List, PullToRefresh, Result, Tag, Toast} from "antd-mobile";
import {AutoSizer, List as VirtualizedList} from "react-virtualized";

const statusRecord: Record<PullStatus, string> = {
    pulling: '下拉获取最新记录',
    canRelease: '松开获取最新记录',
    refreshing: '正在获取采购记录...',
    complete: '获取采购记录成功',
}

const Procurement: React.FC = () => {

    const [isRenderList, setIsRenderList] = useState<boolean>(false);
    const [listHeight, setListHeight] = useState<number>(0);
    const [resultTitle, setResultTitle] = useState<JSX.Element>(<span>正在获取采购记录<DotLoading/></span>);
    const [resultType, setResultType] = useState<"waiting" | "success" | "error" | "info" | "warning">('waiting');
    const [dataSource, setDataSource] = useState<any>([]);

    useEffect(() => {
        // 获取屏幕高度
        const height = document.documentElement.clientHeight;
        setListHeight(height - 48 - 36 - 2);
    }, [])

    // 删除确认框
    const showDeleteConfirm = (e: string) => {
        Dialog.confirm({
            content: '确认删除该条记录吗？',
            onConfirm: async () => {
                await deleteProcurement(e).then((res: any) => {
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
                            setResultTitle(<span>暂无采购记录</span>)
                        } else {
                            setDataSource(arr);
                        }
                    } else {
                        Toast.show({
                            icon: 'fail',
                            content: '删除失败',
                            position: 'bottom',
                        })
                    }
                })
            },
        })
    };

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        findProcurementList().then(res => {
            if (res.code === 200) {
                const newDataSource = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        id: index + 1,
                        key: item.uid
                    }
                });
                setDataSource(newDataSource);
                setIsRenderList(true)
            } else {
                setResultTitle(<span>暂无请假记录</span>)
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
                <p>采购金额：{item.price}</p>
                <p>采购项目：{item.items}</p>
                {item.status === 0 ? <p>下级审批人：{item.nextUid}</p> : null}
                {item.status === 2 ?
                    <p>驳回原因：<Tag color='rgba(243, 36, 1,0.8)'>{item.reject_reason}</Tag></p> : null}
                <p>提交时间：{item.create_time}</p>
                <p>更新时间：{item.update_time}</p>
                <p>原因：{item.reason}</p>
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
                description={RenderReason(item.items)}
                extra={RenderStatusTag(item.status)}
                onClick={() => {
                    Dialog.show({
                        content: RenderDialogContent(item),
                        closeOnAction: true,
                        actions: [
                            {
                                key: 'delete',
                                text: '删除',
                                danger: true,
                                bold: true,
                                disabled: item.status !== 0,
                                onClick: () => {
                                    showDeleteConfirm(item.uid)
                                }
                            }, {
                                key: 'close',
                                text: '关闭',
                            }
                        ],
                    })
                }}
            >
                {item.price}
            </List.Item>
        )
    }

    return (
        <PullToRefresh
            renderText={status => {
                return <div>{statusRecord[status]}</div>
            }}
            onRefresh={async () => {
                await findProcurementList().then(res => {
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
                        setIsRenderList(false)
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

export default Procurement;
