import React from 'react';
import './Search.scss';

const Filter = ({ filterText, onFilter, onClear }) => (
    <div className='search'>
        <input
            className='search__input'
            id="search"
            type="text"
            placeholder="Tìm kiếm"
            aria-label="Search Input"
            value={filterText}
            onChange={onFilter}
        />
        {!filterText ? '' : <button className='search__clear' type="button" onClick={onClear}>&#10006;</button>}

    </div>
);

export default Filter;
