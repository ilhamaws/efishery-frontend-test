import React, { useEffect, Fragment, useState } from "react";
import DataTable from 'react-data-table-component';

export const FishTable = (props) => {

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
    
	return (
		<>
            <div></div>
            <DataTable
                columns={columns}
                data={props.fish}
                pagination
            />
        </>
	)
}