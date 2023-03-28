import React from "react";
import "./FilterOption.scss";

const FilterOption = ({ onFilterOption }) => {
    return (
        <select className="select" onChange={onFilterOption}>
            <option value="">Tất cả</option>
            <option value="Đang xét duyệt">Đang xét duyệt</option>
            <option value="Đã được nhận">Đã được nhận</option>
            <option value="Đã hủy">Đã hủy</option>
            <option value="Chưa phỏng vấn">Chưa phỏng vấn</option>
            <option value="Đã phỏng vấn">Đã phỏng vấn</option>
        </select>
    )
}

export default FilterOption