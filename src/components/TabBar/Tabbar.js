import React from "react";
import { Link } from "react-router-dom";

const TabBar = () => {
    return (
        <div>
            <Link to='/'>Home</Link>
            <Link to='/view'>View</Link>
        </div>
    )
}

export default TabBar;