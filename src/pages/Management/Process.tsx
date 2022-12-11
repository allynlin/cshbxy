import {Button, List, Modal, Segmented, Skeleton, Tag, Transfer, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import intl from "react-intl-universal";
import {ExclamationCircleOutlined, SearchOutlined} from "@ant-design/icons";
import '../../App.scss';
import {findAllProcess, findProcessUser, updateProcess} from "../../component/axios/api";
import {yellow} from "../../baseInfo";

const {Title} = Typography;

interface RecordType {
    key: string;
    title: string;
    description: string;
    chosen: boolean;
}

const ProcessManagement = () => {
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [dataSource, setDataSource] = useState<any>([]);
    const [content, setContent] = useState<any>(null);
    const [open, setOpen] = useState(false);

    // 虚拟列表的宽度和高度
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        // 获取页面宽度
        const width = document.body.clientWidth;
        // 获取页面高度
        const height = document.body.clientHeight;
        // 虚拟列表的宽度计算：页面宽度 - 左侧导航栏宽度（200）- 右侧边距（20） - 表格左右边距（20）
        const tableWidth = width - 200 - 40;
        // 虚拟列表高度计算：液面高度 - 页面顶部（10%，最小50px） - 页面底部（5%，最小20px） - 表格上下边距（20）
        const bottomHeight = height * 0.05 >= 20 ? height * 0.05 : 20;
        const topHeight = height * 0.1 >= 50 ? height * 0.1 : 50;
        const tableHeight = height - bottomHeight - topHeight - 100;
        setWidth(tableWidth);
        setHeight(tableHeight);
    }, [])

    useEffect(() => {
        getProcessPerson();
    }, [content])

    const getProcessPerson = () => {
        findProcessUser().then(res => {
            const data = res.body.map((item: any, index: number) => {
                return {
                    key: item.uid,
                    title: item.realeName,
                    description: item.realeName,
                    chosen: false
                }
            })
            data.push({
                key: 'nowDepartment',
                title: 'nowDepartment',
                description: 'nowDepartment',
                chosen: false
            })
            setMockData(data)
        })
    }

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
        getDataSource();
    }, [])

    // 获取所有数据
    const getDataSource = () => {
        setLoading(true);
        setIsQuery(true)
        setWaitTime(10)
        findAllProcess().then(res => {
            const data = res.body.map((item: any, index: number) => {
                return {
                    ...item,
                    key: item.uid,
                    name: item.name,
                    process: item.process,
                    chosen: false
                }
            })
            setDataSource(data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const RenderSteps = (process: string) => {

        // 将 process 按照 || 分割成数组
        const processArray: string[] = process.split('||');

        return (
            <Segmented options={processArray}/>
        )
    }

    const [mockData, setMockData] = useState<RecordType[]>([]);
    const [targetKeys, setTargetKeys] = useState<string[]>([]);

    const filterOption = (inputValue: string, option: RecordType) =>
        option.description.indexOf(inputValue) > -1;

    const handleChange = (newTargetKeys: string[]) => {
        setTargetKeys(newTargetKeys);
    };

    return (
        <div className={'record-body'}>
            <div className="record-head">
                <Title level={2} className={'tit'}>
                    {intl.get('processManagement')}&nbsp;&nbsp;
                    <Button type="primary" disabled={isQuery} icon={<SearchOutlined/>}
                            onClick={getDataSource}>{isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}</Button>
                </Title>
            </div>
            <Modal
                open={open}
                title={intl.get("changeProcess")}
                okText={intl.get('ok')}
                cancelText={intl.get('cancel')}
                onCancel={() => setOpen(false)}
                onOk={() => {
                    console.log(targetKeys)
                    // 将 targetKeys 拼接成字符串,以 || 分割
                    const process = targetKeys.join('||');
                    Modal.confirm({
                        title: intl.get('confirmChangeProcess'),
                        icon: <ExclamationCircleOutlined/>,
                        content: intl.get('confirmChangeProcessNotice'),
                        onOk() {
                            updateProcess(content.uid, process).then(res => {
                                Modal.success({
                                    title: intl.get('success'),
                                    content: intl.get('changeProcessSuccess')
                                })
                                getDataSource();
                                setOpen(false);
                            })
                        }
                    });
                }}
            >
                <Transfer
                    dataSource={mockData}
                    showSearch
                    filterOption={filterOption}
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    render={item => item.title}
                />
            </Modal>
            <div style={{width: width, height: height}}>
                {loading ? <Skeleton active paragraph={{rows: 10}}/> : <List
                    itemLayout="horizontal"
                    dataSource={dataSource}
                    renderItem={(item: any) => (
                        <List.Item
                            actions={[
                                <Button
                                    key={'changeProcess'}
                                    type={'primary'}
                                    style={{
                                        backgroundColor: yellow,
                                        borderColor: yellow
                                    }}
                                    onClick={() => {
                                        setContent(item)
                                        setOpen(true)
                                        const processArray: string[] = item.process.split('||');
                                        const targetKeys: string[] = [];
                                        processArray.forEach((item: string) => {
                                            // 在 mockData 中找到对应的 key
                                            const key = mockData.find((mockItem: any) => mockItem.key === item)?.key;
                                            if (key) {
                                                targetKeys.push(key)
                                            }
                                        })
                                        setTargetKeys(targetKeys)
                                    }}>{intl.get('changeProcess')}</Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={<Tag>{item.name}&nbsp;{intl.get('approveProcess')}</Tag>}
                                description={RenderSteps(item.processRealName)}
                            />
                        </List.Item>
                    )}
                />}
            </div>
        </div>
    )
};

export default ProcessManagement;
