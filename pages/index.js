import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, Fragment, useState } from "react";
import styles from '../styles/Home.module.css'
import { useDispatch, useSelector } from "react-redux";
import * as fishService from '../services/fish';
import { FishTable, FormModal } from '../components'

export default function Home() {

  const columns = [
    {
        name: 'Title',
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
  ];

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');

  const loadData = async () => {
    fishService.getDataSize().then((response) => {
      if (response) {
          setData(response)
      };
    });
  }

  const dispatch = useDispatch();
  const fishData = useSelector((state) => state.state.fishData);
  useEffect(() => {
    dispatch(fishService.getData());
  }, [dispatch]);

  const filteredItems = fishData.filter(
    item =>
      (item.komoditas && item.komoditas.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.area_kota && item.area_kota.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.area_provinsi && item.area_provinsi.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.price && item.price.toLowerCase().includes(searchText.toLowerCase())) ||
      (item.size && item.size.toLowerCase().includes(searchText.toLowerCase()))
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Efishery</title>
        <meta name="description" content="Efishery frontend react test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto">
        <div className='flex justify-start mt-10'>
          <Image
            src="/logo-retina-colored.png"
            alt="Picture of the author"
            layout="intrinsic"
            width={120}
            height={35}
          />
        </div>
        <div className="flex justify-end mb-3">
          <input onChange={ (e) => setSearchText(e.target.value) } id="name" className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal h-9 mr-3 flex items-center pl-3 text-sm border-gray-300 rounded border" placeholder="Cari disini" />
          <FormModal />
        </div>
        <FishTable fish={filteredItems} />
      </div>
    </div>
  )
}