import {
    Timeline,
    Typography,
    Button,
    Drawer,
    Modal,
    message,
    Steps, Result, Collapse
} from 'antd';
import {
    ExclamationCircleOutlined, LoadingOutlined,
} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {
    deleteWorkReport,
    findUploadFilesByUid,
    findWorkReportByTeacherProcess,
    findWorkReportList
} from '../../../component/axios/api';
import '../index.scss';
import {DownLoadURL} from "../../../baseInfo";
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTag";
import {red, green, yellow} from "../../../baseInfo";

const {Title} = Typography;
const {Step} = Steps;
const {Panel} = Collapse;

const tableName = `workreportteacher`;

const Index: React.FC = () => {
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 展示表单还是提示信息,两种状态，分别是 info 或者 loading
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [RenderResultTitle, setRenderResultTitle] = useState<String>('正在获取工作报告提交记录');
    const [isRenderInfo, setIsRenderInfo] = useState<boolean>(false);
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
                title={<span style={{color: '#ffffff'}}>{content.create_time}</span>}
                placement="right"
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                mask={false}
                headerStyle={{
                    backgroundColor: content.status === 0 ? yellow : content.status === 1 ? green : red
                }}
                bodyStyle={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)'
                }}
            >
                <p style={{
                    textAlign: 'center',
                    color: red,
                    fontSize: 16,
                    fontWeight: 'bold'
                }}>如需修改请重新提交</p>
                <p>审批状态：{RenderStatusTag(content.status, '工作报告')}</p>
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
        const list: boolean = await findWorkReportByTeacherProcess(uid).then((res: any) => {
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
            style: {
                backdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(255,255,255,0.6)'
            },
            mask: false,
            onOk() {
                deleteWorkReport(e, tableName).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            setIsRenderResult(true);
                            setIsRenderInfo(true);
                            setRenderResultTitle('暂无工作报告提交记录');
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
        setIsQuery(true)
        setWaitTime(10)
        // 防止多次点击
        if (isQuery) {
            return
        }
        findWorkReportList().then(res => {
            if (res.code === 200) {
                setDataSource(res.body);
                setIsQuery(false)
                setWaitTime(0)
                setIsRenderResult(false);
            } else {
                setRenderResultTitle(res.msg);
                setIsRenderInfo(true);
            }
        }).catch(err => {
            setIsRenderInfo(true)
            setRenderResultTitle(err.message)
            setIsRenderResult(true)
        })
    }

    const RenderTimeLine = () => {
        return (
            <Timeline mode="alternate">
                {
                    // 循环输出 TimeLine，数据来源 dataSource
                    dataSource.map((item: any) => {
                        return (
                            <Timeline.Item
                                color={item.status === 0 ? yellow : item.status === 1 ? green : red}>
                                <p>{item.create_time}</p>
                                <Button
                                    type={"primary"}
                                    onClick={() => {
                                        setContent(item)
                                        getInfo(item.uid);
                                    }}
                                >查看</Button>
                                &nbsp;&nbsp;
                                <Button
                                    style={{
                                        backgroundColor: red,
                                        borderColor: red,
                                        color: "white"
                                    }}
                                    onClick={() => {
                                        showDeleteConfirm(item.uid)
                                    }}
                                >删除</Button>
                            </Timeline.Item>
                        )
                    })
                }
            </Timeline>
        )
    }

    return isRenderResult ? (
        <Result
            status="info"
            icon={
                isRenderInfo ? '' : <LoadingOutlined
                    style={{
                        fontSize: 40,
                    }}
                    spin
                />
            }
            title={RenderResultTitle}
            extra={
                <Button disabled={isQuery} type="primary" onClick={() => {
                    getDataSource()
                }}>
                    {isQuery ? `刷新(${waitTime})` : `刷新`}
                </Button>
            }
        />) : (<div className={'record-body'}>
            <RenderDrawer/>
            <Title level={2} className={'tit'}>工作报告提交记录</Title>
            <RenderTimeLine/>
        </div>
    );
};

export default Index;