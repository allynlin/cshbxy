import React, {useEffect, useState} from 'react';
import {App, Button, Card, Form, Input, Popconfirm, Result, Skeleton, Space, Spin, Steps, Tag, Typography} from 'antd';
import {
    checkTeacherChangeDepartmentRecord,
    deleteChangeDepartmentByTeacher,
    findChangeDepartmentByTeacherProcess,
    findUploadFilesByUid,
    refreshDepartmentChange,
} from "../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import {RenderStatus} from "../../component/Tag/RenderStatus";
import {FileTextOutlined, FolderOpenOutlined, SearchOutlined} from "@ant-design/icons";
import {DownLoadURL, tableName} from "../../baseInfo";
import {useStyles} from "../../styles/webStyle";
import {getProcessStatus} from "../../component/getProcessStatus";
import MoveModal from "../../component/MoveModal";
import NormalTable from "../../component/Table/NormalTable";
import type {DataType} from "../../component/Table";
import {LoadingIcon} from "../../component/Icon";
import {RenderStatusTag} from "../../component/Tag/RenderStatusTag";

const {Title, Paragraph} = Typography;

const MyApp: React.FC = () => {

        const classes = useStyles();

        const {message} = App.useApp();

        // 全局数据防抖
        const [isQuery, setIsQuery] = useState<boolean>(false);
        const [waitTime, setWaitTime] = useState<number>(0);
        const [loading, setLoading] = useState<boolean>(true);
        // 全局数据
        const [dataSource, setDataSource] = useState<any>([]);
        // 筛选后的数据
        const [showData, setShowData] = useState<any>([]);
        // 当前展示数据
        const [showInfo, setShowInfo] = useState<any>({});
        // 审批流程
        const [processList, setProcessList] = useState<any>([]);
        // 刷新当前审批项按钮防抖
        const [isRefresh, setIsRefresh] = useState<boolean>(false);
        const [isRefreshWaitTime, setIsRefreshWaitTime] = useState<number>(0);
        const [showContent, setShowContent] = useState<boolean>(true);
        // 详情弹窗
        const [showModal, setShowModal] = useState<boolean>(false);
        // 关联文件
        const [fileLoading, setFileLoading] = useState<boolean>(true);
        const [fileList, setFileList] = useState<any>([]);
        // 审批流程
        const [processLoading, setProcessLoading] = useState<boolean>(true);
        // 删除确认框
        const [open, setOpen] = useState(false);
        const [confirmLoading, setConfirmLoading] = useState(false);
        // 是否为空数据
        const [isEmpty, setIsEmpty] = useState<boolean>(false);

        const key = "refresh"
        const getFile = "getFile"

        useEffect(() => {
            const timer = setTimeout(() => {
                if (waitTime > 1) {
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
            const timer = setTimeout(() => {
                if (isRefreshWaitTime > 1) {
                    setIsRefresh(true)
                    setIsRefreshWaitTime(e => e - 1)
                } else {
                    setIsRefresh(false)
                }
            }, 1000)
            return () => {
                clearTimeout(timer)
            }
        }, [isRefreshWaitTime])

        const refresh = (uid: string) => {
            message.open({
                key,
                type: 'loading',
                content: "正在刷新中",
                duration: 0,
            })
            setIsRefresh(true)
            setIsRefreshWaitTime(5)
            setShowContent(true)
            refreshDepartmentChange(uid).then(res => {
                message.open({
                    key,
                    type: 'success',
                    content: res.msg
                })
                const data = {
                    ...res.body,
                    key: res.body.uid,
                    id: showInfo.id
                }
                const newData = dataSource.map((item: any) => {
                    if (item.uid === uid) {
                        return data
                    }
                    return item
                })
                const newShowData = showData.map((item: any) => {
                    if (item.uid === uid) {
                        return data
                    }
                    return item
                })
                setShowInfo(data)
                setDataSource(newData)
                setShowData(newShowData)
                setShowContent(false)
            }).catch(() => {
                message.destroy();
            })
        }

        const getProcess = (uid: string) => {
            setProcessLoading(true)
            findChangeDepartmentByTeacherProcess(uid).then((res: any) => {
                const newProcessList = res.body.map((item: any) => {
                    return {
                        title: item
                    }
                })
                setProcessList(newProcessList)
            }).finally(() => {
                setProcessLoading(false)
            })
        }

        const getFiles = (uid: string) => {
            message.open({
                key: getFile,
                type: 'loading',
                content: "正在获取文件列表",
                duration: 0,
            })
            setFileLoading(true)
            findFiles(uid)
        }

        const findFiles = (uid: string) => {
            findUploadFilesByUid(uid, tableName.departmentChange).then((res: any) => {
                setFileLoading(false)
                if (res.code !== 200) {
                    message.open({
                        key: getFile,
                        type: 'error',
                        content: res.msg,
                    })
                }
                setFileList(res.body);
                message.open({
                    key: getFile,
                    type: 'success',
                    content: res.msg,
                })
            }).catch(() => {
                message.destroy();
            })
        }

        useEffect(() => {
            getDataSource();
        }, [])

        // 获取所有数据
        const getDataSource = () => {
            setDataSource([]);
            setShowData([]);
            setLoading(true);
            setIsQuery(true)
            setWaitTime(10)
            checkTeacherChangeDepartmentRecord().then((res: any) => {
                if (res.code === 300) {
                    setIsEmpty(true)
                    setDataSource([])
                    setShowData([])
                    return
                }
                if (res.code !== 200) {
                    message.error(res.msg)
                    setIsEmpty(true)
                    return
                }
                const data = res.body.map((item: any, index: number) => {
                    return {
                        ...item,
                        id: index + 1,
                        key: item.uid,
                    }
                })
                setDataSource(data);
                setShowData(data);
            }).finally(() => {
                setLoading(false)
            })
        }

        const onFinish = (values: any) => {
            // 如果什么内容都没有输入，那就把所有数据展示出来
            if (!values.search) {
                setShowData(dataSource);
                return
            }
            // 如果有输入内容，那将 dataSource 中的 destination 进行模糊匹配
            const newShowData = dataSource.filter((item: any) => {
                return item.departmentUid.indexOf(values.search) !== -1
            })
            setShowData(newShowData);
        };

        // 删除当前项
        const deleteItem = (uid: string) => {
            setConfirmLoading(true);
            setOpen(false)
            deleteChangeDepartmentByTeacher(uid, tableName.departmentChange).then((res: any) => {
                if (res.code !== 200) {
                    message.error(res.msg)
                    return
                }
                message.success(res.msg);
                const newDataSource = dataSource.filter((item: any) => item.uid !== uid);
                if (newDataSource.length === 0) {
                    setIsEmpty(true)
                    setDataSource([])
                    setShowData([])
                    return
                }
                setDataSource(newDataSource);
                const newShowData = showData.filter((item: any) => item.uid !== uid);
                setShowData(newShowData);
            }).finally(() => {
                setConfirmLoading(false);
                setShowModal(false);
            })
        }

        const columns: ColumnsType<DataType> = [{
            title: 'id',
            dataIndex: 'id',
            align: 'center',
        }, {
            title: "部门变更",
            dataIndex: 'departmentUid',
            align: 'center',
        }, {
            title: "状态",
            dataIndex: 'status',
            align: 'center',
            render: (text: any, item: any) => {
                return RenderStatus(item)
            }
        }, {
            title: "操作",
            dataIndex: 'operation',
            align: 'center',
            render: (text: any, item: any) => {
                return (
                    <Button
                        type="primary"
                        onClick={() => {
                            setShowInfo(item);
                            getProcess(item.uid);
                            getFiles(item.uid)
                            setShowModal(true);
                            setShowContent(false);
                        }}>
                        查看
                    </Button>
                )
            }
        }];

        const RenderGetDataSourceButton = () => {
            return (
                <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                        onClick={getDataSource}>{isQuery ? `刷新(${waitTime})` : "刷新"}</Button>
            )
        }

        return (
            <Spin tip={RenderGetDataSourceButton()} delay={1000} indicator={<LoadingIcon/>} size="large" spinning={loading}>
                <div className={classes.contentBody}>
                    <MoveModal
                        title="详情"
                        showModal={showModal}
                        getModalStatus={(e) => {
                            setShowModal(e)
                        }}
                        footer={[
                            showInfo.status === 0 ?
                                <Popconfirm
                                    title="确认删除"
                                    open={open}
                                    onConfirm={() => deleteItem(showInfo.uid)}
                                    onCancel={() => setOpen(false)}
                                >
                                    <Button loading={confirmLoading} type="primary" danger key="delete"
                                            onClick={() => setOpen(true)}>
                                        删除
                                    </Button>
                                </Popconfirm> : null,
                            <Button
                                key="refresh"
                                type="primary"
                                loading={isRefresh}
                                onClick={() => {
                                    getProcess(showInfo.uid)
                                    getFiles(showInfo.uid)
                                    refresh(showInfo.uid)
                                }}
                                disabled={isRefresh}>
                                {isRefresh ? `刷新当前申请项(${isRefreshWaitTime})` : "刷新当前申请项"}
                            </Button>,
                            <Button
                                key="link"
                                loading={loading}
                                onClick={() => setShowModal(false)}
                            >
                                关闭
                            </Button>,
                        ]}
                    >
                        {showContent ? (<Skeleton active/>) : (
                            <Typography>
                                <Paragraph>状态：{RenderStatusTag(showInfo)}</Paragraph>
                                <Paragraph>部门变更：{showInfo.departmentUid}</Paragraph>
                                <Paragraph>原因：{showInfo.changeReason}</Paragraph>
                                {showInfo.reject_reason ?
                                    <Paragraph>
                                        驳回原因：
                                        <Tag color="error">{showInfo.reject_reason}</Tag>
                                    </Paragraph> : null}
                                <Paragraph>提交时间：{showInfo.create_time}</Paragraph>
                                <Paragraph>更新时间：{showInfo.update_time}</Paragraph>
                                <Paragraph>文件：</Paragraph>
                                {
                                    fileLoading ? (
                                            <div className={classes.skeletonFile}>
                                                <Skeleton.Node active>
                                                    <FileTextOutlined className={classes.skeletonFiles}/>
                                                </Skeleton.Node>
                                            </div>
                                        ) :
                                        // 如果 fileList 不为空则渲染
                                        fileList.length > 0 ? (
                                            <>
                                                <div className={classes.showFile}>
                                                    {fileList.map((item: any, index: number) => {
                                                        return (
                                                            <Card size="small" className={classes.fileItem} hoverable
                                                                  key={index}
                                                                  title={"文件" + (index + 1)}
                                                                  bordered={false}>
                                                                <Typography.Paragraph ellipsis>
                                                                    <a href={`${DownLoadURL}/downloadFile?filename=${item.fileName}`}
                                                                       target="_self">{item.oldFileName}</a>
                                                                </Typography.Paragraph>
                                                            </Card>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        ) : null
                                }
                                <Paragraph>审批流程：</Paragraph>
                                {
                                    processLoading ? (
                                            <Space style={{flexDirection: 'column', marginTop: 16}}>
                                                <Skeleton.Input active={true} block={false}/>
                                                <Skeleton.Input active={true} block={false}/>
                                                <Skeleton.Input active={true} block={false}/>
                                                <Skeleton.Input active={true} block={false}/>
                                            </Space>) :
                                        <div style={{marginTop: 16}}>
                                            <Steps
                                                direction="vertical"
                                                progressDot
                                                current={showInfo.count}
                                                status={getProcessStatus(showInfo.status)}
                                                size="small"
                                                items={processList}
                                            />
                                        </div>
                                }
                            </Typography>
                        )}
                    </MoveModal>
                    <div className={classes.contentHead}>
                        <Title level={2} className={classes.tit}>
                            部门变更记录&nbsp;&nbsp;
                            <RenderGetDataSourceButton/>
                        </Title>
                        <Form name="search" layout="inline" onFinish={onFinish}>
                            <Form.Item name="search">
                                <Input prefix={<SearchOutlined className="site-form-item-icon"/>}
                                       placeholder="目的地"/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">搜索</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    {
                        isEmpty ? (
                            <Result
                                icon={<FolderOpenOutlined/>}
                                title="暂无数据"
                                extra={<RenderGetDataSourceButton/>}
                            />
                        ) : (
                            <NormalTable columns={columns} dataSource={showData}/>
                        )
                    }
                </div>
            </Spin>
        )
    }
;

const DepartmentChange = () => {
    return (
        <App>
            <MyApp/>
        </App>
    )
}

export default DepartmentChange;
