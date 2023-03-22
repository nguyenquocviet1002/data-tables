import React from 'react'
import './Export.scss'

const Export = ({ onExport }) => <button type='button' className='button green' onClick={(e) => onExport(e.target.value)}>Export File CSV</button>;

export default Export