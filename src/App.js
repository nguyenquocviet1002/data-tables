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

function App() {

  const [dataTables, setDataTables] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pending, setPending] = useState(true);
  const [dataUpdate, setDataUpdate] = useState({});
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState(false)
  const [id, setId] = useState('')

  useEffect(() => {
    getData()
      .then((res) => res.json())
      .then(
        (data) => { setDataTables(data.body); setPending(false) },
        (error) => console.log(error),
      );
  }, []);

  const removeItem = async (id) => {
    setPending(true);
    showConfirm();
    await removeData(id)
      .then(res => res.json())
      .then(
        (data) => {
          const dataFilter = dataTables.filter(item => {
            return id !== item.id;
          })
          setDataTables(dataFilter);
          setPending(false);
        },
        (err) => { console.log(err) }
      )
  }

  const showPopup = (id) => {
    const newItem = dataTables.filter(item => {
      return item.id === id
    })
    setDataUpdate(newItem[0]);
    setShow(true);
  }

  const showConfirm = (id) => {
    setConfirm(true);
    setId(id);
  }

  const hiddenConfirm = () => {
    setConfirm(false)
  }

  const handleSubmitUpdate = async (dataNew) => {
    setPending(true);
    console.log(dataNew)
    // await updateData(dataNew)
    //   .then(res => res.json())
    //   .then(
    //     (data) => {
    //       const newProjects = dataTables.map(p =>
    //         p.id === id ? { ...p, ...data } : p
    //       );
    //       setDataTables(newProjects);
    //       setPending(false);
    //     },
    //     (err) => console.log(err)
    //   )
  }

  const columns = [
    {
      name: 'Họ và tên',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Điện thoại',
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Vị trí ứng tuyển',
      selector: (row) => row.position,
      sortable: true,
    },
    {
      name: 'File CV',
      cell: (row) => <Download linkDownload={row.cv} />,
    },
    {
      name: 'Trạng thái',
      selector: (row) => row.description,
    },
    {
      name: 'Hành động',
      cell: (row) => <div className='cta__action'><button className='button button--outline' onClick={() => showPopup(row.id)}>Chỉnh sửa</button><button className='button button--outline red' onClick={() => showConfirm(row.id)}>Xóa</button></div>
    },
  ];

  const filteredName = dataTables.filter(
    (item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredPhoneNumber = dataTables.filter(
    (item) => item.phone && item.phone.includes(filterText),
  );
  const filteredEmail = dataTables.filter(
    (item) => item.email && item.email.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredPositionApply = dataTables.filter(
    (item) => item.position && item.position.toLowerCase().includes(filterText.toLowerCase()),
  );

  const dataFilterAll = [...filteredName, ...filteredPhoneNumber, ...filteredEmail, ...filteredPositionApply];

  const dataFilter = dataFilterAll.filter((item, index) => dataFilterAll.indexOf(item) === index);

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <div className='header'>
        <Filter onFilter={(e) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
        <Export onExport={() => downloadCSV(dataTables)} />
      </div>
    );
  }, [filterText, resetPaginationToggle, dataTables]);

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
    <div className='container-full'>
      <Update data={dataUpdate} show={show} handleSubmit={handleSubmitUpdate} />
      <Confirm show={confirm} hidden={hiddenConfirm} id={id} remove={removeItem} />

      <div className='table__box'>
        <DataTable
          columns={columns}
          data={dataFilter}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          progressPending={pending}
          striped
          highlightOnHover
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}

export default App;
