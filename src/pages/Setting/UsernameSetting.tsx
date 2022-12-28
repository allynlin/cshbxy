import {App, Button, Form, Input, Modal} from 'antd';
import React, {useState} from 'react';
import intl from "react-intl-universal";
import {checkUsername, updateUserName} from "../../component/axios/api";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import Cookie from "js-cookie";
import {useNavigate} from "react-router-dom";
import {useGaussianBlurStyles} from "../../styles/gaussianBlurStyle";

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

const key = "updateUsername"

const UserInfo: React.FC = () => {

    const {message} = App.useApp();

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const gaussianBlurClasses = useGaussianBlurStyles();

    const gaussianBlur = useSelector((state: any) => state.gaussianBlur.value)
    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);
    const userType = useSelector((state: { userType: { value: any } }) => state.userType.value);

    const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                           open,
                                                                           onCreate,
                                                                           onCancel,
                                                                       }) => {
        const [form] = Form.useForm();

        return (
            <Modal
                open={open}
                className={gaussianBlur ? gaussianBlurClasses.gaussianBlurModal : ''}
                mask={!gaussianBlur}
                title={intl.get("changeUsername")}
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
                        .catch(() => message.open({
                            key,
                            type: "error",
                            content: intl.get('pleaseInputAllInfo')
                        }));
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                        username: userInfo.username,
                    }}
                >
                    <Form.Item
                        label={intl.get('username')}
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: intl.get('pleaseInputUsername'),
                                pattern: /^[a-zA-Z0-9]{1,20}$/
                            },
                        ]}
                    >
                        <Input showCount maxLength={20} allowClear={true}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const onCreate = (values: any) => {
        message.open({
            key,
            type: 'loading',
            content: intl.get('checkUserNameing'),
            duration: 0,
        });
        checkUserName(values)
    };

    const checkUserName = (values: any) => {
        checkUsername(values.username, userType).then(res => {
            if (res.code !== 200) {
                message.open({
                    key,
                    type: 'error',
                    content: intl.get('usernameIsExist'),
                    duration: 3,
                });
                return;
            }
            updateUsername(values)
        }).catch(() => {
            message.open({
                key,
                type: 'error',
                content: intl.get('tryingAgain'),
                duration: 3,
            });
            checkUserName(values)
        })
    }

    const updateUsername = (values: any) => {
        updateUserName(userInfo.uid, values.username).then(res => {
            if (res.code !== 200) {
                message.open({
                    key,
                    type: 'error',
                    content: res.msg,
                });
                return
            }
            message.open({
                key,
                type: "success",
                content: res.msg,
                duration: 0.5,
            }).then(() => {
                dispatch(logout())
                dispatch(all())
                Cookie.remove('token');
                Cookie.remove('username');
                navigate('/login', {replace: true})
            })
        })
    }

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                    message.open({
                        key,
                        type: "warning",
                        content: intl.get('changeUsernameNotice')
                    })
                }}
            >
                {intl.get('changeUsername')}
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

const UserInfoSetting = () => {
    return (
        <App>
            <UserInfo/>
        </App>
    )
}

export default UserInfoSetting;
