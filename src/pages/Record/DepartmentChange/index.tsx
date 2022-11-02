import {Button, Collapse, Drawer, message, Modal, Steps, Table, Typography} from 'antd';
import {ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {
    checkTeacherChangeDepartmentRecord,
    deleteChangeDepartmentByTeacher,
    findChangeDepartmentByTeacherProcess,
    findUploadFilesByUid
} from '../../../component/axios/api';
import {DownLoadURL, red} from "../../../baseInfo";
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTag";
import {RenderStatusColor} from "../../../component/Tag/RenderStatusColor";
import '../index.scss'
import RecordSkeleton from "../../../component/Skeleton/RecordSkeleton";

const {Title} = Typography;
const {Step} = Steps;
const {Panel} = Collapse;

const tableName = `changedepartmentbyteacher`;

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
                title={<span>{RenderStatusTag(content.status)}</span>}
                placement="right"
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                headerStyle={{
                    backgroundColor: RenderStatusColor(content.status)
                }}
            >
                <p style={{
                    textAlign: 'center',
                    color: red,
                    fontSize: 16,
                    fontWeight: 'bold'
                }}>如需修改请重新提交</p>
                <p>变更部门：{content.departmentUid}</p>
                <p>变更原因：{content.changeReason}</p>
                <p>变更状态：{RenderStatusTag(content.status, '部门变更申请')}</p>
                <p>提交时间：{content.create_time}</p>
                <p>更新时间：{content.update_time}</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'end',
                    marginTop: 16
                }}>
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
                {
                    // 如果 fileList 不为空则渲染
                    fileList.length > 0 ? (
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
                    ) : null
                }
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
    const getInfo = async (uid: string) => {
        const hide = message.loading('正在获取文件列表和审批流程', 0);
        // 超时自动关闭
        setTimeout(hide, 10000);
        const list: boolean = await findChangeDepartmentByTeacherProcess(uid).then((res: any) => {
            setProcessList(res.body);
            return true;
        })
        const file: boolean = await findUploadFilesByUid(uid, tableName).then((res: any) => {
            setFileList(res.body);
            return true;
        })
        if (list && file) {
            hide();
            setOpen(true)
        }
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
                        key: item.uid,
                        id: index + 1,
                        departmentUid: item.departmentUid,
                        changeReason: item.changeReason,
                        status: parseInt(item.status),
                        nextUid: item.nextUid,
                        count: parseInt(item.count),
                        create_time: item.create_time,
                        update_time: item.update_time,
                        uid: item.uid,
                    }
                })
                setDataSource(arr)
                setIsQuery(false)
                setWaitTime(0)
                setIsRenderResult(false)
            } else {
                message.warning(res.msg)
            }
        }).catch(err => {
            message.error(err.message)
        })
    }

    return isRenderResult ?
        <RecordSkeleton/> : (
            <div className={'record-body'}>
                <RenderDrawer/>
                <Title level={2} className={'tit'}>
                    部门变更申请记录&nbsp;&nbsp;
                    <Button type="primary" icon={<SearchOutlined/>} onClick={getDataSource}>刷新</Button>
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
