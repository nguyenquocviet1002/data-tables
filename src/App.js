import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import DataTable from 'react-data-table-component';
import { getData, removeData, updateData } from './apis/tablesAPI';
import { downloadCSV } from './utils/convertToCSV';
import Export from './components/Export/Export';
import Filter from './components/Search/Search';
import Download from './components/Download/Download';
import Popup from './components/Popup/Popup';

function App() {

  const [dataTables, setDataTables] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pending, setPending] = useState(true);
  const [dataUpdate, setDataUpdate] = useState({});

  useEffect(() => {
    getData()
      .then((res) => res.json())
      .then(
        (data) => { setDataTables(data); setPending(false) },
        (error) => console.log(error),
      );
  }, []);

  const removeItem = async (id) => {
    await removeData(id)
      .then(res => res.json())
      .then(
        (data) => {
          const dataFilter = dataTables.filter(item => {
            return data.id !== item.id;
          })
          setDataTables(dataFilter)
        },
        (err) => { console.log(err) }
      )
  }

  const showPopup = (id) => {
    const newItem = dataTables.filter(item => {
      return item.id === id
    })
    setDataUpdate(newItem[0])
  }

  const handleSubmitUpdate = async (id, dataNew) => {
    await updateData(id, dataNew)
      .then(res => res.json())
      .then(
        (data) => {
          const newProjects = dataTables.map(p =>
            p.id === id ? { ...p, ...data } : p
          );
          setDataTables(newProjects)
        },
        (err) => console.log(err)
      )
  }

  const columns = [
    {
      name: 'Họ và tên',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Điện thoại',
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Vị trí ứng tuyển',
      selector: (row) => row.positionApply,
      sortable: true,
    },
    {
      name: 'File CV',
      cell: (row) => <Download linkDownload={row.linkCV} />,
    },
    {
      name: 'Trạng thái',
      selector: (row) => row.status,
    },
    {
      name: 'Hành động',
      cell: (row) => <div><button onClick={() => showPopup(row.id)}>Chỉnh sửa</button><button onClick={() => removeItem(row.id)}>Xóa</button></div>
    },
  ];

  const filteredName = dataTables.filter(
    (item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredPhoneNumber = dataTables.filter(
    (item) => item.phoneNumber && item.phoneNumber.includes(filterText),
  );
  const filteredEmail = dataTables.filter(
    (item) => item.email && item.email.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredPositionApply = dataTables.filter(
    (item) => item.positionApply && item.positionApply.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredStatus = dataTables.filter(
    (item) => item.status && item.status.toLowerCase().includes(filterText.toLowerCase()),
  );

  const dataFilterAll = [...filteredName, ...filteredPhoneNumber, ...filteredEmail, ...filteredPositionApply, ...filteredStatus];

  const dataFilter = dataFilterAll.filter((item, index) => dataFilterAll.indexOf(item) === index);

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <div className='head'>
        <Filter onFilter={(e) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
        <Export onExport={() => downloadCSV(dataTables)} />
      </div>
    );
  }, [filterText, resetPaginationToggle, dataTables]);

  return (
    <div>
      <DataTable
        columns={columns}
        data={dataFilter}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderWrap
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
        progressPending={pending}
        striped
        highlightOnHover
      />
      <Popup data={dataUpdate} handleSubmit={handleSubmitUpdate} />
    </div>
  );
}

export default App;
