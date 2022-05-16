import { useRef, useEffect } from 'react';

export const numberFormat = (value, delimiter) => {
    return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, delimiter);
}

export const dateParser = (date) => {
    const result = new Date(date)
    const month = monthList()
    const parsedDate = result.getDate() + ' ' +  month[result.getMonth()].long + ' ' + result.getFullYear()
    const parsedTime = 
        ((result.getHours() < 10 ? '0' : '') + result.getHours()) + ':' + 
        ((result.getMinutes() < 10 ? '0' : '') + result.getMinutes()) + ':' + 
        ((result.getSeconds() < 10 ? '0' : '') + result.getSeconds())

    return parsedDate + ' ' + parsedTime
}

export const monthList = () => {

    const months = [
        {
            no: 1,
            short: "Jan",
            long: "January",
            number: '01'
        },
        {
            no: 2,
            short: "Feb",
            long: "February",
            number: '02'
        },
        {
            no: 3,
            short: "Mar",
            long: "March",
            number: '03'
        },
        {
            no: 4,
            short: "Apr",
            long: "April",
            number: '04'
        },
        {
            no: 5,
            short: "May",
            long: "May",
            number: '05'
        },
        {
            no: 6,
            short: "Jun",
            long: "June",
            number: '06'
        },
        {
            no: 7,
            short: "Jul",
            long: "July",
            number: '07'
        },
        {
            no: 8,
            short: "Aug",
            long: "August",
            number: '08'
        },
        {
            no: 9,
            short: "Sep",
            long: "September",
            number: '09'
        },
        {
            no: 10,
            short: "Oct",
            long: "October",
            number: '10'
        },
        {
            no: 11,
            short: "Nov",
            long: "November",
            number: '11'
        },
        {
            no: 12,
            short: "Dec",
            long: "December",
            number: '12'
        }
    ]

    return months
}

export const yearList = (start, end) => {

    let years = []

    for (let i = start; i <= end; i++) {
        years.push(i)
    }

    return years
}

export const getCurrentYear = () => {

    const date = new Date()
    const curYear = date.getFullYear()

    return curYear
}

export const getCurrentMonth = () => {

    const date = new Date()
    const curMonth = date.getMonth()

    return (curMonth.toString.length < 2 ? '0' + (curMonth + 1) : (curMonth + 1))
}

export const getCurrentDay = () => {

    const date = new Date()
    const curDay = date.getDate()

    return (curDay.toString().length < 2 ? '0' + curDay : curDay)
}

export const getCurrentDate = () => {

    const date = new Date()

    return (date)
}

export const getCurrentTime = () => {

    const date = new Date()

    return (date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds())
}

export const isEmpty = (object) => {

    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}

export const useIsMount = () => {
    
    const isMountRef = useRef(true);

    useEffect(() => {
        isMountRef.current = false;
    }, []);

    return isMountRef.current;
};

export const formatMonth = (inputMonth) => {

    const month = inputMonth.toString().toLowerCase().trim()
    let result = ''

    switch(month) {
        case 'january' : 
            result = '01'
        break;
        case 'february' : 
            result = '02'
        break;
        case 'march' : 
            result = '03'
        break;
        case 'april' : 
            result = '04'
        break;
        case 'may' :
            result = '05'
        break;
        case 'june' : 
            result = '06'
        break;
        case 'july' :
            result = '07'
        break;
        case 'august' :
            result = '08'
        break;
        case 'september' :
            result = '09'
        break;
        case 'october' :
            result = '10'
        break;
        case 'november' :
            result = '11'
        break;
        case 'december' :
            result = '12'
        break;
        default :
            result = inputMonth
        break;
    }

    return result;
}