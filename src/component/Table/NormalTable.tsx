import {Table} from "antd";
import React from "react";
import type {ColumnsType} from 'antd/es/table';
import {DataType} from "./interface";

interface Props {
    columns: ColumnsType<DataType>;
    dataSource: [];
}

const NormalTable: React.FC<Props> = (props) => {

    return (
        <Table
            columns={props.columns}
            dataSource={props.dataSource}
            sticky={{
                offsetHeader: -24
            }}
            pagination={{
                // 是否展示 pageSize 切换器
                showSizeChanger: true,
                // 默认的每页条数
                defaultPageSize: 10,
                // 指定每页可以显示多少条
                pageSizeOptions: ['10', '20', '30', '40', '50', '100', '200', '500', '1000'],
            }}
        />
    )
}

export default NormalTable;