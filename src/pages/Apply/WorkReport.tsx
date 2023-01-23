import React, {useEffect, useState} from 'react';
import {App, Button, Form, Modal, Result, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';
import intl from "react-intl-universal";

import {checkLastTimeUploadFiles, checkLastWeekWorkReport, submitWorkReport} from "../../component/axios/api";
import {DownLoadURL, tableName} from "../../baseInfo";
import FileUpLoad from "../../component/axios/FileUpLoad";
import {ExclamationCircleOutlined, LoadingOutlined} from "@ant-design/icons";
import {useStyles} from "../../styles/webStyle";
import logo from "../../images/logo.png";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";
import {useSelector} from "react-redux";

const {Title} = Typography;

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

const ChangeForm = () => {

    const classes = useStyles();
    const gaussianBlurClasses = useGaussianBlurStyles();

    const {message} = App.useApp();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value);

    const navigate = useNavigate();
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 文件上传列表
    const [fileList, setFileList] = useState<[]>([]);
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [RenderResultTitle, setRenderResultTitle] = useState<String>(intl.get('obtainLastTimeUploadWorkReport'));
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
        checkLastWeekWorkReport().then(res => {
            if (res.code !== 200) {
                setRenderResultTitle(res.msg)
            }
            setRenderResultTitle(intl.get('obtainLastTimeUploadFiles'))
            checkUploadFilesList();
        })
    }


    // 查询上次上传的文件列表
    const checkUploadFilesList = () => {
        checkLastTimeUploadFiles(tableName.workReport).then(res => {
            setIsRenderResult(false)
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
        })
    }

    // 表单提交
    const submitForm = () => {
        submitWorkReport(tableName.workReport).then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: intl.get('workReport') + ' ' + intl.get('submitSuccess'),
                        describe: intl.get('waitApprove'),
                        toPage: intl.get('showApplyList'),
                        toURL: '/workReport-webRecord',
                    }
                }
            })
        })
    }

    const showConfirm = () => {
        Modal.confirm({
            title: intl.get('confirm'),
            icon: <ExclamationCircleOutlined/>,
            className: gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : '',
            mask: !gaussianBlur,
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
            icon={<img src={logo} alt="logo" className={classes.webWaitingImg}/>}
            title={RenderResultTitle}
            extra={
                <Button disabled={isQuery} type="primary" onClick={() => {
                    checkUploadFilesList()
                }}>
                    {isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}
                </Button>
            }
        />) : (
        <div className={classes.cshbxy100Per}>
            <Title level={2}>{intl.get('workReport')}</Title>
            <Form
                form={form}
                name="basic"
                layout="vertical"
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
                        setTableName={tableName.workReport}
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

                <Form.Item>
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
        <App>
            <ChangeForm/>
        </App>
    )
}

export default WorkReport;
