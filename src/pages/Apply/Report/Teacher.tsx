import {Button, Form, Modal, Result, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {checkLastTimeUploadFiles, checkLastWeekWorkReport, submitWorkReport} from "../../../component/axios/api";
import '../apply.scss';
import {DownLoadURL} from "../../../baseInfo";
import FileUpLoad from "../../../component/axios/FileUpLoad";
import {ExclamationCircleOutlined, LoadingOutlined} from "@ant-design/icons";

const {Title} = Typography;
const tableName = `workreportteacher`;

const ChangeForm = () => {
    const navigate = useNavigate();
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 文件上传列表
    const [fileList, setFileList] = useState<[]>([]);
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [RenderResultTitle, setRenderResultTitle] = useState<String>('正在获取工作报告提交记录');
    const [isRenderInfo, setIsRenderInfo] = useState<boolean>(false);
    // 监听表单数据
    const [form] = Form.useForm();

    useEffect(() => {
        checkIsSubmitWorkReport();
    }, [])

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

    // 查询本周是否已经提交过工作报告
    const checkIsSubmitWorkReport = () => {
        setIsQuery(true)
        setWaitTime(10)
        // 防止多次点击
        if (isQuery) {
            return
        }
        checkLastWeekWorkReport().then(res => {
            if (res.code === 200) {
                setRenderResultTitle("正在获取上次上传的文件")
                checkUploadFilesList();
            } else {
                setRenderResultTitle(res.msg)
                setIsRenderInfo(true)
            }
        })
    }


    // 查询上次上传的文件列表
    const checkUploadFilesList = () => {
        checkLastTimeUploadFiles(tableName).then(res => {
            if (res.code === 200) {
                // 遍历 res.body
                const fileList = res.body.map((item: any) => {
                    return {
                        uid: item.fileName,
                        name: item.oldFileName,
                        status: 'done',
                        url: `${DownLoadURL}/downloadFile?filename=${item.fileName}`,
                    }
                })
                setFileList(fileList)
            }
            setIsQuery(false)
            setWaitTime(0)
            setIsRenderResult(false)
        }).catch(err => {
            setRenderResultTitle(err.message)
        })
    }

    // 表单提交
    const submitForm = () => {
        submitWorkReport(tableName).then(res => {
            navigate('/home/success', {
                state: {
                    object: {
                        title: '工作报告提交成功',
                        describe: '',
                        toPage: '查看历史工作报告',
                        toURL: '/home/teacher/record/report',
                    }
                }
            })
        })
    }

    const showConfirm = () => {
        Modal.confirm({
            title: '确认提交本周工作报告吗？',
            icon: <ExclamationCircleOutlined/>,
            mask: false,
            style: {
                backdropFilter: 'blur(20px) saturate(180%)',
                backgroundColor: 'rgba(255, 255, 255, 0.6)'
            },
            onOk() {
                submitForm();
            }
        });
    }

    const onFinish = () => {
        showConfirm();
    };

    const onReset = () => {
        form.resetFields();
    };

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
                    checkUploadFilesList()
                }}>
                    {isQuery ? `刷新(${waitTime})` : `刷新`}
                </Button>
            }
        />) : (
        <div className={'body'}>
            <Title level={2} className={'tit'}>工作报告</Title>
            <Form
                form={form}
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={onFinish}
                initialValues={{
                    file: fileList
                }}
            >

                <Form.Item
                    label="工作报告"
                    name="file"
                    rules={[{required: true, message: '请上传工作报告'}]}
                >
                    <FileUpLoad
                        setTableName={tableName}
                        getList={(list: []) => {
                            // 如果 list 为空，说明用户删除了所有的文件，此时需要将 fileList 也置为空
                            if (list.length === 0) {
                                setFileList([])
                                form.setFieldsValue({file: []})
                                return
                            }
                            setFileList(list)
                            form.setFieldsValue({
                                file: list
                            })
                        }}
                        setList={fileList}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}} style={{textAlign: "center"}}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>
                        重置
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const Teacher = () => {
    return (
        <ChangeForm/>
    )
}

export default Teacher;
