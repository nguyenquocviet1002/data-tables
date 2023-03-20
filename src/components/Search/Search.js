import React from 'react';
import './Search.css';

const Filter = ({ filterText, onFilter, onClear }) => (
    <div>
        <input
            id="search"
            type="text"
            placeholder="Tìm kiếm"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
        />
        <button type="button" onClick={onClear}>
            &#10006;
        </button>
    </div>
);

export default Filter;
