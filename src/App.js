import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import DataTable from 'react-data-table-component';
import { getData, removeData, updateData } from './apis/tablesAPI';
import { downloadCSV } from './utils/convertToCSV';
import Export from './components/Export/Export';
import Filter from './components/Search/Search';
import Download from './components/Download/Download';
import Confirm from './components/Confirm/Confirm';
import Update from './components/Update/Update';
import FilterOption from './components/FilterOption/FilterOption';
import DeleteMultiple from './components/DeleteMultiple/DeleteMultiple';
import FilterDate from './components/FilterDate/FilterDate';

function App() {

  const [dataTables, setDataTables] = useState([]);
  const [dataTablesAgo, setDataTablesAgo] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pending, setPending] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [showFormUpdate, setShowFormUpdate] = useState(false);
  const [showPopConfirm, setShowPopConfirm] = useState(false);
  const [id, setId] = useState('');
  const [ids, setIds] = useState([]);
  const [typeRemove, setTypeRemove] = useState('');
  const [status, setStatus] = useState({ status: '', date: '' });

  // get data
  useEffect(() => {
    getData()
      .then(res => res.json())
      .then(
        data => {
          setDataTables(data.body);
          setPending(false);
          const dateNow = new Date().getTime();
          const dataAgo = data.body.filter(item => {
            return dateNow - (86400000 * 7) < new Date(item.created).getTime() && item.name;
          })
          setDataTablesAgo(dataAgo);
        },
        error => console.log(error),
      );
  }, []);

  console.log(dataTablesAgo);

  // filter search
  const filteredName = dataTables.filter(
    item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredPhoneNumber = dataTables.filter(
    item => item.phone && item.phone.includes(filterText),
  );
  const filteredEmail = dataTables.filter(
    item => item.email && item.email.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredPositionApply = dataTables.filter(
    item => item.position && item.position.toLowerCase().includes(filterText.toLowerCase()),
  );

  const dataFilterAll = [...filteredName, ...filteredPhoneNumber, ...filteredEmail, ...filteredPositionApply];

  const dataFilter = dataFilterAll.filter((item, index) => dataFilterAll.indexOf(item) === index);

  // data sort date
  const dataSort = dataFilter.sort((a, b) => {
    return new Date(a.created).getTime() -
      new Date(b.created).getTime()
  }).reverse();

  // data after change status and date
  const filterStatus = ({ status, date }) => {
    const dateNow = new Date().getTime();
    if (status) {
      const dataFilterStatus = dataSort.filter(item => item.description === status);
      if (date) {
        const dataFilterDate = dataFilterStatus.filter(item => {
          return dateNow - (86400000 * date) < new Date(item.created).getTime() && new Date(item.created).getTime() < dateNow;
        });
        return dataFilterDate;
      } else {
        return dataFilterStatus;
      }
    } else if (date) {
      const dataFilterDate = dataSort.filter(item => {
        return dateNow - (86400000 * date) < new Date(item.created).getTime() && new Date(item.created).getTime() < dateNow;
      });
      return dataFilterDate;
    } else {
      return dataSort;
    }
  }

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

  // show info form update
  const showForm = id => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    })
    const newItem = dataTables.filter(item => {
      return item.id === id
    })
    setDataUpdate(newItem[0]);
    setShowFormUpdate(true);
  }

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
        <FilterOption onFilterOption={(e) => setStatus({ date: status.date, status: e.target.value })} />
        <FilterDate onFilterDate={(e) => setStatus({ date: e.target.value, status: status.status })} />
        {ids.length !== 0 && <DeleteMultiple showConfirm={showConfirm} id={ids} />}
        <Export onExport={() => downloadCSV(dataTables)} />
      </div>
    );
  }, [filterText, resetPaginationToggle, dataTables, ids, status]);

  const columns = [
    {
      name: 'Họ và tên',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Điện thoại',
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Vị trí ứng tuyển',
      selector: row => row.position,
      sortable: true,
    },
    {
      name: 'File CV',
      cell: row => <Download linkDownload={row.cv} />,
    },
    {
      name: 'Trạng thái',
      selector: row => row.description,
    },
    {
      name: 'Ngày',
      selector: row => new Date(row.created).toLocaleDateString('zh-HK', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    },
    {
      name: 'Hành động',
      cell: row =>
        <div className='cta__action'>
          <button className='button button--outline' onClick={() => showForm(row.id)}>Chỉnh sửa</button>
          <button className='button button--outline red' onClick={() => showConfirm(row.id, 'single')}>Xóa</button>
        </div>
    },
  ];

  // const conditionalRowStyles = [
  //   {
  //     when: row => row.description === 'Chưa phỏng vấn',
  //     style: {
  //       color: '#721c24',
  //       backgroundColor: '#f8d7da',
  //     },
  //   },
  // ];

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
          data={filterStatus(status)}
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
        // conditionalRowStyles={conditionalRowStyles}
        />
      </div>
    </div>
  );
}

export default App;
