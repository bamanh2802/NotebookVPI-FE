import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const NotebookSource = ({ source }) => {
    const dispatch = useDispatch();
    const isOpenSource = useSelector((state) => state.isOpenSource)

    const closeSource = () => {
        dispatch({
            type: 'TOGGLE_SOURCE'
        })
    }

    const handleCloseSource = () => {
        console.log(source)
        closeSource()
    }
    return (
        <div className="notebook-source">
            <div className="notebook-source-close" onClick={handleCloseSource}>
                <i class="fa-solid fa-xmark"></i>
            </div>
            <div className="notebook-source-header">
                <span>{source.name}</span>
            </div>
            <div className="notebook-source-main">
                <div className="notebook-source-content">
                {/* {source.content} */}
                Hệ thống quản lý nhà hàng "DuMaThAn" được thiết kế để xử lý và lưu trữ thông tin về các thực thể chính như người dùng, thực đơn, món ăn, nhân viên, khách hàng, bàn, voucher và nguyên liệu. [1] Mỗi thực thể này được biểu diễn bởi một bảng với các thuộc tính cụ thể và khóa chính tương ứng. [1] Ví dụ, mối quan hệ giữa món ăn và nguyên liệu giúp quản lý kho và tính toán chi phí món ăn. [1]\n\nCác chức năng chính của hệ thống bao gồm:\n\nQuản lý người dùng: Cho phép người dùng tạo và quản lý tài khoản, đồng thời tập trung vào việc xác thực người dùng và bảo mật thông tin. [2-4]\nQuản lý của quản lý: Cung cấp các công cụ để quản lý doanh thu, chi phí, nhân viên, khách hàng và dịch vụ. [4-6]\nChức năng của đầu bếp: Cung cấp các công cụ để quản lý nguyên liệu, món ăn và quy trình chuẩn bị món ăn, bao gồm cả việc theo dõi và quản lý các phiếu order. [6-8]\nQuản lý hóa đơn: Cung cấp các công cụ để tạo, quản lý và xử lý hóa đơn, theo dõi doanh thu và xử lý thanh toán. [9, 10]\n\nHệ thống "DuMaThAn" nhằm mục đích tối ưu hóa quy trình quản lý, nâng cao hiệu quả hoạt động và cải thiện trải nghiệm của khách hàng. [11] Hệ thống đã được thiết kế với nhiều chức năng quan trọng, từ quản lý nhân viên, thực đơn, voucher đến quản lý nguyên liệu. [2]\n\nMặc dù hệ thống đã được thử nghiệm và đánh giá cao về độ tin cậy, tính năng động và khả năng tương thích, nhưng nó vẫn có thể được cải thiện hơn nữa bằng cách cập nhật công nghệ mới nhất, phát triển các tính năng mới và mở rộng thị trường. [11-13] Các nhà phát triển có kế hoạch tích hợp trí tuệ nhân tạo để cá nhân hóa đề xuất, cải thiện quản lý kho hàng thông qua IoT và phát triển mô-đun phân tích dữ liệu nâng cao. [12] Họ cũng có kế hoạch giới thiệu các chương trình khách hàng thân thiết để tăng cường sự gắn kết với khách hàng. [13]
                </div>
            </div>

        </div>
    )
}

export default NotebookSource