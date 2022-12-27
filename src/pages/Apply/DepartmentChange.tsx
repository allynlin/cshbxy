import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Form, Input, Modal, Result, Select, Typography, App} from 'antd';
import {LoadingOutlined} from "@ant-design/icons";
import intl from "react-intl-universal";

import {
    ChangeDepartment,
    checkLastTimeUploadFiles,
    checkTeacherChangeDepartment,
    findUserType
} from "../../component/axios/api";
import {DownLoadURL, tableName} from "../../baseInfo";
import FileUpLoad from "../../component/axios/FileUpLoad";
import {useStyles} from "../../styles/webStyle";


const {Title, Paragraph} = Typography;

const ChangeForm = () => {

    const classes = useStyles();

    const {message} = App.useApp();

    const navigate = useNavigate();
    // 防止反复查询变更记录
    const [isQuery, setIsQuery] = useState<boolean>(false);
    const [waitTime, setWaitTime] = useState<number>(0);
    // 文件上传列表
    const [fileList, setFileList] = useState<[]>([]);
    // 确认框状态
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    // 展示表单还是提示信息,两种状态，分别是 info 或者 loading
    const [isRenderResult, setIsRenderResult] = useState<boolean>(true);
    const [RenderResultTitle, setRenderResultTitle] = useState<String>(intl.get('obtainLastTimeApplyRecord'));
    const [isRenderInfo, setIsRenderInfo] = useState<boolean>(false);
    // 部门列表
    const [departmentOptions, setDepartmentOptions] = useState([]);
    // 监听表单数据
    const [form] = Form.useForm();
    const departmentUid = Form.useWatch('departmentUid', form);
    const changeReason = Form.useWatch('changeReason', form);

    useEffect(() => {
        checkDepartmentChange();
    }, [])

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

    // 查询是否有正在审批的部门变更申请
    const checkDepartmentChange = () => {
        setIsQuery(true)
        setWaitTime(10)
        checkTeacherChangeDepartment().then(res => {
            if (res.code !== 200) {
                setIsRenderInfo(true)
                setRenderResultTitle(intl.get('pleaseWaitApprove'))
                return
            }
            setRenderResultTitle(intl.get('obtainLastTimeUploadFiles'))
            checkUploadFilesList();
        })
    }

    // 查询上次上传的文件列表
    const checkUploadFilesList = () => {
        checkLastTimeUploadFiles(tableName.departmentChange).then(res => {
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
        }).catch(() => {
            checkUploadFilesList()
        })
    }

    // 表单提交
    const submitForm = () => {
        ChangeDepartment(departmentUid, changeReason).then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            navigate('/success', {
                state: {
                    object: {
                        title: intl.get('departmentChangeApply') + ' ' + intl.get('submitSuccess'),
                        describe: intl.get('waitApprove'),
                        toPage: intl.get('showApplyList'),
                        toURL: '/departmentChange-record',
                    }
                }
            })
        }).finally(() => {
            setConfirmLoading(false);
        })
    }

    // 获取部门列表
    const getDepartmentOptions = () => {
        findUserType().then(res => {
            if (res.code !== 200) {
                message.error(res.msg)
                return
            }
            const departmentOptions = res.body.map((item: { uid: String; realeName: String; }) => {
                return {
                    value: item.uid,
                    label: item.realeName
                }
            })
            setDepartmentOptions(departmentOptions);
        }).catch(() => {
            getDepartmentOptions();
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
                    checkDepartmentChange()
                }}>
                    {isQuery ? `${intl.get('refresh')}(${waitTime})` : intl.get('refresh')}
                </Button>
            }
        />) : (
        <div className={classes.cshbxy100Per}>
            <Modal
                title={intl.get('Confirm')}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Typography>
                    <Paragraph>{intl.get('departmentChange') + ': '}{departmentUid}</Paragraph>
                    <Paragraph>{intl.get('reason') + ': '}{changeReason}</Paragraph>
                    <Paragraph>{intl.get('file') + ': '}{
                        fileList.filter((item: any) => item.status === 'done').map((item: any) => item.name).join('、')
                    }</Paragraph>
                </Typography>
            </Modal>
            <Title level={2} className={classes.flexCenter}>{intl.get('departmentChangeApply')}</Title>
            <Form
                form={form}
                name="basic"
                labelCol={{span: 6}}
                wrapperCol={{span: 12}}
                onFinish={onFinish}
                initialValues={{
                    file: fileList
                }}
            >
                <Form.Item
                    label={intl.get('department')}
                    name="departmentUid"
                    rules={[{
                        required: true,
                        message: intl.get('pleaseChooseDepartment')
                    }]}
                >
                    <Select
                        showSearch
                        placeholder={intl.get('pleaseChooseDepartment')}
                        optionFilterProp="children"
                        onFocus={getDepartmentOptions}
                        options={departmentOptions}
                    />
                </Form.Item>

                <Form.Item
                    label={intl.get('reason')}
                    name="changeReason"
                    rules={[{
                        required: true,
                        message: intl.get('pleaseInputReason')
                    }]}
                >
                    <Input.TextArea rows={4}
                                    placeholder={intl.get('textarea-enter-placeholder', {
                                        name: intl.get('Reason'),
                                        max: 1000
                                    })}
                                    showCount={true}
                                    maxLength={1000}/>
                </Form.Item>

                <Form.Item
                    label={intl.get('file')}
                    name="file"
                    rules={[{required: true, message: intl.get('pleaseChooseFiles')}]}
                >
                    <FileUpLoad
                        setTableName={tableName.departmentChange}
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

                <Form.Item wrapperCol={{offset: 6, span: 12}} style={{textAlign: "center"}}>
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

const DepartmentChange = () => (
    <App>
        <ChangeForm/>
    </App>
)


export default DepartmentChange;
