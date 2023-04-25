import React, { useState, useEffect, useRef } from "react";
import './Notification.scss';

const Notification = ({ data }) => {
    const [show, setShow] = useState(false);
    const showNoti = () => {
        setShow(!show);
    }


    const useOutsideHidden = (ref) => {
        useEffect(() => {
            const handleClickOutside = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setShow(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    const wrapperRef = useRef(null);
    useOutsideHidden(wrapperRef);


    return (
        <div className="notify" ref={wrapperRef}>
            <div className={data.length !== 0 ? "notify__noti ani" : "notify__noti"} onClick={() => showNoti()}><img src={`${process.env.PUBLIC_URL}/icon-noti.png`} alt="" />{data.length !== 0 && <span className="notify__badge"></span>}</div>
            <div className={show ? 'show notify__box' : 'notify__box'}>
                <div className="notify__title">Thông báo</div>
                <div className="notify__content">
                    {data.length !== 0 ? data.map((item, index) => (
                        <div className="notify__notiItem" key={index}>
                            <div className="notify__nameUser">{item.name} - {item.position}</div>
                            <div className="notify__dateUser">{item.created}</div>
                        </div>
                    )) : <div className="notify__notiItem center">Chưa có hồ sơ mới</div>}
                </div>
            </div>
        </div>
    )
}

export default Notification;