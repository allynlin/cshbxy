import {Table, TableProps} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {VariableSizeGrid as Grid} from "react-window";
import classNames from "classnames";
import ResizeObserver from "rc-resize-observer";

const VirtualTable = <RecordType extends object>(props: TableProps<RecordType>) => {
    const {columns, scroll} = props;
    const [tableWidth, setTableWidth] = useState(0);

    const widthColumnCount = columns!.filter(({width}) => !width).length;
    const mergedColumns = columns!.map((column) => {
        if (column.width) {
            return column;
        }

        return {
            ...column,
            width: Math.floor(tableWidth / widthColumnCount),
        };
    });

    const gridRef = useRef<any>();
    const [connectObject] = useState<any>(() => {
        const obj = {};
        Object.defineProperty(obj, 'scrollLeft', {
            get: () => {
                if (gridRef.current) {
                    return gridRef.current?.state?.scrollLeft;
                }
                return null;
            },
            set: (scrollLeft: number) => {
                if (gridRef.current) {
                    gridRef.current.scrollTo({scrollLeft});
                }
            },
        });

        return obj;
    });

    const resetVirtualGrid = () => {
        gridRef.current?.resetAfterIndices({
            columnIndex: 0,
            shouldForceUpdate: true,
        });
    };

    useEffect(() => resetVirtualGrid, [tableWidth]);

    const renderVirtualList = (rawData: object[], {scrollbarSize, ref, onScroll}: any) => {
        ref.current = connectObject;
        const totalHeight = rawData.length * 55;

        return (
            <Grid
                ref={gridRef}
                className="virtual-grid"
                columnCount={mergedColumns.length}
                columnWidth={(index: number) => {
                    const {width} = mergedColumns[index];
                    return totalHeight > scroll!.y! && index === mergedColumns.length - 1
                        ? (width as number) - scrollbarSize - 1
                        : (width as number);
                }}
                height={scroll!.y as number}
                rowCount={rawData.length}
                rowHeight={() => 54}
                width={tableWidth}
                onScroll={({scrollLeft}: { scrollLeft: number }) => {
                    onScroll({scrollLeft});
                }}
            >
                {({
                      columnIndex,
                      rowIndex,
                      style,
                  }: {
                    columnIndex: number;
                    rowIndex: number;
                    style: React.CSSProperties;
                }) => (
                    <div
                        className={classNames('virtual-table-cell', {
                            'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
                        })}
                        style={{
                            ...style,
                            textAlign: "center",
                            marginTop: 10
                        }}
                    >
                        {(rawData[rowIndex] as any)[(mergedColumns as any)[columnIndex].dataIndex]}
                    </div>
                )}
            </Grid>
        );
    };

    // @ts-ignore
    return (
        <ResizeObserver
            onResize={({width}) => {
                setTableWidth(width);
            }}
        >
            <Table
                {...props}
                className="virtual-table"
                columns={mergedColumns}
                pagination={false}
                components={{
                    // @ts-ignore
                    body: renderVirtualList,
                }}
            />
        </ResizeObserver>
    );
};

export default VirtualTable;
