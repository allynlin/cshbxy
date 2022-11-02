import {Button, Drawer, message, Modal, Steps, Table, Typography} from 'antd';
import {ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {deleteLeave, findLeaveList, findLeaveProcess} from '../../../component/axios/api';
import '../index.scss';
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTag";
import {blue, green, red, yellow} from "../../../baseInfo";
import {UpdateLeave} from "./UpdateLeave";
import {ColumnsType} from "antd/es/table";
import {RenderStatusColor} from "../../../component/Tag/RenderStatusColor";
import {DataType} from "tdesign-react";
import RecordSkeleton from "../../../component/Skeleton/RecordSkeleton";

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

    // 渲染抽屉
    const RenderDrawer = () => {
        return (
            <Drawer
                title={<span style={{color: '#ffffff'}}>{content.create_time}</span>}
                placement="right"
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                headerStyle={{
                    backgroundColor: content.status === 0 ? yellow : content.status === 1 ? green : content.status === 2 ? red : blue,
                }}
            >
                <p>请假时间：{content.start_time}</p>
                <p>销假时间：{content.end_time}</p>
                <p>请假原因：{content.reason}</p>
                {content.reject_reason ?
                    <p style={{
                        backgroundColor: red,
                        color: '#ffffff'
                    }}>驳回原因：{content.reject_reason}</p> : null}
                <p>审批状态：{RenderStatusTag(content.status, '请假申请')}</p>
                <p>更新时间：{content.update_time}</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'end',
                    marginTop: 16,
                }}>
                    <UpdateLeave state={content} getNewContent={(newContent: object) => {
                        // 对比旧 content 查看是否有变化，有变化则重新查询
                        if (JSON.stringify(newContent) !== JSON.stringify(content)) {
                            getDataSource()
                            // 将新的内容更新到content中
                            setContent({...content, ...newContent})
                        }
                    }}/>
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: red,
                            borderColor: red
                        }}
                        onClick={() => {
                            showDeleteConfirm(content.uid);
                        }}
                    >删除</Button>
                </div>
                <div style={{marginTop: 16}}>
                    审批流程：
                    <Steps
                        style={{
                            marginTop: 16
                        }}
                        direction="vertical"
                        size="small"
                        current={content.count}
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
            </Drawer>
        )
    }

    // 获取当前记录上传的文件和当前审批流程
    const getInfo = (uid: string) => {
        const hide = message.loading('正在获取审批流程', 0);
        findLeaveProcess(uid).then((res: any) => {
            setProcessList(res.body);
            hide();
            setOpen(true);
        }).catch(() => {
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
                deleteLeave(e).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            setIsRenderResult(true);
                            message.warning('暂无请假记录');
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
        findLeaveList().then(res => {
            if (res.code === 200) {
                const newDataSource = res.body.map((item: any, index: number) => {
                    return {
                        id: index + 1,
                        key: item.uid,
                        create_time: item.create_time,
                        start_time: item.start_time,
                        end_time: item.end_time,
                        status: item.status,
                        count: item.count,
                        update_time: item.update_time,
                        reason: item.reason,
                        uid: item.uid
                    }
                });
                setDataSource(newDataSource);
                setIsQuery(false)
                setWaitTime(0)
                setIsRenderResult(false);
            } else {
                message.warning(res.msg);
            }
        }).catch(err => {
            message.error(err.message);
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
        },
        {
            title: '请假时间',
            dataIndex: 'start_time',
            key: 'start_time',
            width: 150,
            align: 'center',
        },
        {
            title: '销假时间',
            dataIndex: 'end_time',
            key: 'end_time',
            width: 150,
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (text: number, record: any) => {
                return (
                    RenderStatusTag(text, "请假申请")
                )
            }
        },
        {
            title: '提交时间',
            dataIndex: 'create_time',
            key: 'create_time',
            width: 150,
            align: 'center',
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            key: 'update_time',
            width: 150,
            align: 'center',
        },
        {
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
                            setOpen(false)
                            setContent(record)
                            getInfo(record.uid)
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
                <RenderDrawer/>
                <Title level={2} className={'tit'}>
                    请假记录&nbsp;&nbsp;
                    <Button type="primary" icon={<SearchOutlined/>} onClick={getDataSource}>刷新</Button>
                </Title>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    scroll={{x: 1500}}
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
