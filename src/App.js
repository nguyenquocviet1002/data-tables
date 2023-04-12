import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import DataTable from 'react-data-table-component';
import { getData, removeData, updateData } from './apis/tablesAPI';
import Filter from './components/Search/Search';
import Confirm from './components/Confirm/Confirm';
import Update from './components/Update/Update';
import DeleteMultiple from './components/DeleteMultiple/DeleteMultiple';

function App() {

  const [dataTables, setDataTables] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pending, setPending] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [showPopConfirm, setShowPopConfirm] = useState(false);
  const [id, setId] = useState('');
  const [ids, setIds] = useState([]);
  const [typeRemove, setTypeRemove] = useState('');

  // get data
  useEffect(() => {
    getData()
      .then(res => res.json())
      .then(
        data => {
          setDataTables(data);
          setPending(false);
        },
        error => console.log(error),
      );
  }, []);


  // filter search
  const filteredName = dataTables.filter(
    item => item.phone && item.phone.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredPhoneNumber = dataTables.filter(
    item => item.userid && item.userid.includes(filterText),
  );
  const filteredIP = dataTables.filter(
    item => item.ip && item.ip.includes(filterText),
  );

  const dataFilterAll = [...filteredName, ...filteredPhoneNumber, ...filteredIP];

  const dataFilter = dataFilterAll.filter((item, index) => dataFilterAll.indexOf(item) === index);

  // data sort date
  const dataSort = dataFilter.sort((a, b) => {
    return new Date(a.created).getTime() -
      new Date(b.created).getTime()
  }).reverse();


  // popup confirm remove
  const showConfirm = (id, type) => {
    setShowPopConfirm(true);
    setTypeRemove(type);
    type === 'single' ? setId(id) : setIds(id);
  }

  const hiddenConfirm = () => {
    setShowPopConfirm(false)
  }

  // remove 1 item
  const removeItem = async id => {
    setPending(true);
    await removeData(id)
      .then(res => res.json())
      .then(
        () => {
          const afterData = dataTables.filter(item => {
            return id !== item.id;
          })
          setDataTables(afterData);
          setPending(false);
        },
        err => console.log(err)
      )
  }

  // remove multiple item
  const removeMultiple = ids => {
    setPending(true);
    ids.map(async id => {
      await removeData(id)
        .then(res => res.json())
        .then(
          data => setPending(false),
          err => console.log(err)
        )
    })
    const afterData = dataTables.filter(item => {
      return !ids.includes(item.id);
    })
    setDataTables(afterData);
  }

  // select row -> get id row
  const selectRow = ({ selectedRows }) => {
    const idRow = selectedRows.map(item => item.id);
    setIds(idRow)
  };

  const handleSubmitUpdate = async dataNew => {
    setPending(true);
    await updateData(dataNew)
      .then(res => res.json())
      .then(
        () => {
          const newDataTables = dataTables.map(item =>
            item.id === dataNew.id ? { ...item, ...dataNew } : item
          );
          setDataTables(newDataTables);
          setPending(false);
        },
        err => console.log(err)
      )
  }

  // components sub header: search, filter, delete many, export
  const subHeaderComponentMemo = useMemo(() => {
    // clear value input search
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <div className='header'>
        <Filter onFilter={(e) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
        {ids.length !== 0 && <DeleteMultiple showConfirm={showConfirm} id={ids} />}
      </div>
    );
  }, [filterText, resetPaginationToggle, ids]);

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'User',
      selector: row => row.userid,
      sortable: true,
    },
    {
      name: 'Họ và tên',
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: 'IP',
      selector: row => row.ip,
      sortable: true,
    },
    {
      name: 'Ngày',
      selector: row => new Date(row.created_at).toLocaleString('en-US'),
      sortable: true,
    },
    {
      name: 'Hành động',
      cell: row =>
        <div className='cta__action'>
          <button className='button button--outline red' onClick={() => showConfirm(row.id, 'single')}>Xóa</button>
        </div>
    },
  ];

  const conditionalRowStyles = [
    {
      when: row => row.description === 'Chưa phỏng vấn',
      style: {
        color: '#721c24',
        backgroundColor: '#f8d7da',
      },
    },
  ];

  const customStyles = {
    subHeader: {
      style: {
        display: 'block',
        padding: '0 0 10px 0'
      }
    },
    head: {
      style: {
        fontSize: '16px'
      }
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    rows: {
      style: {
        minHeight: '60px',
        fontSize: '15px'
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        div: {
          whiteSpace: "break-spaces !important"
        }
      },
    },
  }

  return (
    <div>
      <Update data={dataUpdate} show={showFormUpdate} handleSubmit={handleSubmitUpdate} />
      <Confirm show={showPopConfirm} hidden={hiddenConfirm} id={id} ids={ids} type={typeRemove} remove={removeItem} removeMulti={removeMultiple} />

      <div className='table__box'>
        <DataTable
          columns={columns}
          data={dataSort}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          progressPending={pending}
          striped
          highlightOnHover
          customStyles={customStyles}
          selectableRows
          onSelectedRowsChange={selectRow}
          conditionalRowStyles={conditionalRowStyles}
          paginationRowsPerPageOptions={[10, 50, 100]}
        />
      </div>
    </div>
  );
}

export default App;
