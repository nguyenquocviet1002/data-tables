import React, { useEffect, useMemo, useState } from 'react';
import { getData } from '../../apis/tablesAPI';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
} from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

import './View.scss';

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  Filler,
);

const removeDuplicate = (array) =>
  array.filter((item, index) => {
    return array.indexOf(item) === index;
  });

const optionsPie = {
  responsive: true,
  aspectRatio: 1.8,
  layout: {
    padding: 30,
  },
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: false,
      text: 'Thống kê hồ sơ',
      font: {
        size: 21,
      },
    },
  },
};

const optionsLine = {
  responsive: true,
  layout: {
    padding: 20,
  },
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 10,
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: 'Thống kê hồ sơ theo tháng',
      font: {
        size: 20,
      },
    },
  },
};

const optionsBar1 = {
  responsive: true,
  layout: {
    padding: 20,
  },
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 10,
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: 'Thống kê hồ sơ được nhận',
      font: {
        size: 20,
      },
    },
  },
};

const optionsBar2 = {
  responsive: true,
  layout: {
    padding: 20,
  },
  scales: {
    y: {
      suggestedMin: 0,
      suggestedMax: 10,
    },
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
      text: 'Thống kê hồ sơ đã hủy',
      font: {
        size: 20,
      },
    },
  },
};

