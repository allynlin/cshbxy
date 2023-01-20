import React from 'react';
import {App, Button, Form, Segmented, Slider} from 'antd';
import intl from "react-intl-universal";
import {useDispatch} from "react-redux";
import {setTable} from "../../../component/redux/userTableSlice";

interface userTableInterfaceProps {
    tableType: '虚拟列表' | '分页表格' | '普通表格';
    defaultPageSize: number;
}

const userTableDefaultSetting: userTableInterfaceProps = {
    tableType: '虚拟列表',
    defaultPageSize: 10,
}

const MyApp: React.FC = () => {

    const [form] = Form.useForm();
    const tableType = Form.useWatch('tableType', form);

    const dispatch = useDispatch();

    const {message} = App.useApp();

    const onFinish = (values: any) => {
        let tableType: any;
        switch (values.tableType) {
            case "虚拟列表":
                tableType = 'virtual';
                break;
            case "分页表格":
                tableType = 'pagination';
                break;
            case "普通表格":
                tableType = 'normal';
                break;
            default:
                tableType = 'virtual';
        }
        const result = {
            tableType: tableType,
            defaultPageSize: values.defaultPageSize,
        }
        dispatch(setTable(result))
        message.success(intl.get('changeSuccess'))
    }

    const onReset = () => {
        form.resetFields();
        dispatch(setTable(userTableDefaultSetting))
    }

    return (
        <Form
            form={form}
            name="table"
            layout="vertical"
            onFinish={onFinish}
            initialValues={userTableDefaultSetting}
        >
            <Form.Item name="tableType" label={intl.get('tableType')}>
                <Segmented options={['虚拟列表', '分页表格', '普通表格']}/>
            </Form.Item>
            {/* 每页条数 */}
            <Form.Item name="defaultPageSize" label={intl.get('pageSize')}>
                <Slider min={1} max={1000} disabled={tableType === "虚拟列表"}/>
            </Form.Item>
            <Form.Item>
                <Button htmlType={"submit"} type="primary">{intl.get('submit')}</Button>
                &nbsp;&nbsp;
                <Button htmlType={"reset"} type="default" onClick={onReset}>{intl.get('reset')}</Button>
            </Form.Item>
        </Form>
    );
};

const TableSetting = () => {
    return (
        <App>
            <MyApp/>
        </App>
    )
}

export default TableSetting;
