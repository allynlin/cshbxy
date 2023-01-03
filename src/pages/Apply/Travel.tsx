import React, {useEffect, useState} from 'react';
import {App, Button, Form, Input, InputNumber, Modal, Select, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';
import intl from "react-intl-universal";
import BraftEditor from "braft-editor";

import {addTravelReimbursement, checkLastTimeUploadFiles} from "../../component/axios/api";
import {BaseInfo, controls, tableName} from "../../baseInfo";
import Spin from "../../component/LoadingSkleton";
import FileUpLoad from "../../component/axios/FileUpLoad";
import {useStyles} from "../../styles/webStyle";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";
import {useSelector} from "react-redux";

const {Title, Paragraph} = Typography;
const {Option} = Select;

const URL = `${BaseInfo}/api`;

const LeaveForm = () => {

    const classes = useStyles();
    const gaussianBlurClasses = useGaussianBlurStyles();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)

    const {message} = App.useApp();

    const navigate = useNavigate();

    // 费用类型
    const [moneyType, setMoneyType] = useState<String>('CNY');
    // 文件上传列表
    const [fileList, setFileList] = useState<any>([]);
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 展示表单前查询上次提交的文件
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    // 监听表单数据
    const [form] = Form.useForm();
    const destination = Form.useWatch('destination', form);
    const expenses = Form.useWatch('expenses', form);
    const reason = Form.useWatch('reason', form);

    useEffect(() => {
        checkUploadFilesList();
    }, [])

    // 查询上次上传的文件列表
    const checkUploadFilesList = () => {
        checkLastTimeUploadFiles(tableName.travel).then(res => {
            setIsRenderResult(false)
            // 遍历 res.body
            const fileList = res.body.map((item: any) => {
                return {
                    uid: item.fileName,
                    name: item.oldFileName,
                    status: 'done',
                    url: `${URL}/downloadFile?filename=${item.fileName}`,
                }
            })
            setFileList(fileList)
        })
    }

    // 表单提交
    const submitForm = () => {
        addTravelReimbursement(destination, (expenses + moneyType), reason.toHTML(), tableName.travel).then(res => {
            if (res.code !== 200) {
                message.error(res.msg);
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: intl.get('travelReimburseApply') + ' ' + intl.get('submitSuccess'),
                        describe: intl.get('waitApprove'),
                        toPage: intl.get('showApplyList'),
                        toURL: '/travel-record',
                    }
                }
            })
        }).finally(() => {
            setConfirmLoading(false);
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        submitForm();
    };

    const onFinish = () => {
        setIsModalVisible(true)
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        isRenderResult ? <Spin/> :
            <div className={classes.cshbxy100Per}>
                <Modal
                    title={intl.get('confirm')}
                    open={isModalVisible}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    className={gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : ''}
                    mask={!gaussianBlur}
                >
                    <Typography>
                        <Paragraph>{intl.get('destination')}：{destination}</Paragraph>
                        <Paragraph>{intl.get('cost')}：{expenses} {moneyType}</Paragraph>
                        <Paragraph>{intl.get('reason')}：</Paragraph>
                        <div className={classes.outPutHtml} dangerouslySetInnerHTML={{__html: reason?.toHTML()}}/>
                        <Paragraph>{intl.get('file') + ': '}{
                            fileList.filter((item: any) => item.status === 'done').map((item: any) => item.name).join('、')
                        }</Paragraph>
                    </Typography>
                </Modal>
                <Title level={2}>{intl.get('travelReimburseApply')}</Title>
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
                        label={intl.get('destination')}
                        name="destination"
                        rules={[{
                            required: true,
                            message: intl.get('pleaseInputDestination')
                        }]}
                    >
                        <Input showCount={true} maxLength={50}
                               placeholder={intl.get('pleaseInputDestination')}/>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('cost')}
                        name="expenses"
                        rules={[{required: true, message: intl.get('pleaseInputCost')}]}
                    >
                        <InputNumber
                            placeholder={intl.get('pleaseInputCost')}
                            addonAfter={
                                <Select defaultValue={moneyType} style={{width: 60}} onChange={e => {
                                    setMoneyType(e)
                                }}>
                                    <Option value="USD">$</Option>
                                    <Option value="EUR">€</Option>
                                    <Option value="GBP">£</Option>
                                    <Option value="CNY">¥</Option>
                                </Select>
                            }/>
                    </Form.Item>

                    <Form.Item
                        label={intl.get('reason')}
                        name="reason"
                        rules={[{required: true, message: intl.get('pleaseInputReason')}]}
                    >
                        <BraftEditor
                            // @ts-ignore
                            controls={controls}
                            placeholder={intl.get('pleaseInputReason')}
                        />
                    </Form.Item>

                    <Form.Item
                        label={intl.get('file')}
                        name="file"
                        rules={[{required: true, message: intl.get('pleaseChooseFiles')}]}
                    >
                        <FileUpLoad
                            setTableName={tableName.travel}
                            getList={(list: []) => {
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
    )
};

const Travel = () => {
    return (
        <App>
            <LeaveForm/>
        </App>
    )
}

export default Travel;
