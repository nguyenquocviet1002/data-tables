import React, { useEffect, useState } from "react";
import { getData } from '../../apis/tablesAPI';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, Filler } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

import './View.scss';

ChartJS.register(ArcElement, LineElement, PointElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, Filler);

const removeDuplicate = array => array.filter((item, index) => { return array.indexOf(item) === index });

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
            display: true,
            text: 'Thống kê hồ sơ',
            font: {
                size: 21,
            }
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
        }
    },
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Thống kê hồ sơ theo tháng',
            font: {
                size: 20,
            }
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
        }
    },
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Thống kê hồ sơ được nhận',
            font: {
                size: 20,
            }
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
        }
    },
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Thống kê hồ sơ đã hủy',
            font: {
                size: 20,
            }
        },
    },
};


const View = () => {
    const [dataTables, setDataTables] = useState([]);

    // get data
    useEffect(() => {
        getData()
            .then(res => res.json())
            .then(
                data => {
                    const dataFinal = data.body.filter(item => item.name !== '');
                    setDataTables(dataFinal);
                },
                error => console.log(error),
            );
    }, []);

    const allDesc = dataTables.map(item => item.description);
    const descNoDuplicate = removeDuplicate(allDesc);
    const dataArrPie = [];

    descNoDuplicate.map(item => {
        const descCount = allDesc.filter(itemDesc => itemDesc === item)
        const itemArrDesc = {
            label: item,
            amount: descCount.length,
        }
        dataArrPie.push(itemArrDesc);
        return true;
    });

    const dataPie = {
        labels: dataArrPie.map(row => row.label),
        datasets: [
            {
                data: dataArrPie.map(row => row.amount),
                backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#ff9f40', '#9966ff'],
                borderWidth: 1,
                hoverOffset: 5,
            },
        ],
    };

    const dataDateFormat = [];
    const dateAllFormat = [];
    dataTables.map((item, index) => {
        const newItem = { ...dataTables[index], created: `${new Date(item.created).getMonth() + 1}/${new Date(item.created).getFullYear()}` };
        const newItemDate = `${new Date(item.created).getMonth() + 1}/${new Date(item.created).getFullYear()}`;
        dataDateFormat.push(newItem);
        dateAllFormat.push(newItemDate);
        return true;
    });
    const dateLabel = removeDuplicate(dateAllFormat).slice(-5);

    const dataArrLine = [];
    const dataArrBar1 = [];
    const dataArrBar2 = [];
    dateLabel.map(item => {
        const dataFilterDate = dataDateFormat.filter(itemNew => itemNew.created === item);
        const dataFilterDesc1 = dataFilterDate.filter(itemNew => itemNew.description === 'Đã được nhận');
        const dataFilterDesc2 = dataFilterDate.filter(itemNew => itemNew.description === 'Đã hủy');

        const itemDataLine = {
            amountAll: dataFilterDate.length,
        }
        const itemDataBar1 = {
            amountAll: dataFilterDate.length,
            amountFilter: dataFilterDesc1.length,
        }
        const itemDataBar2 = {
            amountAll: dataFilterDate.length,
            amountFilter: dataFilterDesc2.length
        }
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
                data: dataArrLine.map(row => row.amountAll),
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
                data: dataArrBar1.map(row => row.amountFilter),
                backgroundColor: ' rgb(75, 192, 192, 0.8)',
            },
            {
                label: 'Tất cả',
                data: dataArrBar1.map(row => row.amountAll),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const dataBar2 = {
        labels: dateLabel,
        datasets: [
            {
                label: 'Đã hủy',
                data: dataArrBar2.map(row => row.amountFilter),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Tất cả',
                data: dataArrBar2.map(row => row.amountAll),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }

    const dataComponentTable = dataTables.filter(item => item.description === 'Chưa phỏng vấn');
    // data sort date
    const dataSort = dataComponentTable.sort((a, b) => {
        return new Date(a.created).getTime() -
            new Date(b.created).getTime()
    }).reverse();

    const TableComponent = () => {
        return (
            <div className="box__inner">
                {dataSort.slice(0, 10).map((item, index) => (
                    <div key={index} className={index % 2 !== 0 ? "box__itemName bg_gray" : "box__itemName"}>{item.name} - {item.position}</div>
                ))}
            </div>
        )
    }

    return (
        <div className="area__report">
            <div className="box__report">
                <div className="report__item"><Pie options={optionsPie} data={dataPie} /></div>
                <div className="report__item"><Line options={optionsLine} data={dataLine} /></div>
                <div className="report__item"><Bar options={optionsBar1} data={dataBar1} /></div>
                <div className="report__item"><Bar options={optionsBar2} data={dataBar2} /></div>
            </div>
            <div className="box__name">
                <div className="box__head">Hồ sơ chưa phỏng vấn</div>
                <TableComponent />
            </div>
        </div>
    )
}

export default View