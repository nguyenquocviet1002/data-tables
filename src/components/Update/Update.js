import React, { useEffect, useState } from 'react';
import './Update.scss';

const Update = ({ data, show, handleSubmit }) => {
  const [dataUpdate, setDataUpdate] = useState({});
  const [value, setValue] = useState('');
  const [showP, setShowP] = useState(false);

  useEffect(() => {
    setDataUpdate(data);
    setValue(data.description);
  }, [data]);

  useEffect(() => {
    setShowP(show);
  }, [show, data]);

  const hidden = () => {
    setShowP(false);
    let rows = document.getElementsByClassName('sc-jsMahE');
    [...rows].forEach((elm) => elm.classList.remove('active'));
  };
  return (
    <div className="update" style={!showP ? { display: 'none' } : { display: 'block' }}>
      <div className="update__title">Chỉnh sửa thông tin</div>
      <div className="update__box">
        <div className="update__group">
          <label className="update__label" htmlFor="name">
            Họ và tên
          </label>
          <input
            className="update__input"
            type="text"
            id="name"
            value={dataUpdate.name}
            onChange={(e) => {
              setDataUpdate({ ...dataUpdate, name: e.target.value });
            }}
          />
        </div>
        <div className="update__group">
          <label className="update__label" htmlFor="phone-number">
            Số điện thoại
          </label>
          <input
            className="update__input"
            type="text"
            id="phone-number"
            value={dataUpdate.phone}
            onChange={(e) => {
              setDataUpdate({ ...dataUpdate, phone: e.target.value });
            }}
          />
        </div>
        <div className="update__group">
          <label className="update__label" htmlFor="email">
            Email
          </label>
          <input
            className="update__input"
            type="text"
            id="email"
            value={dataUpdate.email}
            onChange={(e) => {
              setDataUpdate({ ...dataUpdate, email: e.target.value });
            }}
          />
        </div>
        <div className="update__group">
          <label className="update__label" htmlFor="position">
            Vị trí ứng tuyển
          </label>
          <input
            className="update__input"
            type="text"
            id="position"
            value={dataUpdate.position}
            onChange={(e) => {
              setDataUpdate({ ...dataUpdate, position: e.target.value });
            }}
          />
        </div>
        <div className="update__group">
          <label className="update__label" htmlFor="status">
            Trạng thái
          </label>
          <select
            className="update__input"
            id="status"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setDataUpdate({ ...dataUpdate, description: e.target.value });
            }}
          >
            <option value="Chưa phỏng vấn">Chưa phỏng vấn</option>
            <option value="Đã hủy">Đã hủy</option>
            <option value="Đã duyệt hồ sơ">Đã duyệt hồ sơ</option>
            <option value="Đã phỏng vấn">Đã phỏng vấn</option>
            <option value="Đã được nhận">Đã được nhận</option>
            <option value="Đã nhận việc">Đã nhận việc</option>
          </select>
        </div>
        <input className="update__input" type="hidden" value={dataUpdate.cv} />
        <input className="update__input" type="hidden" value={dataUpdate.id} />
      </div>
      <div className="update__cta">
        <button
          type="button"
          className="button update__submit"
          onClick={() => {
            handleSubmit(dataUpdate);
            hidden();
          }}
        >
          Lưu
        </button>
        <button type="button" className="button red update__submit" onClick={hidden}>
          Hủy
        </button>
      </div>
    </div>
  );
};

export default Update;
