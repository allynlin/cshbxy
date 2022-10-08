import {
    Timeline,
    Typography,
    Button,
    Drawer,
    Modal,
    Tag,
    message,
    Steps,
    Result
} from 'antd';
import {ExclamationCircleOutlined, LoadingOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {
    findLeaveProcess,
    deleteLeave,
    findLeaveList
} from '../../../component/axios/api';
import '../index.scss';
import {RenderStatusTag} from "../../../component/Tag/RenderStatusTag";
import {red, blue, green, yellow} from "../../../baseInfo";
import {UpdateLeave} from "./UpdateLeave";

const {Title} = Typography;
const {Step} = Steps;

const Index: React.FC = () => {
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 展示表单还是提示信息,两种状态，分别是 info 或者 loading
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [RenderResultTitle, setRenderResultTitle] = useState<String>('正在获取请假记录');
    const [isRenderInfo, setIsRenderInfo] = useState<boolean>(false);
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
                mask={false}
                headerStyle={{
                    backgroundColor: content.status === 0 ? yellow : content.status === 1 ? green : content.status === 2 ? red : blue,
                }}
                bodyStyle={{
                    backdropFilter: 'blur(20px) saturate(180%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)'
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
                <p>审批状态：{RenderStatusTag(content.status)}</p>
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
                    &nbsp;&nbsp;&nbsp;&nbsp;
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
            style: {
                backdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(255,255,255,0.6)'
            },
            mask: false,
            onOk() {
                deleteLeave(e).then((res: any) => {
                    if (res.code === 200) {
                        message.success(res.msg);
                        setOpen(false);
                        const arr = dataSource.filter((item: any) => item.uid !== e);
                        setDataSource(arr);
                        if (arr.length === 0) {
                            setIsRenderResult(true);
                            setIsRenderInfo(true);
                            setRenderResultTitle('暂无请假记录');
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
        findLeaveList().then(res => {
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
                                key={item.uid}
                                color={item.status === 0 ? yellow : item.status === 1 ? green : item.status === 2 ? red : blue}>
                                <p>{item.create_time}</p>
                                <Button
                                    type={"primary"}
                                    onClick={() => {
                                        setOpen(false)
                                        setContent(item)
                                        getInfo(item.uid)
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
            <Title level={2} className={'tit'}>请假记录</Title>
            <RenderTimeLine/>
        </div>
    );
};

export default Index;