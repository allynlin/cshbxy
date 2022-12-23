import React, {useState} from 'react';
import {List, Modal, Form, Input, Button, Toast} from "antd-mobile";
import {useDispatch, useSelector} from "react-redux";
import {updatePassword} from "../../component/axios/api";
import {logout} from "../../component/redux/isLoginSlice";
import {all} from "../../component/redux/userTypeSlice";
import Cookie from "js-cookie";
import {useNavigate} from "react-router-dom";

const ThemeSetting = () => {

    const [visible, setVisible] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userInfo = useSelector((state: { userInfo: { value: any } }) => state.userInfo.value);

    const onFinish = (values: any) => {
        if (values.password !== values.enterPassword) {
            Toast.show({
                icon: "fail",
                content: "两次输入密码不一致"
            })
            return
        }
        // 判断用户名长度是否小于 8
        if (values.password)
            console.log(values)
        // updatePassword(userInfo.uid, values.password).then(res => {
        //     if (res.code === 200) {
        //         Toast.show({
        //             icon: "success",
        //             content: "修改成功"
        //         })
        //         dispatch(logout())
        //         dispatch(all())
        //         Cookie.remove('token');
        //         Cookie.remove('password');
        //         navigate('/m/login', {replace: true})
        //     }
        // })
    }

    return (
        <>
            <List.Item clickable onClick={() => setVisible(true)}>
                修改密码
            </List.Item>
            <Modal
                title="修改密码"
                visible={visible}
                content={
                    <Form onFinish={onFinish} layout='vertical' footer={
                        <Button block type='submit' color='primary'>
                            提交
                        </Button>
                    }>
                        <Form.Item label='密码' name="password" rules={[{required: true}]}>
                            <Input type="password" clearable placeholder='新密码'/>
                        </Form.Item>
                        <Form.Item label='确认密码' name="enterPassword" rules={[{required: true}]}>
                            <Input type="password" clearable placeholder='确认密码'/>
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
