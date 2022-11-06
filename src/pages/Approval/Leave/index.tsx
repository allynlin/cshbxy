import {Button, Drawer, message, Modal, Table, Typography} from 'antd';
import {ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {findLeaveWaitApprovalList, refreshLeave, resolveLeave} from '../../../component/axios/api';
import {green} from "../../../baseInfo";
import {RenderStatusColor} from "../../../component/Tag/RenderStatusColor";
import '../index.scss'
import RecordSkeleton from "../../../component/Skeleton/RecordSkeleton";
import Reject from "./Reject";

const {Title} = Typography;

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const Index: React.FC = () => {
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [dataSource, setDataSource] = useState([]);
    const [content, setContent] = useState<any>({});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (waitTime > 1) {
                setIsQuery(true)
                setWaitTime(e => e - 1)
                setIsQuery(true)
            } else {
                setIsQuery(false)
            }
        }, 1000)
        return () => {
            clearTimeout(timer)
        }
    }, [waitTime])

    useEffect(() => {
        // 当 content 变化时，在 dataSource 中找到对应的 uid，将 content 赋值给 dataSource 中的对应 uid
        let newDataSource: any = dataSource.map((item: any) => {
            if (item.uid === content.uid) {
                return content
            } else {
                return item
            }
        })
        setDataSource(newDataSource)
    }, [content])

    const refresh = (uid: string) => {
        setIsQuery(true)
        setWaitTime(10)
        if (isQuery) {
            return
        }
        refreshLeave(uid).then(res => {
            let newContent = {
                key: content.key,
                id: content.id,
                ...res.body
            }
            setContent(newContent)
        })
    }

    const showResolveConfirm = (e: string) => {
        Modal.confirm({
            title: '确认通过当前申请？',
            icon: <ExclamationCircleOutlined/>,
            content: '通过后不可变更，请谨慎操作',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                resolveLeave(e).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            message.warning('暂无待审批记录');
                        }
                    }
                })
            }
        });
    }

    // 表格列
    const columns: ColumnsType<DataType> = [
        {
            title: 'id',
            width: 100,
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            align: 'center',
        }, {
            title: '申请人',
            dataIndex: 'releaseUid',
            key: 'releaseUid',
            width: 150,
            align: 'center',
        }, {
            title: '请假时间',
            dataIndex: 'start_time',
            key: 'start_time',
            width: 150,
            align: 'center',
        }, {
            title: '销假时间',
            dataIndex: 'end_time',
            key: 'end_time',
            width: 150,
            align: 'center',
        }, {
            title: '操作',
            key: 'uid',
            dataIndex: 'uid',
            fixed: 'right',
            width: 200,
            align: 'center',
            render: (text: any, record: any) => {
                return (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                setContent(record)
                                setOpen(true)
                            }}
                            style={{
                                backgroundColor: RenderStatusColor(record.status),
                                borderColor: RenderStatusColor(record.status)
                            }}
                        >查看</Button>
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: green,
                                borderColor: green,
                                marginLeft: 16,
                                marginRight: 16
                            }}
                            onClick={() => {
                                showResolveConfirm(content.uid);
                            }}
                        >通过</Button>
                        <Reject state={content} getNewContent={(isReject: boolean) => {
                            if (isReject) {
                                setOpen(false)
                                getDataSource()
                            }
                        }}/>
                    </div>
                );
            }
        },
    ];

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        setIsQuery(true)
        setWaitTime(10)
        // 防止多次点击
        if (isQuery) {
            return
        }
        setIsRenderResult(true)
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
            } else {
                message.warning(res.msg)
                setDataSource([])
            }
        }).finally(() => {
            setIsRenderResult(false)
        })
    }

    return isRenderResult ?
        <RecordSkeleton/> : (
            <div className={'record-body'}>
                <Drawer
                    title={content.releaseUid}
                    placement="right"
                    open={open}
                    onClose={() => {
                        setOpen(false)
                    }}
                    extra={<Button
                        type="primary"
                        disabled={isQuery}
                        onClick={() => {
                            refresh(content.uid);
                        }}
                    >{isQuery ? `刷新(${waitTime})` : '刷新'}</Button>}
                >
                    <p>请假时间：{content.start_time}</p>
                    <p>销假时间：{content.end_time}</p>
                    <p>请假原因：{content.reason}</p>
                    <p>提交时间：{content.create_time}</p>
                    <p>更新时间：{content.update_time}</p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'end',
                        marginTop: 16
                    }}>
                        <Reject state={content} getNewContent={(isReject: boolean) => {
                            if (isReject) {
                                setOpen(false)
                                getDataSource()
                            }
                        }}/>
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: green,
                                borderColor: green,
                                marginLeft: 16
                            }}
                            onClick={() => {
                                showResolveConfirm(content.uid);
                            }}
                        >通过</Button>
                    </div>
                </Drawer>
                <Title level={2} className={'tit'}>
                    请假审批&nbsp;&nbsp;
                    <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                            onClick={getDataSource}>{isQuery ? `刷新(${waitTime})` : '刷新'}</Button>
                </Title>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{x: 1000}}
                    sticky={true}
                    pagination={{
                        showSizeChanger: true,
                        total: dataSource.length,
                        showQuickJumper: true,
                        pageSizeOptions: [5, 10, 20, 50, 100, 200],
                        defaultPageSize: 5,
                        hideOnSinglePage: true
                    }}
                />
            </div>
        );
};

export default Index;
