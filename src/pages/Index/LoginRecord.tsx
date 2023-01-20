import React, {useEffect, useState} from "react";
import {App, Button, Result, Spin, Table, Typography} from 'antd';
import {useSelector} from "react-redux";
import {findLoginRecord} from "../../component/axios/api";
import intl from "react-intl-universal";
import VirtualTable from "../../component/VirtualTable";
import {ColumnsType} from "antd/es/table";
import {useNavigate} from "react-router-dom";
import {useStyles} from "../../styles/webStyle";
import {LoadingOutlined, SearchOutlined} from "@ant-design/icons";

const {Title} = Typography;

interface DataType {
    key: React.Key;
    dataIndex: string;
    align: 'left' | 'right' | 'center';
}

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;


const MyApp = () => {

    const classes = useStyles();

    const navigate = useNavigate();

    const {message} = App.useApp();

    // 全局数据防抖
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    // 全局数据
    const [dataSource, setDataSource] = useState<any>([]);

    const userInfo = useSelector((state: any) => state.userInfo.value)
    const tableSize = useSelector((state: any) => state.tableSize.value)
    const isLogin = useSelector((state: any) => state.isLogin.value)
    const userTable = useSelector((state: any) => state.userTable.value)

    const key = "getLoginRecord";

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

    const getType = (type: string) => {
        switch (type) {
            case '1':
                return intl.get('login')
            case '2':
                return intl.get('autoLogin')
            default:
                return intl.get('unknown')
        }
    }

    useEffect(() => {
        getDataSource()
    }, [])

    const getDataSource = () => {
        if (!isLogin)
            return
        setDataSource([]);
        setIsQuery(true)
        setLoading(true)
        setWaitTime(10)
        message.open({
            key,
            type: "loading",
            content: intl.get('getLoginRecording'),
            duration: 0,
        })
        findLoginRecord(userInfo.uid).then(res => {
            message.open({
                key,
                type: "success",
                content: intl.get('getLoginRecordingSuccess')
            })
            const newDataSoucre = res.body.map((item: any, index: number) => {
                return {
                    ...item,
                    id: index + 1,
                    key: index,
                    type: getType(item.type)
                }
            })
            setDataSource(newDataSoucre)
        }).finally(() => {
            setLoading(false)
        })
    }

    const columns: ColumnsType<DataType> = [{
        title: 'id',
        dataIndex: 'id',
        align: 'center',
    }, {
        title: intl.get('browser'),
        dataIndex: 'browser',
        align: 'center',
    }, {
        title: intl.get('ipAddress'),
        dataIndex: 'ipAddress',
        align: 'center',
    }, {
        title: intl.get('osName'),
        dataIndex: 'osName',
        align: 'center',
    }, {
        title: intl.get('loginTime'),
        dataIndex: 'create_time',
        align: 'center',
    }];

    const RenderGetDataSourceButton = () => {
        return (
            <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                    onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
        )
    }

    return (
        isLogin ?
            <Spin size="large" spinning={loading} tip={RenderGetDataSourceButton()} delay={1000} indicator={antIcon}>
                <div className={classes.contentHead}>
                    <Title level={2} className={classes.tit}>
                        {userInfo.realeName + ' ' + intl.get('loginRecord')}
                        &nbsp;&nbsp;
                        <RenderGetDataSourceButton/>
                        &nbsp;&nbsp;
                        <Button type="primary" onClick={() => navigate('/home')}>{intl.get('backToHome')}</Button>
                    </Title>
                </div>
                {
                    userTable.tableType === "virtual" ? (
                        <VirtualTable
                            columns={columns}
                            dataSource={dataSource}
                            scroll={{
                                y: tableSize.tableHeight,
                                x: tableSize.tableWidth
                            }}/>) : <Table
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{y: tableSize.tableHeight, x: tableSize.tableWidth}}
                        // @ts-ignore
                        pagination={
                            userTable.tableType === "normal" ? {
                                position: ["none"]
                            } : {
                                // 是否展示 pageSize 切换器
                                showSizeChanger: true,
                                // 默认的每页条数
                                defaultPageSize: userTable.defaultPageSize,
                                // 指定每页可以显示多少条
                                pageSizeOptions: ['10', '20', '30', '40', '50', '100', '200', '500', '1000'],
                            }
                        }
                    />
                }
            </Spin> : <Result
                status="warning"
                title={intl.get('loginRecordErrorTips')}
                extra={
                    <Button type="primary" key="console" onClick={() => navigate('/login')}>
                        {intl.get('login')}
                    </Button>
                }
            />
    )
}

const LoginRecord = () => {
    return (
        <App>
            <MyApp/>
        </App>
    )
}

export default LoginRecord;
