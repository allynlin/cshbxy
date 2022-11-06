import {Button, Collapse, Drawer, message, Modal, Skeleton, Space, Steps, Table, Tag, Typography} from 'antd';
import {ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {
    refreshDepartmentChange,
    checkTeacherChangeDepartmentRecord,
    deleteChangeDepartmentByTeacher,
    findChangeDepartmentByTeacherProcess,
    findUploadFilesByUid
} from '../../../component/axios/api';
import {DownLoadURL, purple, red} from "../../../baseInfo";
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTag";
import {RenderStatusColor} from "../../../component/Tag/RenderStatusColor";
import '../index.scss'
import RecordSkeleton from "../../../component/Skeleton/RecordSkeleton";

const {Title} = Typography;
const {Step} = Steps;
const {Panel} = Collapse;

const tableName = `ChangeDepartment`;

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
    const [fileList, setFileList] = useState<any>([]);
    const [processList, setProcessList] = useState<any>([]);
    const [open, setOpen] = useState(false);

    const [fileLoading, setFileLoading] = useState<boolean>(true);
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

    // 获取当前记录上传的文件和当前审批流程
    const getInfo = (uid: string) => {
        setOpen(true)
        getProcess(uid)
        getFiles(uid)
    }

    const getProcess = (uid: string) => {
        setProcessLoading(true)
        const hide = message.loading('正在获取审批流程', 0);
        findChangeDepartmentByTeacherProcess(uid).then((res: any) => {
            setProcessList(res.body);
        }).finally(() => {
            setProcessLoading(false)
            hide();
        })
    }

    const refresh = (uid: string) => {
        setIsQuery(true)
        setWaitTime(10)
        if (isQuery) {
            return
        }
        refreshDepartmentChange(uid).then(res => {
            let newContent = {
                key: content.key,
                id: content.id,
                ...res.body
            }
            setContent(newContent)
        })
    }

    const getFiles = (uid: string) => {
        setFileLoading(true)
        const hide = message.loading('正在获取文件列表', 0);
        findUploadFilesByUid(uid, tableName).then((res: any) => {
            setFileList(res.body);
        }).finally(() => {
            setFileLoading(false)
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
                deleteChangeDepartmentByTeacher(e, tableName).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            setIsRenderResult(true);
                            message.warning('暂无部门变更记录');
                        }
                    } else {
                        message.error('删除失败');
                    }
                })
            }
        });
    };

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
            title: '变更部门',
            dataIndex: 'departmentUid',
            key: 'departmentUid',
            width: 150,
            align: 'center',
        }, {
            title: '变更原因',
            dataIndex: 'changeReason',
            key: 'changeReason',
            width: 150,
            align: 'center',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (text: number, record: any) => {
                return (
                    RenderStatusTag(text, "部门变更申请")
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
        checkTeacherChangeDepartmentRecord().then((res: any) => {
            if (res.code === 200) {
                const arr = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        key: item.uid,
                        id: index + 1
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
                    title={<span>{RenderStatusTag(content.status)}</span>}
                    placement="right"
                    open={open}
                    onClose={() => {
                        setOpen(false)
                    }}
                    extra={content.status === 0 ?
                        <>
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
                        </> : <Button
                            type="primary"
                            loading={processLoading}
                            onClick={() => refresh(content.uid)}
                            disabled={isQuery}>
                            {isQuery ? `刷新(${waitTime})` : '刷新'}
                        </Button>}
                >
                    <p>变更部门：{content.departmentUid}</p>
                    <p>变更原因：{content.changeReason}</p>
                    {content.reject_reason ?
                        <>
                            驳回原因：
                            <Tag color={red}
                                 style={{marginBottom: 16}}>{content.reject_reason}</Tag>
                        </> : null}
                    <p>提交时间：{content.create_time}</p>
                    <p>更新时间：{content.update_time}</p>
                    {
                        fileLoading ? <Skeleton.Button block={true} active={true} size={'large'}/> :
                            // 如果 fileList 不为空则渲染
                            fileList.length > 0 ? (
                                <>
                                    {content.status === 0 ? <Button
                                        type="primary"
                                        loading={fileLoading}
                                        onClick={() => getFiles(content.uid)}
                                        disabled={isQuery}>
                                        {isQuery ? `刷新文件列表(${waitTime})` : '刷新文件列表'}
                                    </Button> : null}
                                    <Collapse ghost>
                                        {/*循环输出 Card，数据来源 fileList*/}
                                        {fileList.map((item: any, index: number) => {
                                            return (
                                                <Panel header={`附件${index + 1}`} key={index}>
                                                    <p>{item.oldFileName}</p>
                                                    <a href={`${DownLoadURL}/downloadFile?filename=${item.fileName}`}
                                                       target="_self">下载</a>
                                                </Panel>
                                            )
                                        })}
                                    </Collapse>
                                </>
                            ) : null
                    }
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
                                    disabled={isQuery}
                                    onClick={() => {
                                        getProcess(content.uid)
                                        refresh(content.uid)
                                    }}>
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
                    部门变更申请记录&nbsp;&nbsp;
                    <Button type="primary" icon={<SearchOutlined/>} disabled={isQuery}
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
                        defaultPageSize: 5
                    }}
                />
            </div>
        );
};

export default Index;
