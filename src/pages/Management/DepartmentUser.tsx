import React, {CSSProperties, useEffect, useState} from 'react';
import {findUserByDepartment, updateUserStatus} from "../../component/axios/api";
import {useSelector} from "react-redux";
import {Dialog, DotLoading, List, PullToRefresh, Result, Tag, Toast} from "antd-mobile";
import {AutoSizer, List as VirtualizedList} from "react-virtualized";
import {PullStatus} from "antd-mobile/es/components/pull-to-refresh";

const statusRecord: Record<PullStatus, string> = {
    pulling: '下拉获取用户列表',
    canRelease: '松开获取用户列表',
    refreshing: '正在获取用户列表...',
    complete: '获取用户列表成功',
}

const red = 'rgba(243,36,1,1)';
const green = 'rgba(0,108,1,1)';
const yellow = 'rgba(255,141,0,1)';

const Index: React.FC = () => {

    const [isRenderList, setIsRenderList] = useState<boolean>(false);
    const [listHeight, setListHeight] = useState<number>(0);
    const [resultTitle, setResultTitle] = useState<JSX.Element>(<span>正在获取用户列表<DotLoading/></span>);
    const [resultType, setResultType] = useState<"waiting" | "success" | "error" | "info" | "warning">('waiting');
    const [dataSource, setDataSource] = useState<any>([]);

    useEffect(() => {
        // 获取屏幕高度
        const height = document.documentElement.clientHeight;
        setListHeight(height - 48 - 36 - 10);
    }, []);

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        findUserByDepartment(userInfo.uid).then(res => {
            const data = res.body.map((item: any, index: number) => {
                return {
                    ...item,
                    key: item.uid,
                    id: index + 1,
                }
            })
            setDataSource(data)
            setIsRenderList(true)
        }).catch(() => {
            setResultTitle(<span>暂无用户</span>)
            setResultType('warning')
            setDataSource([])
        })
    }

    const changeUserStatus = (uid: string, status: number) => {
        Dialog.confirm({
            content: status === 0 ? '确认启用当前用户吗？' : '确认禁用当前用户吗？',
            onConfirm: async () => {
                await updateUserStatus(uid, status).then(res => {
                    const newDataSource = dataSource.map((item: any) => {
                        if (item.uid === uid) {
                            item.status = status
                        }
                        return item
                    })
                    setDataSource(newDataSource)
                    Toast.show({
                        icon: 'success',
                        content: '修改成功'
                    })
                }).catch(() => {
                    Toast.show({
                        icon: 'error',
                        content: '修改失败'
                    })
                })
            },
        })
    }

    const RenderStatus = (status: number) => {
        switch (status) {
            case 0:
                return <Tag color={green}>正常</Tag>
            case -1:
                return <Tag color={red}>禁用</Tag>
            default:
                return <Tag color={yellow}>未知</Tag>
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
                <p>UID：{item.uid}</p>
                <p>用户名：{item.username}</p>
                <p>真实姓名：{item.realeName}</p>
                <p>性别：{item.gender}</p>
                <p>邮箱：{item.email}</p>
                <p>电话：{item.tel}</p>
                <p>提交时间：{item.create_time}</p>
                <p>更新时间：{item.update_time}</p>
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
                extra={RenderStatus(item.status)}
                onClick={() => {
                    Dialog.show({
                        content: RenderDialogContent(item),
                        closeOnAction: true,
                        actions: [{
                            key: 'disabled',
                            text: item.status === 0 ? '禁用' : '启用',
                            style: {
                                color: item.status === 0 ? red : green,
                            },
                            bold: true,
                            onClick: () => {
                                changeUserStatus(item.uid, item.status === 0 ? -1 : 0)
                            }
                        }, {
                            key: 'close',
                            text: '关闭',
                        }],
                    })
                }}
            >
                {item.realeName}
            </List.Item>
        )
    }

    return (
        <PullToRefresh
            renderText={status => {
                return <div>{statusRecord[status]}</div>
            }}
            onRefresh={async () => {
                await findUserByDepartment(userInfo.uid).then(res => {
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
                        setResultTitle(<span>暂无用户</span>)
                        setResultType('warning')
                        setDataSource([])
                    }
                })
            }}
        >
            {
                isRenderList ? (
                    <List header="用户列表">
                        {/*// @ts-ignore*/}
                        <AutoSizer disableHeight>
                            {({width}: { width: number }) => (
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
