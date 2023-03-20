import React, { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import getData from './apis/tablesAPI';
import { downloadCSV } from './utils/convertToCSV';
import Export from './components/Export/Export';
import Filter from './components/Search/Search';

function App() {

  const [dataTables, setDataTables] = useState([]);

  useEffect(() => {
    getData()
      .then((res) => res.json())
      .then(
        (data) => setDataTables(data),
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
      selector: (row) => row.linkCV,
    },
    {
      name: 'Trạng thái',
      selector: (row) => row.status,
    },
  ];

  const actionsMemo = useMemo(() => <Export onExport={() => downloadCSV(dataTables)} />, [dataTables]);

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const filteredItems = dataTables.filter(
    (item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredItems2 = dataTables.filter(
    (item) => item.phoneNumber && item.phoneNumber.includes(filterText),
  );
  const filteredItems3 = dataTables.filter(
    (item) => item.email && item.email.toLowerCase().includes(filterText.toLowerCase()),
  );
  const filteredItems4 = dataTables.filter(
    (item) => item.positionApply && item.positionApply.toLowerCase().includes(filterText.toLowerCase()),
  );

  let datanew = [...filteredItems, ...filteredItems2, ...filteredItems3, ...filteredItems4];

  const removeDuplicates = (array) => {
    return array.filter((item, index) => array.indexOf(item) === index);
  };
  let newData = removeDuplicates(datanew);

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
      data={newData}
      actions={actionsMemo}
      pagination
      paginationResetDefaultPage={resetPaginationToggle}
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      persistTableHead
    />
  );
}

export default App;
