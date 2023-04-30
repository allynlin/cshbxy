import React, {useEffect, useState} from 'react';
import {App, Button, Form, Input, Result, Skeleton, Spin, Typography} from 'antd';
import {findUserByDepartment} from "../../../component/axios/api";
import {ColumnsType} from "antd/es/table";
import {FolderOpenOutlined, SearchOutlined} from "@ant-design/icons";
import {RenderUserStatusTag} from "../../../component/Tag/RenderUserStatusTag";
import ChangeUserName from "./ChangeUserName";
import ChangeUserInfo from "./ChangeUserInfo";
import ChangePassword from "./ChangePassword";
import ChangeUserStatus from "./ChangeUserStatus";
import {useSelector} from "react-redux";
import {useStyles} from "../../../styles/webStyle";
import {RenderUserTypeTag} from "../../../component/Tag/RenderUserTypeTag";
import ChangeDirectLeadership from "./ChangeDirectLeadership";
import MoveModal from '../../../component/MoveModal';
import NormalTable from "../../../component/Table/NormalTable";
import type {DataType} from "../../../component/Table";
import {LoadingIcon} from "../../../component/Icon";

const {Title, Paragraph} = Typography;

const MyApp = () => {

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
    const [showContent, setShowContent] = useState<boolean>(true);
    // 详情弹窗
    const [showModal, setShowModal] = useState<boolean>(false);
    // 是否为空数据
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const userInfo = useSelector((state: any) => state.userInfo.value);

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

    const RenderUserStatus = (status: number) => {
        switch (status) {
            case 0:
                return RenderUserStatusTag("正常")
            case -1:
                return RenderUserStatusTag("禁用")
            default:
                return RenderUserStatusTag("未知")
        }
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
        findUserByDepartment(userInfo.uid).then(res => {
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
                    key: item.uid
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
        // 如果有输入内容，那将 dataSource 中的 reason 进行模糊匹配
        const newShowData = dataSource.filter((item: any) => {
            return item.username.indexOf(values.search) !== -1
        })
        setShowData(newShowData);
    };

    const columns: ColumnsType<DataType> = [{
        title: 'id',
        dataIndex: 'id',
        align: 'center',
    }, {
        title: "用户名",
        dataIndex: 'username',
        align: 'center',
    }, {
        title: "真实姓名",
        dataIndex: 'realeName',
        align: 'center',
    }, {
        title: "状态",
        dataIndex: 'status',
        align: 'center',
        render: (text: any, item: any) => {
            return RenderUserStatus(item.status)
        }
    }, {
        title: "用户类型",
        dataIndex: 'userType',
        align: 'center',
        render: (text: any, item: any) => {
            return RenderUserTypeTag(item)
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
                        setShowModal(true);
                        setShowContent(false);
                    }}>
                    管理
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
                    title="用户信息"
                    showModal={showModal}
                    getModalStatus={(e) => setShowModal(e)}
                    onCancel={() => setShowModal(false)}
                    footer={[
                        <Button
                            key="link"
                            loading={loading}
                            onClick={() => setShowModal(false)}
                        >
                            关闭
                        </Button>,
                    ]}
                >
                    {showContent ? (<Skeleton paragraph={{rows: 18}} active/>) : (
                        <Typography>
                            <Title level={3}>基本信息</Title>
                            <Paragraph>UID：{showInfo.uid}</Paragraph>
                            {showInfo.departmentUid ? (
                                <Paragraph>管理员：{showInfo.departmentUid}</Paragraph>) : null}
                            <Paragraph>用户名：{showInfo.username}</Paragraph>
                            <Paragraph>真实姓名：{showInfo.realeName}</Paragraph>
                            <Paragraph>性别：{showInfo.gender}</Paragraph>
                            <Paragraph>电子邮件地址：{showInfo.email}</Paragraph>
                            <Paragraph>联系电话：{showInfo.tel}</Paragraph>
                            <Paragraph>提交时间：{showInfo.create_time}</Paragraph>
                            <Paragraph>更新时间：{showInfo.update_time}</Paragraph>
                            <Paragraph>状态：{RenderUserStatus(showInfo.status)}</Paragraph>
                            <Paragraph>用户类型：{RenderUserTypeTag(showInfo)}</Paragraph>
                            <Title level={3}>用户操作</Title>
                            <Paragraph>{<ChangePassword uid={showInfo.uid}/>}</Paragraph>
                            <Paragraph>
                                {<ChangeUserName info={showInfo} getChange={(newUsername: string) => {
                                    const newData = {
                                        ...showInfo,
                                        username: newUsername
                                    }
                                    // 修改 showInfo 中的 username
                                    setShowInfo(newData)
                                    // 修改 dataSource 中的 username
                                    const newDataSource = dataSource.map((item: any) => {
                                        if (item.uid === showInfo.uid) {
                                            return newData
                                        }
                                        return item
                                    })
                                    setDataSource(newDataSource)
                                    // 修改 showData 中的 username
                                    const newShowData = showData.map((item: any) => {
                                        if (item.uid === showInfo.uid) {
                                            return newData
                                        }
                                        return item
                                    })
                                    setShowData(newShowData)
                                }}/>}
                            </Paragraph>
                            <Paragraph>
                                {<ChangeUserInfo info={showInfo} getChange={(newContent: any) => {
                                    const newData = {
                                        ...showInfo,
                                        ...newContent
                                    }
                                    setShowInfo(newData)
                                    const newDateSource = dataSource.map((item: any) => {
                                        if (item.uid === showInfo.uid) {
                                            return newData
                                        }
                                        return item
                                    })
                                    setDataSource(newDateSource)
                                    const newShowData = showData.map((item: any) => {
                                        if (item.uid === showInfo.uid) {
                                            return newData
                                        }
                                        return item
                                    })
                                    setShowData(newShowData)
                                }}/>}
                            </Paragraph>
                            <Paragraph>
                                {<ChangeUserStatus info={showInfo} getChange={(newStatus: number) => {
                                    const newData = {
                                        ...showInfo,
                                        status: newStatus,
                                    }
                                    setShowInfo(newData)
                                    const newDateSource = dataSource.map((item: any) => {
                                        if (item.uid === showInfo.uid) {
                                            return newData
                                        }
                                        return item
                                    })
                                    setDataSource(newDateSource)
                                    const newShowData = showData.map((item: any) => {
                                        if (item.uid === showInfo.uid) {
                                            return newData
                                        }
                                        return item
                                    })
                                    setShowData(newShowData)
                                }}/>}
                            </Paragraph>
                            {showInfo.userType === "Leader" ? <Paragraph>
                                {<ChangeDirectLeadership content={showInfo} getChange={(newContent: string) => {
                                    if (newContent === 'yes') {
                                        getDataSource()
                                        setShowModal(false)
                                    }
                                }}/>}
                            </Paragraph> : null}
                        </Typography>
                    )}
                </MoveModal>
                <div className={classes.contentHead}>
                    <Title level={2} className={classes.tit}>
                        用户管理&nbsp;&nbsp;
                        <RenderGetDataSourceButton/>
                    </Title>
                    <Form name="search" layout="inline" onFinish={onFinish}>
                        <Form.Item name="search">
                            <Input prefix={<SearchOutlined className="site-form-item-icon"/>}
                                   placeholder="搜索用户名"/>
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
                        <NormalTable
                            columns={columns}
                            dataSource={showData}
                        />
                    )
                }
            </div>
        </Spin>
    )
};

const DepartmentUser = () => {
    return (
        <App>
            <MyApp/>
        </App>
    )
}

export default DepartmentUser;
