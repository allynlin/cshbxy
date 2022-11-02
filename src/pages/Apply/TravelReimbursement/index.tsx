import {Button, Form, Input, InputNumber, Modal, Select, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {addTravelReimbursement, checkLastTimeUploadFiles} from "../../../component/axios/api";
import '../apply.scss';
import {BaseInfo} from "../../../baseInfo";
import Spin from "../../../component/loading/Spin";
import FileUpLoad from "../../../component/axios/FileUpLoad";
import {useSelector} from "react-redux";

const {Title} = Typography;
const {Option} = Select;

const tableName = `travelreimbursement`;

const URL = `${BaseInfo}/api`;

const LeaveForm = () => {

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
    const [isUpFile, setIsUpFile] = useState<boolean>(false);
    // 监听表单数据
    const [form] = Form.useForm();
    const destination = Form.useWatch('destination', form);
    const expenses = Form.useWatch('expenses', form);
    const reason = Form.useWatch('reason', form);

    const [isEnglish, setIsEnglish] = useState(true);

    const userLanguage: String = useSelector((state: {
        userLanguage: {
            value: 'Chinese' | 'English'
        }
    }) => state.userLanguage.value)

    useEffect(() => {
        setIsEnglish(userLanguage === 'English')
    }, [userLanguage])

    useEffect(() => {
        checkUploadFilesList();
    }, [])

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
                        url: `${URL}/downloadFile?filename=${item.fileName}`,
                    }
                })
                setFileList(fileList)
            }
            setIsRenderResult(false)
        })
    }

    // 表单提交
    const submitForm = () => {
        addTravelReimbursement(destination, (expenses + moneyType), reason, tableName).then(res => {
            setConfirmLoading(false);
            navigate('/home/success', {
                state: {
                    object: {
                        title: isEnglish ? 'Your application has been submitted successfully' : '差旅报销申请提交成功',
                        describe: isEnglish ? 'please wait for the approval result' : '请等待管理员审批',
                        toPage: isEnglish ? 'See the application record' : '查看审批记录',
                        toURL: '/home/record/travelReimbursement',
                    }
                }
            })
        })
    }

    const RenderModal: React.FC = () => {
        return (
            <Modal
                title={isEnglish ? 'Confirm' : "确认提交"}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>{isEnglish ? 'Destination: ' : '出差目的地：'}{destination}</p>
                <p>{isEnglish ? 'Money: ' : '出差费用：'}{expenses} {moneyType}</p>
                <p>{isEnglish ? 'Money: ' : '出差原因：'}{reason}</p>
                {/*将变更材料 changeFile 中的 fileList 数组中的状态为 done 的每一项 name 输出出来*/}
                <p>{isEnglish ? 'Files: ' : '变更材料：'}{
                    fileList.filter((item: any) => item.status === 'done').map((item: any) => item.name).join('、')
                }</p>
            </Modal>
        )
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        submitForm();
    };

    const onFinish = (values: any) => {
        setIsModalVisible(true)
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        isRenderResult ? <Spin/> :
            <div className={'apply-body'}>
                <RenderModal/>
                <Title level={2} className={'tit'}>{isEnglish ? 'Travel Reimbursement' : '差旅报销申请'}</Title>
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
                        label={isEnglish ? 'Destination' : "出差目的地"}
                        name="destination"
                        rules={[{
                            required: true,
                            message: isEnglish ? 'Please enter your destination' : '请输入你的出差目的地'
                        }]}
                    >
                        <Input showCount={true} maxLength={50}
                               placeholder={isEnglish ? 'Please enter your destination' : '请输入你的出差目的地'}/>
                    </Form.Item>

                    <Form.Item
                        label={isEnglish ? 'Money' : "出差费用"}
                        name="expenses"
                        rules={[{required: true, message: isEnglish ? 'Please enter your money' : '请输入出差费用'}]}
                    >
                        <InputNumber
                            placeholder={isEnglish ? 'Please choose your destination money type' : '请选择你的出差货币'}
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
                        label={isEnglish ? 'Reason' : "出差原因"}
                        name="reason"
                        rules={[{required: true, message: isEnglish ? 'Please enter your reason' : '请输入出差原因'}]}
                    >
                        <Input.TextArea rows={4}
                                        placeholder={isEnglish ? 'Please enter your reason, If it exceeds 1000 words, please submit the attachment.' : "请输入出差原因，如超出1000字请提交附件"}
                                        showCount={true}
                                        maxLength={1000}/>
                    </Form.Item>

                    <Form.Item
                        label={isEnglish ? 'Files' : "附件材料"}
                        name="file"
                        rules={[{required: true, message: isEnglish ? 'Please upload your files' : '请上传附件材料'}]}
                    >
                        <FileUpLoad
                            setTableName={tableName}
                            getList={(list: []) => {
                                setFileList(list)
                                form.setFieldsValue({
                                    file: list
                                })
                            }}
                            setList={fileList}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 8, span: 16}} style={{textAlign: "center"}}>
                        <Button type="primary" htmlType="submit" onClick={() => {
                            setIsUpFile(true)
                        }}>
                            {isEnglish ? 'Submit' : '提交'}
                        </Button>
                        <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>
                            {isEnglish ? 'Reset' : '重置'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
    )
};

const Index = () => {
    return (
        <LeaveForm/>
    )
}

export default Index;