const View = () => {
  const [dataTables, setDataTables] = useState([]);
  const [month, setMonth] = useState(() => {
    return new Date().getMonth();
  });

  // get data
  useEffect(() => {
    getData()
      .then((res) => res.json())
      .then(
        (data) => {
          const dataFinal = data.body.filter((item) => item.name !== '');
          setDataTables(dataFinal);
        },
        (error) => console.log(error),
      );
  }, []);

  const date = new Date();
  const year = date.getFullYear();
  const firstDay = new Date(year, month, 1).getTime();
  const lastDay = new Date(year, month + 1, 0).getTime();

  const dataOnMonth = useMemo(
    () =>
      dataTables.filter((item) => {
        return firstDay < new Date(item.created).getTime() && new Date(item.created).getTime() < lastDay;
      }),
    [dataTables, firstDay, lastDay],
  );

  const allDesc = dataOnMonth.map((item) => item.description);
  const descNoDuplicate = removeDuplicate(allDesc);
  const dataArrPie = [];

  descNoDuplicate.map((item) => {
    const descCount = allDesc.filter((itemDesc) => itemDesc === item);
    const itemArrDesc = {
      label: item,
      amount: descCount.length,
    };
    dataArrPie.push(itemArrDesc);
    return true;
  });

  const dataPie = {
    labels: dataArrPie.map((row) => row.label),
    datasets: [
      {
        data: dataArrPie.map((row) => row.amount),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#ff9f40', '#9966ff'],
        borderWidth: 1,
        hoverOffset: 5,
      },
    ],
  };

  const dataDateFormat = [];
  const dateAllFormat = [];
  dataTables.map((item, index) => {
    const newItem = {
      ...dataTables[index],
      created: `${new Date(item.created).getMonth() + 1}/${new Date(item.created).getFullYear()}`,
    };
    const newItemDate = `${new Date(item.created).getMonth() + 1}/${new Date(item.created).getFullYear()}`;
    dataDateFormat.push(newItem);
    dateAllFormat.push(newItemDate);
    return true;
  });
  const dateLabel = removeDuplicate(dateAllFormat).slice(-5);

  const dataArrLine = [];
  const dataArrBar1 = [];
  const dataArrBar2 = [];
  dateLabel.map((item) => {
    const dataFilterDate = dataDateFormat.filter((itemNew) => itemNew.created === item);
    const dataFilterDesc1 = dataFilterDate.filter((itemNew) => itemNew.description === 'Đã được nhận');
    const dataFilterDesc2 = dataFilterDate.filter((itemNew) => itemNew.description === 'Đã hủy');

    const itemDataLine = {
      amountAll: dataFilterDate.length,
    };
    const itemDataBar1 = {
      amountAll: dataFilterDate.length,
      amountFilter: dataFilterDesc1.length,
    };
    const itemDataBar2 = {
      amountAll: dataFilterDate.length,
      amountFilter: dataFilterDesc2.length,
    };
    dataArrLine.push(itemDataLine);
    dataArrBar1.push(itemDataBar1);
    dataArrBar2.push(itemDataBar2);
    return true;
  });

  const dataLine = {
    labels: dateLabel,
    datasets: [
      {
        fill: true,
        label: 'Hồ sơ',
        data: dataArrLine.map((row) => row.amountAll),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const dataBar1 = {
    labels: dateLabel,
    datasets: [
      {
        label: 'Đã được nhận',
        data: dataArrBar1.map((row) => row.amountFilter),
        backgroundColor: ' rgb(75, 192, 192, 0.8)',
      },
      {
        label: 'Tất cả',
        data: dataArrBar1.map((row) => row.amountAll),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const dataBar2 = {
    labels: dateLabel,
    datasets: [
      {
        label: 'Đã hủy',
        data: dataArrBar2.map((row) => row.amountFilter),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Tất cả',
        data: dataArrBar2.map((row) => row.amountAll),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const dataComponentTable = dataTables.filter((item) => item.description === 'Chưa phỏng vấn');
  // data sort date
  const dataSort = dataComponentTable
    .sort((a, b) => {
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    })
    .reverse();

  // báo cáo số lượng hồ sơ của 1 tin
  const recruitmentAll = [];
  const valueRecruitment = [];
  const valueRecruitmentv1 = [];
  const authorAll = [];
  dataOnMonth.map((item) => {
    recruitmentAll.push(item.url);
    authorAll.push(item.author);
    return true;
  });
  const recruitment = removeDuplicate(recruitmentAll);
  const author = removeDuplicate(authorAll);
  recruitment.map((itemR) => {
    const recruitmentLength = dataOnMonth.filter((itemD) => {
      return itemD.url === itemR;
    });
    const recruitmentv1Length = dataOnMonth.filter((itemD) => {
      return itemD.url === itemR && itemD.description === 'Đã phỏng vấn';
    });
    valueRecruitment.push(recruitmentLength.length);
    valueRecruitmentv1.push(recruitmentv1Length.length);
    return true;
  });
  //

  // báo cáo số lượng hồ sơ trung bình/tin/chuyên viên tuyển dụng
  const avegareR = (dataOnMonth.length / recruitment.length).toFixed();
  const avegareA = (dataOnMonth.length / author.length).toFixed();
  //

  // số lượng hồ sơ đạt yêu cầu trung bình/tin
  const recruitmentv1 = dataOnMonth.filter((item) => item.description === 'Đã duyệt hồ sơ');
  const avegarev1 = (recruitmentv1.length / recruitment.length).toFixed();
  const avegarev1A = (recruitmentv1.length / author.length).toFixed();

  // số lượng ứng viên đến phỏng vấn trung bình/tin/chuyên viên tuyển dụng
  const recruitmentv2 = dataOnMonth.filter((item) => item.description === 'Đã phỏng vấn');
  const avegarev2 = (recruitment.length / recruitmentv2.length).toFixed();
  const avegarev2A = (recruitmentv2.length / author.length).toFixed();

  // số lượng ứng viên đạt trung bình/tin/cv tuyển dụng
  const recruitmentFinal = dataOnMonth.filter((item) => item.description === 'Đã được nhận');
  const avegareFinal = (recruitment.length / recruitmentFinal.length).toFixed();
  const avegarevFinal = (recruitmentFinal.length / author.length).toFixed();

  // số lượng ứng viên nhận việc/tin/chuyên viên tuyển dụng
  const recruitmentWork = dataOnMonth.filter((item) => item.description === 'Đã nhận việc');
  const avegareWork = (recruitment.length / recruitmentWork.length).toFixed();
  const avegarevWork = (recruitmentWork.length / author.length).toFixed();

  const TableComponent = () => {
    return (
      <div className="box__inner">
        {dataSort.slice(0, 10).map((item, index) => (
          <div key={index} className={index % 2 !== 0 ? 'box__itemName bg_gray' : 'box__itemName'}>
            {item.name} - {item.position}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="select__month">
        <label>Lựa chọn tháng</label>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          <option value="0">Tháng 1</option>
          <option value="1">Tháng 2</option>
          <option value="2">Tháng 3</option>
          <option value="3">Tháng 4</option>
          <option value="4">Tháng 5</option>
          <option value="5">Tháng 6</option>
          <option value="6">Tháng 7</option>
          <option value="7">Tháng 8</option>
          <option value="8">Tháng 9</option>
          <option value="9">Tháng 10</option>
          <option value="10">Tháng 11</option>
          <option value="11">Tháng 12</option>
        </select>
      </div>
      <div className="area__report">
        <div className="box__report">
          <div className="report__item">
            <p className="box__title">Thống kê hồ sơ tháng {month + 1}</p>
            {dataArrPie.length !== 0 ? (
              <Pie options={optionsPie} data={dataPie} />
            ) : (
              <div style={{ textAlign: 'center' }}>Chưa có dữ liệu</div>
            )}
          </div>
          <div className="report__item">
            <p className="box__title">Thống kê hồ sơ theo tháng</p>
            <Line options={optionsLine} data={dataLine} />
          </div>
          <div className="report__item">
            <p className="box__title">Thống kê hồ sơ được nhận</p>
            <Bar options={optionsBar1} data={dataBar1} />
          </div>
          <div className="report__item">
            <p className="box__title">Thống kê hồ sơ đã hủy</p>
            <Bar options={optionsBar2} data={dataBar2} />
          </div>
          <div className="report__item">
            <p className="box__title">Số lượng hồ sơ thu được/tin</p>
            {recruitment.length !== 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Tin</th>
                    <th>Số lượng hồ sơ</th>
                  </tr>
                </thead>
                <tbody>
                  {recruitment.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {item ? (
                            <a href={item} target="_blank" rel="noreferrer">
                              {item}
                            </a>
                          ) : (
                            'Không có thông tin'
                          )}
                        </td>
                        <td>{valueRecruitment[index]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center' }}>Chưa có dữ liệu</div>
            )}
          </div>
          <div className="report__item">
            <p className="box__title">Số lượng ứng viên đến phỏng vấn</p>
            {recruitment.length !== 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Tin</th>
                    <th>Số lượng ứng viên</th>
                  </tr>
                </thead>
                <tbody>
                  {recruitment.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {item ? (
                            <a href={item} target="_blank" rel="noreferrer">
                              {item}
                            </a>
                          ) : (
                            'Không có thông tin'
                          )}
                        </td>
                        <td>{valueRecruitmentv1[index]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center' }}>Chưa có dữ liệu</div>
            )}
          </div>
        </div>
        <div className="box__name">
          <div className="box__widget">
            <div className="widget">
              <p className="widget__title">Số lượng hồ sơ trung bình/tin</p>
              <h3 className="widget__number">
                <span className="bold">{avegareR === 'Infinity' ? 0 : isNaN(avegareR) ? 0 : avegareR}</span>
                <span> / tin</span>
              </h3>
            </div>
            <div className="widget">
              <p className="widget__title">Số lượng hồ sơ trung bình/chuyên viên tuyển dụng</p>
              <h3 className="widget__number">
                <span className="bold">{avegareA === 'Infinity' ? 0 : isNaN(avegareA) ? 0 : avegareA}</span>
                <span> / chuyên viên</span>
              </h3>
            </div>
            <div className="widget">
              <p className="widget__title">Số lượng hồ sơ đạt yêu cầu trung bình/tin</p>
              <h3 className="widget__number">
                <span className="bold">{avegarev1 === 'Infinity' ? 0 : isNaN(avegarev1) ? 0 : avegarev1}</span>
                <span> / tin</span>
              </h3>
            </div>
            <div className="widget">
              <p className="widget__title">Số lượng hồ sơ đạt yêu cầu trung bình/chuyên viên tuyển dụng</p>
              <h3 className="widget__number">
                <span className="bold">{avegarev1A === 'Infinity' ? 0 : isNaN(avegarev1A) ? 0 : avegarev1A}</span>
                <span> / chuyên viên</span>
              </h3>
            </div>
            <div className="widget">
              <p className="widget__title">Số lượng ứng viên đến phỏng vấn trung bình/tin</p>
              <h3 className="widget__number">
                <span className="bold">{avegarev2 === 'Infinity' ? 0 : isNaN(avegarev2) ? 0 : avegarev2}</span>
                <span> / tin</span>
              </h3>
            </div>
            <div className="widget">
              <p className="widget__title">Số lượng ứng viên đến phỏng vấn trung bình/chuyên viên tuyển dụng</p>
              <h3 className="widget__number">
                <span className="bold">{avegarev2A === 'Infinity' ? 0 : isNaN(avegarev2A) ? 0 : avegarev2A}</span>
                <span> / chuyên viên</span>
              </h3>
            </div>
            <div className="widget">
              <p className="widget__title">Số lượng ứng viên đạt trung bình/tin</p>
              <h3 className="widget__number">
                <span className="bold">{avegareFinal === 'Infinity' ? 0 : isNaN(avegareFinal) ? 0 : avegareFinal}</span>
                <span> / tin</span>
              </h3>
            </div>
            <div className="widget">
              <p className="widget__title">Số lượng ứng viên đạt trung bình/cv tuyển dụng</p>
              <h3 className="widget__number">
                <span className="bold">
                  {avegarevFinal === 'Infinity' ? 0 : isNaN(avegarevFinal) ? 0 : avegarevFinal}
                </span>
                <span> / chuyên viên</span>
              </h3>
            </div>
            <div className="widget">
              <p className="widget__title">Số lượng ứng viên nhận việc/tin</p>
              <h3 className="widget__number">
                <span className="bold">{avegareWork === 'Infinity' ? 0 : isNaN(avegareWork) ? 0 : avegareWork}</span>
                <span> / tin</span>
              </h3>
            </div>
            <div className="widget">
              <p className="widget__title">Số lượng ứng viên nhận việc/chuyên viên tuyển dụng</p>
              <h3 className="widget__number">
                <span className="bold">{avegarevWork === 'Infinity' ? 0 : isNaN(avegarevWork) ? 0 : avegarevWork}</span>
                <span> / chuyên viên</span>
              </h3>
            </div>
          </div>
          <div className="box__table">
            <div className="box__head">Hồ sơ chưa phỏng vấn</div>
            <TableComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
