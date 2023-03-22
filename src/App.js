import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import getData from './apis/tablesAPI';
import { downloadCSV } from './utils/convertToCSV';
import Export from './components/Export/Export';
import Filter from './components/Search/Search';
import Download from './components/Download/Download';

function App() {

  const [dataTables, setDataTables] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    getData()
      .then((res) => res.json())
      .then(
        (data) => { setDataTables(data); setPending(false) },
        (error) => console.log(error),
      );
  }, []);

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
  ];

  const actionsMemo = useMemo(() => <Export onExport={() => downloadCSV(dataTables)} />, [dataTables]);

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
      <Filter onFilter={(e) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <DataTable
      columns={columns}
      data={dataFilter}
      actions={actionsMemo}
      pagination
      paginationResetDefaultPage={resetPaginationToggle}
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      persistTableHead
      progressPending={pending}
      striped
      highlightOnHover
    />
  );
}

export default App;
