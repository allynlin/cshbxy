import {
    Table,
    Typography,
    Button,
    Drawer,
    Modal,
    Tag,
    message,
    Card,
    Steps
} from 'antd';
import {
    ExclamationCircleOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import React, {useEffect, useState} from 'react';
import {
    checkTeacherChangeDepartmentRecord,
    findUploadFilesByUid,
    findChangeDepartmentByTeacherProcess,
    deleteChangeDepartmentByTeacher
} from '../../../component/axios/api';
import '../index.scss';
import {DownLoadURL} from "../../../baseInfo";

const {Title} = Typography;
const {Step} = Steps;

const tableName = `changedepartmentbyteacher`;
const red = '#f32401';
const green = '#006c01';
const yellow = '#ff8d00';

interface DataType {
    key: React.Key;
    name: string;
    age: number;
    address: string;
}

const Index: React.FC = () => {
    const [dataSource, setDataSource] = useState([]);
    const [content, setContent] = useState<any>({});
    const [fileList, setFileList] = useState<any>([]);
    const [processList, setProcessList] = useState<any>([]);
    const [open, setOpen] = useState(false);

    // 渲染抽屉
    const RenderDrawer = () => {
        return (
            <Drawer
                title={<span style={{color: '#ffffff'}}>{content.status}</span>}
                placement="right"
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                headerStyle={{
                    backgroundColor: content.status === '审批中' ? yellow : content.status === '审批通过' ? green : red
                }}
            >
                <p style={{
                    textAlign: 'center',
                    color: red,
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>暂不支持修改<br/>如需修改请重新提交</p>
                <p>变更部门：{content.departmentUid}</p>
                <p>变更原因：{content.changeReason}</p>
                <p>变更状态：{content.status}</p>
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
                    // 循环输出 Card，数据来源 fileList
                    fileList.map((item: any, index: number) => {
                        return (
                            <Card
                                key={index}
                                title={`附件${index + 1}`}
                                style={{width: "auto", marginTop: 16}}
                                extra={<a href={`${DownLoadURL}/downloadFile?filename=${item.fileName}`}
                                          target="_self">下载</a>}
                            >
                                <p>{item.oldFileName}</p>
                            </Card>
                        )
                    })
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
            mask: false,
            onOk() {
                deleteChangeDepartmentByTeacher(e).then((res: any) => {
                    if (res.code === 200) {
                        message.success('删除成功');
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
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
        },
        {
            title: '变更部门',
            dataIndex: 'departmentUid',
            key: 'departmentUid',
            width: 150,
            align: 'center',
        },
        {
            title: '变更原因',
            dataIndex: 'changeReason',
            key: 'changeReason',
            width: 150,
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (text: string, record: any) => {
                return (
                    <Tag
                        icon={record.status === '审批中' ? <SyncOutlined spin/> : record.status === '审批通过' ?
                            <CheckCircleOutlined/> : <CloseCircleOutlined/>}
                        color={text === '审批中' ? yellow : text === '审批通过' ? green : red}
                        onClick={() => {
                            switch (text) {
                                case '审批中':
                                    message.warning('您的申请正在审批中，请耐心等待');
                                    break;
                                case '审批通过':
                                    message.success('您的申请已通过');
                                    break;
                                case '审批未通过':
                                    message.error('您的申请未通过');
                                    break;
                            }
                        }}
                    >
                        {text}
                    </Tag>
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
                            setContent(record)
                            getInfo(text)
                        }}
                        style={
                            record.status === '审批通过' ? {
                                backgroundColor: green,
                                borderColor: green
                            } : record.status === '审批中' ? {
                                backgroundColor: yellow,
                                borderColor: yellow
                            } : {
                                backgroundColor: red,
                                borderColor: red
                            }
                        }
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
        checkTeacherChangeDepartmentRecord().then((res: any) => {
            if (res.code === 200) {
                const arr = res.body.map((item: any, index: number) => {
                    return {
                        key: item.uid,
                        id: index + 1,
                        departmentUid: item.departmentUid,
                        changeReason: item.changeReason,
                        status: parseInt(item.status) === 0 ? '审批中' : parseInt(item.status) === 1 ? '审批通过' : '审批未通过',
                        nextUid: item.nextUid,
                        count: parseInt(item.count),
                        create_time: item.create_time,
                        update_time: item.update_time,
                        uid: item.uid,
                    }
                })
                setDataSource(arr)
            } else {
                message.warning(res.msg)
            }
        })
    }

    return (
        <div className={'body'}>
            <RenderDrawer/>
            <Title level={2} className={'tit'}>部门变更申请记录</Title>
            <Table
                columns={columns}
                dataSource={dataSource}
                scroll={{x: 1500}}
                sticky
            />
        </div>
    );
};

export default Index;