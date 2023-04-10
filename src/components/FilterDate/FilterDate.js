import React from "react";

const FilterDate = ({ onFilterDate }) => {
    return (
        <select className="select" onChange={onFilterDate}>
            <option value="">Tất cả</option>
            <option value="7">7 ngày trước</option>
            <option value="14">14 ngày trước</option>
            <option value="30">30 ngày trước</option>
            <option value="60">60 ngày trước</option>
        </select>
    )
}

export default FilterDate