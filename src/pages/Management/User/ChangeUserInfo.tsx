import React, {useEffect, useRef, useState} from "react";
import {Button, Divider, Form, Input, InputRef, message, Modal, Select, Space} from "antd";
import {updateUserInfo} from "../../../component/axios/api";
import {PlusOutlined} from "@ant-design/icons";

interface propsCheck {
    info: any;
    getChange: any;
}

let index = 0;

export default function ChangeUserInfo(props: propsCheck) {

    // 打开修改弹窗
    const [open, setOpen] = useState(false);
    // 给按钮添加 loading 并且禁用
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState(['Man(男)', 'Woman(女)', 'Cis-gender woman', 'Transgender Woman', 'Woman of Trans experience', 'Woman with a history of gender transition', 'Trans feminine', 'Feminine-of-center', 'MTF (male-to-female)', 'Demigirl', 'T-girl', 'Transgirl', 'Sistergirl', 'Cis-gender man', 'Transgender man', 'Man of Trans experience', 'Man with a history of gender transition', 'Trans masculine', 'Masculine-of-center', 'FTM (female-to-male)', 'Demiboy', 'T-boy', 'Transguy', 'Brotherboy', 'Trans', 'Transgender', 'Transsexual', 'Non-binary', 'Genderqueer', 'Agender', 'Xenogender', 'Fem', 'Femme', 'Butch', 'Boi', 'Stud', 'Aggressive (AG)', 'Androgyne', 'Tomboy', 'Gender outlaw', 'Gender non-conforming', 'Gender variant', 'Gender fluid', 'Genderfuck', 'Bi-gender', 'Multi-gender', 'Pangender', 'Gender creative', 'Gender expansive', 'Third gender', 'Neutrois', 'Omnigender', 'Polygender', 'Graygender', 'Intergender', 'Maverique', 'Novigender', 'Two-spirit', 'Hijra', 'Kathoey', 'Muxe', 'Khanith/Xanith', 'X-gender', 'MTX', 'FTX', 'Bakla', 'Mahu', 'Fa’afafine', 'Waria', 'Palao’ana', 'Ashtime', 'Mashoga', 'Mangaiko', 'Chibados', 'Tida wena', 'Bixa’ah', 'Alyha', 'Hwame', 'Lhamana', 'Nadleehi', 'Dilbaa', 'Winkte', 'Ninauposkitzipxpe', 'Machi-embra', 'Quariwarmi', 'Chuckchi', 'Whakawahine', 'Fakaleiti', 'Calabai', 'Calalai', 'Bissu', 'Acault', 'Travesti', 'Questioning', 'I don’t use labels', 'Declined', 'Not listed']);
    const [name, setName] = useState('');
    const inputRef = useRef<InputRef>(null);

    const [form] = Form.useForm();

    // 用于英文性别
    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    useEffect(() => {
        form.setFieldsValue({
            realeName: props.info.realeName,
            email: props.info.email,
            tel: props.info.tel,
            gender: props.info.gender
        })
    }, [props.info])

    const changeUserInfo = (values: any) => {
        setLoading(true);
        updateUserInfo(props.info.uid, values.realeName, values.gender, values.tel, values.email).then(res => {
            if (res.code === 200) {
                message.success("修改成功");
                const newContent = {
                    realeName: values.realeName,
                    gender: values.gender,
                    tel: values.tel,
                    email: values.email
                }
                props.getChange(newContent)
                setOpen(false);
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <div>
            <Button
                type="primary"
                loading={loading}
                disabled={loading}
                onClick={() => {
                    setOpen(true);
                }}
            >
                修改用户信息
            </Button>
            <Modal
                open={open}
                title="修改用户信息"
                okText="确认"
                confirmLoading={loading}
                cancelText="取消"
                onCancel={() => setOpen(false)}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            changeUserInfo(values);
                        })
                        .catch(err => {
                            message.error(err.message);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                >
                    <Form.Item
                        label="真实姓名"
                        name="realeName"
                        rules={[
                            {
                                required: true,
                                message: "请输入真实姓名",
                            },
                        ]}
                    >
                        <Input showCount maxLength={10} allowClear={true}/>
                    </Form.Item>

                    <Form.Item
                        label="性别"
                        name="gender"
                        rules={[
                            {
                                required: true,
                                message: "请选择性别",
                            },
                        ]}
                    >
                        <Select
                            style={{width: 300}}
                            placeholder="请选择性别"
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{margin: '8px 0'}}/>
                                    <Space style={{padding: '0 8px 4px'}}>
                                        <Input
                                            placeholder="Please enter item"
                                            ref={inputRef}
                                            value={name}
                                            onChange={onNameChange}
                                        />
                                        <Button type="text" icon={<PlusOutlined/>} onClick={addItem}>
                                            Add item
                                        </Button>
                                    </Space>
                                </>
                            )}
                            options={items.map((item) => ({label: item, value: item}))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="联系电话"
                        name="tel"
                        rules={[
                            {
                                required: true,
                                message: "请输入联系电话",
                                pattern: /^1[3456789]\d{9}$/
                            },
                        ]}
                    >
                        <Input type={"tel"} showCount maxLength={11} allowClear={true}/>
                    </Form.Item>

                    <Form.Item
                        label="电子邮件地址"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "请输入电子邮件地址",
                                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                            },
                        ]}
                    >
                        <Input type={"email"} showCount maxLength={30} allowClear={true}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
