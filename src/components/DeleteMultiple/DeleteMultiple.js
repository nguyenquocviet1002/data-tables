import React from "react";
import './DeleteMultiple.scss';

const DeleteMultiple = ({ showConfirm, id }) => <button className="button red" onClick={() => { showConfirm(id, 'multi') }}>Xóa</button>

export default DeleteMultiple