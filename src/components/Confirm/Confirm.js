import React from "react";
import './Confirm.scss';

const Confirm = ({ show, hidden, id, ids, type, remove, removeMulti }) => {
    return (
        <div className="confirm" style={!show ? { display: 'none' } : { display: 'flex' }}>
            <div className="confirm__bg" onClick={hidden}></div>
            <div className="confirm__box">
                <div className="confirm__title">Bạn có muốn xóa</div>
                <img src="./icon-caution.png" alt="" />
                <div className="confirm__btn">
                    <button onClick={type === 'single' ? () => { remove(id); hidden() } : () => { removeMulti(ids); hidden() }} className="button">Có</button>
                    <button onClick={hidden} className="button red">Không</button>
                </div>
            </div>
        </div>
    )
}

export default Confirm