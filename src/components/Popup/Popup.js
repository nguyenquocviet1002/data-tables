import React, { useEffect, useState } from "react";
// import { updateData } from "../../apis/tablesAPI";
import "./Popup.scss";

const Popup = ({ data, handleSubmit }) => {

    const [dataUpdate, setDataUpdate] = useState({});
    const [value, setValue] = useState('');

    useEffect(() => {
        setDataUpdate(data);
        setValue(data.status);
    }, [data])

    // const handleSubmit = async (id, dataNew) => {
    //     await updateData(id, dataNew)
    //         .then(res => res.json())
    //         .then(
    //             (data) => console.log(data),
    //             (err) => console.log(err)
    //         )
    // }

    return (
        <>
            <div>
                <label htmlFor="name">Họ và tên</label>
                <input type="text" id="name" value={dataUpdate.name} onChange={(e) => { setDataUpdate({ ...dataUpdate, name: e.target.value }) }} />
            </div>
            <div>
                <label htmlFor="phone-number">Số điện thoại</label>
                <input type="text" id="phone-number" value={dataUpdate.phoneNumber} onChange={(e) => { setDataUpdate({ ...dataUpdate, phoneNumber: e.target.value }) }} />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input type="text" id="email" value={dataUpdate.email} onChange={(e) => { setDataUpdate({ ...dataUpdate, email: e.target.value }) }} />
            </div>
            <div>
                <label htmlFor="position">Vị trí ứng tuyển</label>
                <input type="text" id="position" value={dataUpdate.positionApply} onChange={(e) => { setDataUpdate({ ...dataUpdate, positionApply: e.target.value }) }} />
            </div>
            <div>
                <label htmlFor="status">Trạng thái</label>
                <select id="status" value={value} onChange={(e) => { setValue(e.target.value); setDataUpdate({ ...dataUpdate, status: e.target.value }) }}>
                    <option value="Đã hủy">Đã hủy</option>
                    <option value="Đã phỏng vấn">Đã phỏng vấn</option>
                    <option value="Chưa phỏng vấn">Chưa phỏng vấn</option>
                    <option value="Đang xét duyệt">Đang xét duyệt</option>
                    <option value="Đã được nhận">Đã được nhận</option>
                </select>
            </div>
            <button type="button" onClick={() => handleSubmit(dataUpdate.id, dataUpdate)}>Sửa</button>
        </>
    )
}

export default Popup