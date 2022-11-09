import {Button, Form, Input, message, Modal, notification, Radio} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import intl from "react-intl-universal";
import {updatePassword} from "../../component/axios/api";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import Cookie from "js-cookie";
import {purple} from "../../baseInfo";

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                       open,
                                                                       onCreate,
                                                                       onCancel,
                                                                   }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={open}
            title={intl.get("changePassword")}
            okText={intl.get('ok')}
            cancelText={intl.get('cancel')}
            onCancel={onCancel}
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
                            description: intl.get('pleaseInputAllInfo'),
                            className: 'back-drop'
                        });
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{modifier: 'public'}}
            >
                <Form.Item
                    name={'password'}
                    label={intl.get("password")}
                    rules={[{required: true, message: intl.get('pleaseInputPassword')}]}
                >
                    <Input.Password maxLength={20} showCount placeholder={intl.get('pleaseInputPassword')}/>
                </Form.Item>
                <Form.Item
                    name="repeatPassword"
                    label={intl.get('repeatPassword')}
                    rules={[{required: true, message: intl.get('pleaseRepeatPassword')}]}
                >
                    <Input.Password maxLength={20} showCount placeholder={intl.get('pleaseRepeatPassword')}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const App: React.FC = () => {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);

    const onCreate = (values: any) => {
        if (values.password !== values.repeatPassword) {
            notification["error"]({
                message: intl.get('submitFailed'),
                description: intl.get('twoPasswordIsNotSame'),
                className: 'back-drop'
            })
            return
        }
        updatePassword(userInfo.uid, values.password).then(res => {
            if (res.code === 200) {
                notification["success"]({
                    message: intl.get('changeSuccess'),
                    description: intl.get('changeSuccessNotice'),
                    className: 'back-drop'
                })
                dispatch(logout())
                dispatch(all())
                Cookie.remove('token');
                Cookie.remove('password');
                navigate('/login', {replace: true})
            }
        })
        setOpen(false);
    };

    return (
        <div>
            <Button
                type="primary"
                style={{backgroundColor: purple, borderColor: purple}}
                onClick={() => {
                    setOpen(true);
                    notification["warning"]({
                        message: intl.get('attention'),
                        description: intl.get('changePasswordNotice'),
                        className: 'back-drop'
                    });
                }}
            >
                {intl.get('changePassword')}
            </Button>
            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                    setOpen(false);
                }}
            />
        </div>
    );
};

export default App;
