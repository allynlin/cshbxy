import {Button, Form, Input, Modal, Result, Select, Skeleton, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    findUserType,
    checkLastTimeUploadFiles,
    checkTeacherChangeDepartment,
    ChangeDepartment
} from "../../../component/axios/api";
import '../apply.scss';
import {DownLoadURL} from "../../../baseInfo";
import FileUpLoad from "../../../component/axios/FileUpLoad";
import {LoadingOutlined} from "@ant-design/icons";
import intl from "react-intl-universal";

const {Title} = Typography;
const tableName = `ChangeDepartment`;

const ChangeForm = () => {
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
    const [RenderResultTitle, setRenderResultTitle] = useState<String>(intl.get('Application-lastTime-submit', {name: intl.get('DepartmentChange')}));
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

    // 查询是否有正在审批的部门变更申请
    const checkDepartmentChange = () => {
        setIsQuery(true)
        setWaitTime(10)
        // 防止多次点击
        if (isQuery) {
            return
        }
        checkTeacherChangeDepartment().then(res => {
            if (res.code === 200) {
                setRenderResultTitle(intl.get('Get-lastTime-file'))
                checkUploadFilesList();
                setIsQuery(false)
                setWaitTime(0)
            } else {
                setIsRenderInfo(true)
                setRenderResultTitle(intl.get('Application-lastTime-submit', {name: intl.get('DepartmentChange')}))
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
        })
    }

    // 表单提交
    const submitForm = () => {
        ChangeDepartment(departmentUid, changeReason).then(() => {
            setConfirmLoading(false);
            navigate('/home/success', {
                state: {
                    object: {
                        title: intl.get('Apply-submit-success', {name: intl.get('DepartmentChange')}),
                        describe: intl.get('Wait-desc'),
                        toPage: intl.get('Show-application-record'),
                        toURL: '/home/record/departmentChange',
                    }
                }
            })
        }).catch(() => {
            setConfirmLoading(false);
        })
    }

    // 获取部门列表
    const getDepartmentOptions = () => {
        findUserType().then(res => {
            const departmentOptions = res.body.map((item: { uid: String; realeName: String; }) => {
                return {
                    value: item.uid,
                    label: item.realeName
                }
            })
            setDepartmentOptions(departmentOptions);
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
                    {isQuery ? intl.get('Refresh') + '(' + waitTime + ')' : intl.get('Refresh')}
                </Button>
            }
        />) : (
        <div className={'apply-body'}>
            <Modal
                title={intl.get('Confirm')}
                open={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>{intl.get('DepartmentChange') + ': '}{departmentUid}</p>
                <p>{intl.get('Reason') + ': '}{changeReason}</p>
                {/*将变更材料 changeFile 中的 fileList 数组中的状态为 done 的每一项 name 输出出来*/}
                <p>{intl.get('File') + ': '}{
                    fileList.filter((item: any) => item.status === 'done').map((item: any) => item.name).join('、')
                }</p>
            </Modal>
            <Title level={2} className={'tit'}>{intl.get('DepartmentChange') + intl.get('apply')}</Title>
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
                    label={intl.get('DepartmentChange')}
                    name="departmentUid"
                    rules={[{
                        required: true,
                        message: intl.get('select-required-message', {name: intl.get('DepartmentChange')})
                    }]}
                >
                    <Select
                        showSearch
                        placeholder={intl.get('select-enter-placeholder', {name: intl.get('DepartmentChange')})}
                        optionFilterProp="children"
                        onFocus={getDepartmentOptions}
                        options={departmentOptions}
                    />
                </Form.Item>

                <Form.Item
                    label={intl.get('Reason')}
                    name="changeReason"
                    rules={[{
                        required: true,
                        message: intl.get('input-required-message', {name: intl.get('Reason')})
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
                    label={intl.get('File')}
                    name="file"
                    rules={[{required: true, message: intl.get('file-required-message', {name: intl.get('File')})}]}
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
                        {intl.get('Submit')}
                    </Button>
                    <Button htmlType="button" onClick={onReset} style={{marginLeft: 8}}>
                        {intl.get('Reset')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

const Index = () => (
    <ChangeForm/>
)


export default Index;
