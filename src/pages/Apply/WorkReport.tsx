import {Button, Form, Modal, Result, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {checkLastTimeUploadFiles, checkLastWeekWorkReport, submitWorkReport} from "../../component/axios/api";
import './apply.scss';
import {DownLoadURL} from "../../baseInfo";
import FileUpLoad from "../../component/axios/FileUpLoad";
import {ExclamationCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import intl from "react-intl-universal";

const {Title} = Typography;
const tableName = `WorkReport`;

const ChangeForm = () => {
    const navigate = useNavigate();
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 文件上传列表
    const [fileList, setFileList] = useState<[]>([]);
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [RenderResultTitle, setRenderResultTitle] = useState<String>(intl.get('obtainLastTimeUploadWorkReport'));
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
                setRenderResultTitle(intl.get('obtainLastTimeUploadFiles'))
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
                        title: intl.get('workReport') + ' ' + intl.get('submitSuccess'),
                        describe: intl.get('waitApprove'),
                        toPage: intl.get('showApplyList'),
                        toURL: '/home/record/workReport',
                    }
                }
            })
        })
    }

    const showConfirm = () => {
        Modal.confirm({
            title: intl.get('confirm'),
            icon: <ExclamationCircleOutlined/>,
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
                    {isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}
                </Button>
            }
        />) : (
        <div className={'apply-body'}>
            <Title level={2} className={'tit'}>{intl.get('workReport')}</Title>
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
                    label={intl.get('workReport')}
                    name="file"
                    rules={[{required: true, message: intl.get('pleaseUploadWorkReport')}]}
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
                        {intl.get('submit')}
                    </Button>
                    <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>
                        {intl.get('reset')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const WorkReport = () => {
    return (
        <ChangeForm/>
    )
}

export default WorkReport;
