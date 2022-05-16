import { useState, useEffect } from 'react'
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

export const FormModal = (props) => {
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

    console.log(areaDataList)

	const [searchResult, setSearchResult] = useState([])
	const [keywordValue, setKeywordValue] = useState('')
	const [modalIsOpen, setIsOpen] = useState(false)
	const [warningState, setWarningState] = useState(false)
	const [startCover, setStartCover] = useState(true)
	const [notFoundCover, setNotFoundCover] = useState(false)

	const toggle = () => {
		setIsOpen(!modalIsOpen)
	}

	function onChangeHandle(e) {
		setKeywordValue(e)
	}

	const onSubmitSearchHandle = (e) => {
		e.preventDefault()
		setSearchResult([])
		setWarningState(false)
		setStartCover(false)
		search_result = []
		let keyword = keywordValue.trim()
		if (keyword.length < 3) {
			setNotFoundCover(false)
			setWarningState(true)
			setStartCover(true)
			return false
		}
		if (keyword != '') {
		}
		setSearchResult(search_result)
		search_result.length < 1
			? setNotFoundCover(true)
			: setNotFoundCover(false)
	}

	function afterOpenModal() {}

    function filteredDataKota(valueProvince) {
        const filteredData = areaDataList.filter(item => (item.province === valueProvince))
        setProvince(valueProvince)

        if (filteredData.length > 0) {
            setcityDataList(filteredData)
            setState({ ...state, city: filteredData[0].city })
            // setState({ ...state, province: filteredData[0].city })
        }
    }

    function handleSubmit () {
        const { uuid, commodity, city, size, price, formType } = state;
        const date = helper.getCurrentYear() + '/' + helper.getCurrentMonth() + '/' + helper.getCurrentDay()

        Swal.fire({
            title: 'Confirmation', 
            text: 'Are you sure want to submit ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5867dd',
            cancelButtonColor: '#ed1c24',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                setState({ ...state, loading: true })
                fishService.createData({
                    komoditas: commodity,
                    area_provinsi: provinsi,
                    area_kota: city,
                    size: size,
                    price: price,
                    tgl_parsed: date + ' ' + helper.getCurrentTime(),
                    uuid: v4()
                }).then((response) => {
                    if (response) {
                        console.log(response)
                        Swal.fire({
                            title: "Success!",
                            text: "Data perikanan berhasil ditambahkan",
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

	return (
		<div>
            <button onClick={toggle} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm">
                Tambah data
            </button>
			{/* <div
				onClick={toggle}
				className="flex justify-between items-center px-4 w-full md:w-380 h-11 bg-white mx-auto cursor-pointer mb-16"
			>
				<p className="font-oswald text-size14 md:text-size16 text-gray_fortune-light mb-0">
					Search speaker, session, etc
				</p>
			</div> */}
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
                                <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-8">Tambah data perikanan</h1>
                                <label for="name" className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Nama Komoditas</label>
                                <input value={state.commodity} onChange={ (e) => setState({ ...state, commodity: e.target.value }) } id="name" className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Pilih komoditas ikan" />
                                <label for="email2" className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Harga</label>
                                <div className="relative mb-5 mt-2">
                                    <div className="absolute text-gray-600 flex items-center px-4 border-r h-full">
                                        Rp
                                    </div>
                                    <input value={state.price} onChange={ (e) => setState({ ...state, price: e.target.value }) } id="email2" className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-16 text-sm border-gray-300 rounded border" placeholder="Harga ikan" />
                                </div>
                                <label for="name" className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Ukuran</label>
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
                                <label for="name" className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Area Provinsi</label>
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
                                <label for="name" className="text-gray-800 text-sm font-semibold leading-tight tracking-normal">Area Kota</label>
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
                                {/* <label for="cvc" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">CVC</label>
                                <div className="relative mb-5 mt-2">
                                    <div className="absolute right-0 text-gray-600 flex items-center pr-3 h-full cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-info-circle" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z"></path>
                                            <circle cx="12" cy="12" r="9"></circle>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                            <polyline points="11 12 12 12 12 16 13 16"></polyline>
                                        </svg>
                                    </div>
                                    <input id="cvc" className="mb-8 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="MM/YY" />
                                </div> */}
                                <div className="flex items-center justify-end w-full">
                                    <button className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 mr-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm" onClick={toggle}>Batal</button>
                                    <button onClick={ handleSubmit } text={ state.formType === "add" ? 'Submit' : 'Save Changes' } className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm">Tambah</button>
                                </div>
                                <button className="cursor-pointer h-8 w-8 absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" onClick={toggle} aria-label="close modal" role="button">
                                    <FontAwesomeIcon icon={'times'} />
                                    {/* <svg  xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg> */}
                                </button>
                            </div>
                        </div>
                    </div>
				</Modal>
			</div>
		</div>
	)
}