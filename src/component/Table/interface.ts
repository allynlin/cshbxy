import React from "react";

export interface DataType {
    key: React.Key;
    dataIndex: string;
    align: 'left' | 'right' | 'center';
}