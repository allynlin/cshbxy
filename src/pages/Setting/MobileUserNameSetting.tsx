import React, {useState} from 'react';
import {List, Modal, Form, Input, Button, Toast} from "antd-mobile";
import {useDispatch, useSelector} from "react-redux";
import {checkUsername, updateUserName} from "../../component/axios/api";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import Cookie from "js-cookie";
import {useNavigate} from "react-router-dom";

const ThemeSetting = () => {

    const [visible, setVisible] = useState(false);
    const [usernameUse, setUsernameUse] = useState<boolean>(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);
    const userType = useSelector((state: { userType: { value: any } }) => state.userType.value);

    const onFinish = (values: any) => {
        if (!usernameUse) {
            Toast.show({
                icon: 'fail',
                content: '用户名已存在',
            })
            return
        }
        updateUserName(userInfo.uid, values.username).then(res => {
            if (res.code === 200) {
                Toast.show({
                    icon: 'success',
                    content: '修改成功',
                })
                dispatch(logout())
                dispatch(all())
                Cookie.remove('token');
                Cookie.remove('username');
                navigate('/m/login', {replace: true})
            }
        })
    }

    let timeOut: any;

    const checkUserName = (e: any) => {
        // 防抖
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            checkUsername(e, userType).then(() => {
                setUsernameUse(true)
            }).catch(() => {
                setUsernameUse(false)
            })
        }, 500)
    }

    return (
        <>
            <List.Item clickable onClick={() => setVisible(true)}>
                修改用户名
            </List.Item>
            <Modal
                title="修改用户名"
                visible={visible}
                content={
                    <Form onFinish={onFinish} layout='vertical' footer={
                        <Button block type='submit' color='primary'>
                            提交
                        </Button>
                    }>
                        <Form.Item label='用户名' name="username" rules={[{required: true}]}>
                            <Input clearable placeholder='新用户名' onChange={e => {
                                checkUserName(e)
                            }}/>
                        </Form.Item>
                    </Form>
                }
                actions={[
                    {
                        key: 'cancel',
                        text: '取消',
                        onClick: () => setVisible(false)
                    }
                ]}
            />
        </>
    );
};

export default ThemeSetting;
