import {Button, Form, Input, Modal, message} from 'antd';
import React, {useState} from 'react';
import intl from "react-intl-universal";
import {checkUsername, updateUserName} from "../../component/axios/api";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import Cookie from "js-cookie";
import {useNavigate} from "react-router-dom";

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

const UserInfoSetting: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [usernameUse, setUsernameUse] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);
    const userType = useSelector((state: { userType: { value: any } }) => state.userType.value);

    const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                           open,
                                                                           onCreate,
                                                                           onCancel,
                                                                       }) => {
        const [form] = Form.useForm();
        let timeOut: any;

        const checkUserName = (e: any) => {
            // 防抖
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                checkUsername(e.target.value, userType).then(() => {
                    setUsernameUse(true)
                }).catch(() => {
                    setUsernameUse(false)
                })
            }, 500)
        }

        return (
            <Modal
                open={open}
                title={intl.get("changeUsername")}
                okText={intl.get('ok')}
                cancelText={intl.get('cancel')}
                onCancel={onCancel}
                onOk={() => {
                    if (!usernameUse) {
                        message.error(intl.get("usernameIsExist"))
                        return
                    }
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch(() => message.error(intl.get("pleaseInputAllInfo")));
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
                        <Input showCount maxLength={20} allowClear={true} onChange={e => {
                            checkUserName(e)
                        }}/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const onCreate = (values: any) => {
        updateUserName(userInfo.uid, values.username).then(res => {
            if (res.code === 200) {
                message.success(intl.get("changeSuccessNotice"));
                dispatch(logout())
                dispatch(all())
                Cookie.remove('token');
                Cookie.remove('username');
                navigate('/login', {replace: true})
            }
        })
        setOpen(false);
    };

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                    message.warning(intl.get("changeUsernameNotice"))
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

export default UserInfoSetting;
