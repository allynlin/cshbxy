import React from 'react';
import './record.scss'
import {useSelector} from "react-redux";

const RecordSkeleton: React.FC = () => {
    const themeColor: String = useSelector((state: {
        themeColor: {
            value: String
        }
    }) => state.themeColor.value)
    const renderThemeColor = () => {
        switch (themeColor) {
            case 'dark':
                return 'skeleton-dark'
            case 'light':
                return 'skeleton-light'
            default:
                return 'skeleton-light'
        }
    }
    return (
        <div className={'record-body'}>
            <div className={renderThemeColor()}>
                <h2 className={'tit'}>&nbsp;</h2>
                <div className={'table'}> &nbsp;
                </div>
            </div>
        </div>
    )
};

export default RecordSkeleton;
