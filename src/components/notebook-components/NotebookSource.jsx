import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getContextById } from "../../service/notebookPage";
import { List } from 'react-content-loader'

const NotebookSource = ({ source, notebookId }) => {
    const dispatch = useDispatch();
    const isOpenSource = useSelector((state) => state.isOpenSource);
    const [contentSource, setContentSource] = useState('');
    const [loadingContent, setLoadingContent] = useState(true)

    const closeSource = () => {
        dispatch({
            type: 'TOGGLE_SOURCE'
        });
    };

    const getContentFile = async () => {
        try {
            const data = await getContextById(notebookId, source.file_id);
            let formattedText = data.data.text
                .replace(/(?:\r\n|\r|\n|\\n)/g, '<br />') // Chuyển đổi dòng mới thành thẻ <br />
                .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng liên tiếp thành một khoảng trắng
                .replace(/ n /g, ' ') // Sửa lỗi chính tả
                .replace(/ đ /g, ' ') // Sửa lỗi chính tả
                .replace(/ s /g, ' ') // Sửa lỗi chính tả
                .replace(/1/g, ' ') // Loại bỏ số 1 không cần thiết
                .replace(/\s*,\s*/g, ', ') // Chuẩn hóa dấu phẩy
                .replace(/\s*\.\s*/g, '. ') // Chuẩn hóa dấu chấm
                .replace(/\s*\(\s*/g, ' (') // Chuẩn hóa dấu ngoặc mở
                .replace(/\s*\)\s*/g, ') ') // Chuẩn hóa dấu ngoặc đóng
                .replace(/ {2,}/g, ' '); // Chuẩn hóa khoảng trắng liên tiếp
            setContentSource(formattedText);
            setLoadingContent(false)
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getContentFile();
    }, [source.file_id, notebookId]);

    const handleCloseSource = () => {
        closeSource();
    };

    return (
        <div className="notebook-source">
            <div className="notebook-source-close" onClick={handleCloseSource}>
                <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="notebook-source-header">
                <span>{source.file_name}</span>
            </div>
            <div className="notebook-source-main">
                {loadingContent ? (
                    <>
                    <List backgroundColor={'#333'}
                        foregroundColor={'#999'}/>
                    <List backgroundColor={'#333'}
                        foregroundColor={'#999'}/>
                    </>
                ) : (
                    <div className="notebook-source-content">
                        <div dangerouslySetInnerHTML={{ __html: contentSource }} />
                    </div>
                ) }
            </div>
        </div>
    );
};

export default NotebookSource;