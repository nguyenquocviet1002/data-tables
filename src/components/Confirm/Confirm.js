import React from "react";
import './Confirm.scss';

const Confirm = ({ show, hidden, id, remove }) => {
    return (
        <div className="confirm" style={!show ? { display: 'none' } : { display: 'flex' }}>
            <div className="confirm__bg" onClick={hidden}></div>
            <div className="confirm__box">
                <div className="confirm__title">Bạn có muốn thực hiện hành động</div>
                <img src="./icon-caution.png" alt="" />
                <div className="confirm__btn">
                    <button onClick={() => { remove(id); hidden() }} className="button">Có</button>
                    <button onClick={hidden} className="button red">Không</button>
                </div>
            </div>
        </div>
    )
}

export default Confirm