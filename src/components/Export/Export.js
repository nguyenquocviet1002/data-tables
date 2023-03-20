import React from 'react'
import './Export.css'

const Export = ({ onExport }) => <button onClick={(e) => onExport(e.target.value)}>Export File CSV</button>;

export default Export