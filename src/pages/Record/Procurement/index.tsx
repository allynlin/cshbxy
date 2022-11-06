import {Button, Drawer, message, Modal, Skeleton, Space, Steps, Table, Tag, Typography} from 'antd';
import {ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {
    deleteProcurement,
    findProcurementList,
    findProcurementProcess,
    refreshProcurement
} from '../../../component/axios/api';
import '../index.scss';
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTag";
import {blue, green, purple, red, yellow} from "../../../baseInfo";
import {ColumnsType} from "antd/es/table";
import {RenderStatusColor} from "../../../component/Tag/RenderStatusColor";
import {DataType} from "tdesign-react";
import RecordSkeleton from "../../../component/Skeleton/RecordSkeleton";
import Update from "./Update";

const {Title} = Typography;
const {Step} = Steps;

const Index: React.FC = () => {
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 展示表单还是提示信息,两种状态，分别是 info 或者 loading
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [dataSource, setDataSource] = useState([]);
    const [content, setContent] = useState<any>({});
    const [processList, setProcessList] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [openUid, setOpenUid] = useState<string>('');

    const [processLoading, setProcessLoading] = useState<boolean>(true);

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
        refreshProcurement(uid).then(res => {
            let newContent = {
                key: content.key,
                id: content.id,
                ...res.body
            }
            setContent(newContent)
        })
    }

    // 获取当前记录上传的文件和当前审批流程
    const getInfo = (uid: string) => {
        setOpen(true);
        getProcess(uid);
    }

    const getProcess = (uid: string) => {
        setProcessLoading(true)
        const hide = message.loading('正在获取采购流程', 0);
        findProcurementProcess(uid).then((res: any) => {
            setProcessList(res.body);
        }).finally(() => {
            setProcessLoading(false)
            hide();
        })
    }


    // 删除确认框
    const showDeleteConfirm = (e: string) => {
        Modal.confirm({
            title: '要删除这条记录吗？',
            icon: <ExclamationCircleOutlined/>,
            content: '删除后不可恢复，如果您确定删除请点击确认',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteProcurement(e).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            setIsRenderResult(true);
                            message.warning('暂无采购记录');
                        }
                    } else {
                        message.error(res.msg);
                    }
                })
            }
        });
    };

    useEffect(() => {
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        setIsRenderResult(true);
        setIsQuery(true)
        setWaitTime(10)
        // 防止多次点击
        if (isQuery) {
            return
        }
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
            } else {
                message.warning(res.msg);
                setDataSource([])
            }
        }).finally(() => {
            setIsRenderResult(false);
        })
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'id',
            width: 100,
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            align: 'center',
        }, {
            title: '物品',
            dataIndex: 'items',
            key: 'items',
            width: 150,
            align: 'center',
        }, {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            align: 'center',
            render: (text: string) => {
                return text + '￥'
            }
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (text: number) => {
                return (
                    RenderStatusTag(text, "请假申请")
                )
            }
        }, {
            title: '操作',
            key: 'uid',
            dataIndex: 'uid',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (text: any, record: any) => {
                return (
                    <Button
                        type="primary"
                        onClick={() => {
                            setContent(record)
                            getInfo(text)
                            setOpenUid(text)
                        }}
                        style={{
                            backgroundColor: RenderStatusColor(record.status),
                            borderColor: RenderStatusColor(record.status)
                        }}
                    >查看</Button>
                );
            }
        },
    ];

    return isRenderResult ?
        <RecordSkeleton/> : (
            <div className={'record-body'}>
                <Drawer
                    title={<span>{RenderStatusTag(content.status)}</span>}
                    placement="right"
                    open={open}
                    onClose={() => {
                        setOpen(false)
                    }}
                    extra={content.status === 0 ?
                        <div style={{
                            display: 'flex'
                        }}>
                            <Update state={content} getNewContent={(newContent: object) => {
                                // 对比旧 content 查看是否有变化，有变化则重新查询
                                if (JSON.stringify(newContent) !== JSON.stringify(content)) {
                                    refresh(content.uid)
                                }
                            }}/>
                            <Button
                                type="primary"
                                style={{
                                    backgroundColor: red,
                                    borderColor: red,
                                    marginLeft: 10
                                }}
                                onClick={() => {
                                    showDeleteConfirm(content.uid);
                                }}
                            >删除</Button>
                        </div> : <Button
                            type="primary"
                            loading={processLoading}
                            onClick={() => refresh(openUid)}
                            disabled={isQuery}>
                            {isQuery ? `刷新(${waitTime})` : '刷新'}
                        </Button>}
                >
                    <p>物品：{content.items}</p>
                    <p>价格：{content.price} ￥</p>
                    <p>原因：{content.reason}</p>
                    {content.reject_reason ?
                        <>
                            驳回原因：
                            <Tag color={red}
                                 style={{marginBottom: 16}}>{content.reject_reason}</Tag>
                        </> : null}
                    <p>提交时间：{content.create_time}</p>
                    <p>更新时间：{content.update_time}</p>
                    {
                        processLoading ? (
                                <Space style={{flexDirection: 'column'}}>
                                    <Skeleton.Input active={true} block={false}/>
                                    <Skeleton.Input active={true} block={false}/>
                                    <Skeleton.Input active={true} block={false}/>
                                    <Skeleton.Input active={true} block={false}/>
                                </Space>) :
                            <div style={{marginTop: 16}}>
                                {content.status === 0 ? <Button
                                    type="primary"
                                    loading={processLoading}
                                    onClick={() => {
                                        getProcess(openUid)
                                        refresh(openUid)
                                    }}
                                    disabled={isQuery}>
                                    {isQuery ? `刷新流程(${waitTime})` : '刷新流程'}
                                </Button> : null}
                                <div style={{marginTop: 16}}>审批流程：</div>
                                <Steps
                                    style={{
                                        marginTop: 16
                                    }}
                                    direction="vertical"
                                    size="small"
                                    current={content.count}
                                    status={content.status === 0 ? 'process' : content.status === 1 ? 'finish' : 'error'}
                                >
                                    {
                                        processList.map((item: string, index: number) => {
                                            return (
                                                <Step
                                                    key={index}
                                                    title={item}
                                                />
                                            )
                                        })
                                    }
                                </Steps>
                            </div>
                    }
                </Drawer>
                <Title level={2} className={'tit'}>
                    采购记录&nbsp;&nbsp;
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
                >
                </Table>
            </div>
        );
};

export default Index;
