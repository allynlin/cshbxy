import React, {CSSProperties, useEffect, useState} from 'react';
import {findLoginRecord} from "../../component/axios/api";
import {useSelector} from "react-redux";
import {Dialog, DotLoading, List, PullToRefresh, Result} from "antd-mobile";
import {AutoSizer, List as VirtualizedList} from "react-virtualized";
import {PullStatus} from "antd-mobile/es/components/pull-to-refresh";

const statusRecord: Record<PullStatus, string> = {
    pulling: '下拉获取登录记录',
    canRelease: '松开获取登录记录',
    refreshing: '正在获取登录记录...',
    complete: '获取登录记录成功',
}

const red = 'rgba(243,36,1,1)';
const green = 'rgba(0,108,1,1)';
const yellow = 'rgba(255,141,0,1)';

const Index: React.FC = () => {

    const [isRenderList, setIsRenderList] = useState<boolean>(false);
    const [listHeight, setListHeight] = useState<number>(0);
    const [resultTitle, setResultTitle] = useState<JSX.Element>(<span>正在获取登录记录<DotLoading /></span>);
    const [resultType, setResultType] = useState<"waiting" | "success" | "error" | "info" | "warning">('waiting');
    const [dataSource, setDataSource] = useState<any>([]);

    useEffect(() => {
        // 获取屏幕高度
        const height = document.documentElement.clientHeight;
        setListHeight(height - 48 - 36 - 10);
    }, []);

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);

    const getType = (type: string) => {
        switch (type) {
            case '1':
                return "登录"
            case '2':
                return "自动登录"
            default:
                return "未知"
        }
    }


    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        findLoginRecord(userInfo.uid).then(res => {
            console.log(res.body)
            const newDataSoucre = res.body.map((item: any, index: number) => {
                return {
                    ...item,
                    id: index + 1,
                    key: index,
                    type: getType(item.type)
                }
            })
            setDataSource(newDataSoucre)
            setIsRenderList(true)
        }).catch(() => {
            setResultTitle(<span>暂无登录记录</span>)
            setResultType('warning')
            setDataSource([])
        })
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
                <p>浏览器：{item.browser}</p>
                <p>IP地址：{item.ipAddress}</p>
                <p>系统：{item.osName}</p>
                <p>登录时间：{item.create_time}</p>
                <p>登录类型：{item.type}</p>
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
                onClick={() => {
                    Dialog.show({
                        content: RenderDialogContent(item),
                        closeOnAction: true,
                        actions: [{
                            key: 'close',
                            text: '关闭',
                        }],
                    })
                }}
            >
                {item.create_time}
            </List.Item>
        )
    }

    return (
        <PullToRefresh
            renderText={status => {
                return <div>{statusRecord[status]}</div>
            }}
            onRefresh={async () => {
                await findLoginRecord(userInfo.uid).then(res => {
                    const newDataSoucre = res.body.map((item: any, index: number) => {
                        return {
                            ...item,
                            id: index + 1,
                            key: index,
                            type: getType(item.type)
                        }
                    })
                    setDataSource(newDataSoucre)
                    setIsRenderList(true)
                }).catch(() => {
                    setResultTitle(<span>暂无用户</span>)
                    setResultType('warning')
                    setDataSource([])
                })
            }}
        >
            {
                isRenderList ? (
                    <List header="登录记录">
                        {/*// @ts-ignore*/}
                        <AutoSizer disableHeight>
                            {({ width }: { width: number }) => (
                                // @ts-ignore
                                <VirtualizedList
                                    rowCount={dataSource.length}
                                    rowRenderer={rowRenderer}
                                    width={width}
                                    height={listHeight}
                                    rowHeight={55}
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

export default Index;
