import {Button, DatePicker, Form, Input, message, Modal, notification} from 'antd';
import React, {useState} from 'react';
import {blue} from "../../../baseInfo";
import {updateLeave} from "../../../component/axios/api";
import moment from "moment";
import intl from "react-intl-universal";

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onLoading: boolean;
    onCancel: () => void;
    content: any;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                       open,
                                                                       onCreate,
                                                                       onLoading,
                                                                       onCancel,
                                                                       content
                                                                   }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title={intl.get('updateLeaveApprove')}
            okText={intl.get('update')}
            okButtonProps={{style: {backgroundColor: blue, borderColor: blue}}}
            cancelText={intl.get('cancel')}
            onCancel={onCancel}
            confirmLoading={onLoading}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch(() => {
                        notification["error"]({
                            message: intl.get('submitFailed'),
                            description: intl.get('pleaseInputFullInfo'),
                        });
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    // leaveTime: [content.start_time, content.end_time],
                    // 格式化 content.start_time 和 content.end_time
                    leaveTime: [moment(content.start_time, 'YYYY-MM-DD HH:mm:ss'), moment(content.end_time, 'YYYY-MM-DD HH:mm:ss')],
                    reason: content.reason
                }}
            >
                <Form.Item
                    label={intl.get('leaveTime')}
                    name="leaveTime"
                    rules={[{required: true, message: intl.get('pleaseChooseLeaveTime')}]}
                >
                    <DatePicker.RangePicker
                        showTime={true}
                        format={"YYYY-MM-DD HH:mm:ss"}
                        ranges={{
                            [intl.get('fastChoose')]: [moment(), moment().add(1, 'days')],
                            [intl.get('today')]: [moment(), moment().endOf('day')],
                            [intl.get('oneDay')]: [moment(), moment().add(1, 'days')],
                            [intl.get('oneWeek')]: [moment(), moment().add(1, 'weeks')],
                            [intl.get('oneMonth')]: [moment(), moment().add(1, 'months')],
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={intl.get('reason')}
                    name="reason"
                    rules={[{required: true, message: intl.get('pleaseInputReason')}]}
                >
                    <Input.TextArea placeholder={intl.get('pleaseInputReason')} rows={4} showCount={true}
                                    maxLength={500}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const Update = (props: any) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const content = props.state;

    const onCreate = (values: any) => {
        setIsLoading(true);
        updateLeave(content.uid, values.reason, values.leaveTime[0].format('YYYY-MM-DD HH:mm'), values.leaveTime[1].format('YYYY-MM-DD HH:mm')).then(res => {
            message.success(res.msg);
            setOpen(false);
            setIsLoading(false);
            // props.getNewContent 返回给父组件,父组件接收一个对象，对象中有 reason,start_time,end_time
            props.getNewContent({
                reason: values.reason,
                start_time: values.leaveTime[0].format('YYYY-MM-DD HH:mm'),
                end_time: values.leaveTime[1].format('YYYY-MM-DD HH:mm')
            });
        }).catch(err => {
            message.error(err.msg);
            setIsLoading(false);
        })
    };

    const openNotification = () => {
        notification["warning"]({
            message: intl.get('attention'),
            description: intl.get('afterChangeApproveAgain'),
            className: 'back-drop'
        });
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                    openNotification();
                }}
            >
                {intl.get('update')}
            </Button>
            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onLoading={isLoading}
                onCancel={() => {
                    setOpen(false);
                }}
                content={content}
            />
        </div>
    );
};

export default Update;
