import React, { useEffect, Fragment, useState } from "react";
import DataTable from 'react-data-table-component';
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as fishService from '../../services/fish';
import * as helper from '../../lib/helper';
import { v4 } from 'uuid';
import Swal from 'sweetalert2';

Modal.setAppElement('#__next')

const customStyles = {
	content: {
		background: 'none',
		border: 'none',
		padding: 0,
	},
	overlay: {
		background: 'rgba(0, 0, 0, 0.9)',
		zIndex: 100,
	},
}

export const FishTable = (props) => {
    const [state, setState] = useState({
        loading: false,
        searchText: '',
        commodity: '',
        province: '',
        city: '',
        size: '',
        price: '',
        uuid: '',
        formType: '',
    });

    const [provinsi, setProvince] = useState('');
    const [sizeDataList, setsizeDataList] = useState([])
    const [areaDataList, setareaDataList] = useState([])
    const [provinceDataList, setprovinceDataList] = useState([])
    const [cityDataList, setcityDataList] = useState([])
	const [modalIsOpen, setIsOpen] = useState(false)
	const [modalDeleteIsOpen, setDeleteIsOpen] = useState(false)

    useEffect(() => {
        fishService.getDataSize().then((response) => {
            if (response) {
                setsizeDataList(response);
            };
        });
    }, []);

    useEffect(() => {
        fishService.getDataArea().then((response) => {
            if (response) {
                const distinctDataArea = [...new Map(response.map(item => [item['province'], item])).values()];
                setprovinceDataList(distinctDataArea)
            };
        });
    }, []);

    useEffect(() => {
        fishService.getDataArea().then((response) => {
            if (response) {
                setareaDataList(response)
            };
        });
    }, []);

    function handleButtonEdit(data) { 
        filteredDataKota(data.area_provinsi)
        setState({
            ...state,
            uuid: data.uuid,
            commodity: data.komoditas,
            province: data.area_provinsi,
            city: data.area_kota,
            size: data.size,
            price: data.price
        })
        toggle()
    }

    function afterOpenModal() {
    }

    const toggle = () => {
		setIsOpen(!modalIsOpen)
	}

    const toggleDelete = () => {
		setDeleteIsOpen(!modalDeleteIsOpen)
	}

    function filteredDataKota(valueProvince) {
        const filteredData = areaDataList.filter(item => (item.province === valueProvince))
        setState({ ...state, province: valueProvince})
        setProvince(valueProvince)

        if (filteredData.length > 0) {
            setcityDataList(filteredData)
            setState({ ...state, city: filteredData[0].city })
        }
    }

    const handleChange = state => {
        // console.log('state', state.selectedRows);
    };

    function handleEdit() {
        const { uuid, commodity, city, size, price, formType } = state;
        const date = helper.getCurrentYear() + '/' + helper.getCurrentMonth() + '/' + helper.getCurrentDay()

        Swal.fire({
            title: 'Confirmation', 
            text: 'Are you sure want to submit ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5eead4',
            cancelButtonColor: '#fb7185',
            confirmButtonText: 'Setuju',
            cancelButtonText: 'Batal',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                setState({ ...state, loading: true })
                fishService.updateData({
                    komoditas: commodity,
                    area_provinsi: provinsi,
                    area_kota: city,
                    size: size,
                    price: price,
                    tgl_parsed: date + ' ' + helper.getCurrentTime(),
                    uuid: uuid
                }).then((response) => {
                    if (response) {
                        console.log(response)
                        Swal.fire({
                            title: "Success!",
                            text: "Data perikanan berhasil dirubah",
                            icon: "success"
                        })
                        .then((res) => {
                            if (res.value) {
                                setState({ ...state, loading: false })
                                toggle()
                            }
                        })
                    };
                });
            }
        });
    };

    function HandleDelete(data) {

        Swal.fire({
            title: 'Confirmation', 
            text: 'Apakah anda yakin akan menghapus data?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5eead4',
            cancelButtonColor: '#fb7185',
            confirmButtonText: 'Setuju',
            cancelButtonText: 'Batal',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                setState({ ...state, loading: true })
                fishService.deleteData({
                    uuid: data.uuid
                }).then((response) => {
                    if (response) {
                        Swal.fire({
                            title: "Success!",
                            text: "Data perikanan berhasil dihapus",
                            icon: "success"
                        })
                        .then((res) => {
                            if (res.value) {
                                setState({ ...state, loading: false })
                            }
                        })
                    };
                });
            }
        });
    };

    const columns = [
        {
            name: 'Komoditas',
            selector: row => row.komoditas,
            sortable: true,
        },
        {
            name: 'Provinsi',
            selector: row => row.area_provinsi,
            sortable: true,
        },
        {
            name: 'Kota',
            selector: row => row.area_kota,
            sortable: true,
        },
        {
            name: 'Ukuran',
            selector: row => row.size,
            sortable: true,
        },
        {
            name: 'Harga',
            selector: row => row.price,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (record) => <>
                <button className="mr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 py-2 px-5 focus:ring-slate-200 transition duration-150 ease-in-out hover:bg-slate-200 bg-slate-100 rounded text-teal-700 text-sm" onClick={() => {
                    handleButtonEdit(record);
                }}>Edit</button>
                <button className="mr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 py-2 px-5 focus:ring-red-200 transition duration-150 ease-in-out hover:bg-red-200 bg-red-100 rounded text-red-700 text-sm" onClick={() => {
                    HandleDelete(record);
                }}>Delete</button>
            </>,
            ignoreRowClick: true,
        },
    ];
    
	return (
		<>
            <div></div>
            <DataTable
                columns={columns}
                data={props.fish}
                pagination
                onSelectedRowsChange={handleChange}
            />
            <div className="container mx-auto">
				<Modal
					isOpen={modalIsOpen}
					onAfterOpen={afterOpenModal}
					onRequestClose={toggle}
					contentLabel="Example Modal"
					style={customStyles}
					className="h-full"
				>
                    <div className="py-12 transition duration-150 ease-in-out z-10 top-0 right-0 bottom-0 left-0">
                        <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
                            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                                <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-8">Edit data perikanan</h1>
                                <label className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Nama Komoditas</label>
                                <input value={state.commodity} onChange={ (e) => setState({ ...state, commodity: e.target.value }) } id="name" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Pilih komoditas ikan" />
                                <label className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Harga</label>
                                <div className="relative mb-5 mt-2">
                                    <div className="absolute text-gray-600 flex items-center px-4 border-r h-full">
                                        Rp
                                    </div>
                                    <input value={state.price} onChange={ (e) => setState({ ...state, price: e.target.value }) } id="email2" className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-16 text-sm border-gray-300 rounded border" placeholder="Harga ikan" />
                                </div>
                                <label className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Ukuran</label>
                                <select value={ state.size } onChange={ (e) => setState({ ...state, size: e.target.value }) } className="
                                    form-select 
                                    appearance-none
                                    block
                                    w-full
                                    px-3
                                    py-1.5
                                    mb-5
                                    mt-2
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding bg-no-repeat
                                    border border-solid border-gray-300
                                    rounded
                                    transition
                                    ease-in-out
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
                                >
                                    <option key={ 0 } value={ '' } disabled>- Pilih -</option>
                                    {
                                        sizeDataList.map((item, index) => {
                                            return <option key={ index+1 } value={ item.size }>{ item.size }</option>
                                        })
                                    }
                                </select>
                                {/* <input id="name" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Pilih ukuran ikan" /> */}
                                <label className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Area Provinsi</label>
                                <select value={ provinsi } onChange={ (e) => filteredDataKota(e.target.value) } className="
                                    form-select 
                                    appearance-none
                                    block
                                    w-full
                                    px-3
                                    py-1.5
                                    mb-5
                                    mt-2
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding bg-no-repeat
                                    border border-solid border-gray-300
                                    rounded
                                    transition
                                    ease-in-out
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
                                >
                                    <option key={ 0 } value={ '' } disabled>- Pilih -</option>
                                    {
                                        provinceDataList.map((item, index) => {
                                            return <option key={ index+1 } value={ item.province }>{ item.province }</option>
                                        })
                                    }
                                </select>
                                <label className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Area Kota</label>
                                <select value={ state.city } onChange={ (e) => setState({ ...state, city: e.target.value }) } className="
                                    form-select 
                                    appearance-none
                                    block
                                    w-full
                                    px-3
                                    py-1.5
                                    mb-5
                                    mt-2
                                    text-base
                                    font-normal
                                    text-gray-700
                                    bg-white bg-clip-padding bg-no-repeat
                                    border border-solid border-gray-300
                                    rounded
                                    transition
                                    ease-in-out
                                    focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example"
                                >
                                    <option key={ 0 } value={ '' } disabled>- Pilih -</option>
                                    {
                                        cityDataList.map((item, index) => {
                                            return <option key={ index+1 } value={ item.city }>{ item.city }</option>
                                        })
                                    }
                                </select>
                                <div className="flex items-center justify-end w-full">
                                    <button className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 mr-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm" onClick={toggle}>Batal</button>
                                    <button onClick={ handleEdit } text={ state.formType === "add" ? 'Submit' : 'Save Changes' } className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm">Edit</button>
                                </div>
                                <button className="cursor-pointer h-8 w-8 absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" onClick={toggle} aria-label="close modal" role="button">
                                    <FontAwesomeIcon icon={'times'} />
                                </button>
                            </div>
                        </div>
                    </div>
				</Modal>
			</div>
        </>
	)
}