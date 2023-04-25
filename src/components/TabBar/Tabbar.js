import React, { useEffect, useState } from "react";
import { getData } from '../../apis/tablesAPI';
import './TabBar.scss';
import { NavLink } from "react-router-dom";
import Notification from "../Notification/Notification";

const TabBar = () => {
    const [dataTablesAgo, setDataTablesAgo] = useState([]);

    // get data
    useEffect(() => {
        getData()
            .then(res => res.json())
            .then(
                data => {
                    const dateNow = new Date().getTime();
                    const dataAgo = data.body.filter(item => {
                        return dateNow - (86400000 * 7) < new Date(item.created).getTime() && item.name;
                    })
                    // data sort date
                    const dataSort = dataAgo.sort((a, b) => {
                        return new Date(a.created).getTime() -
                            new Date(b.created).getTime()
                    }).reverse();
                    setDataTablesAgo(dataSort);
                },
                error => console.log(error),
            );
    }, []);

    return (
        <div className="tabBar">
            <ul className="tabBar__tabs">
                <li className="tabBar__item">
                    <NavLink className="tabBar__link" to='/'>Hồ sơ ứng tuyển</NavLink>
                </li>
                <li>
                    <NavLink className="tabBar__link" to='/view'>Thống kê</NavLink>
                </li>
            </ul>
            <Notification data={dataTablesAgo} />
        </div>
    )
}

export default TabBar;