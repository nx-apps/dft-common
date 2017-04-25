import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    year: [],
    type_rice: [],
    selectYear: '',
    company: [],
    month: [
        {
            id: 1,
            name: 'มกราคม',
        },
        {
            id: 2,
            name: 'กุมภาพันธ์'
        },
        {
            id: 3,
            name: 'มีนาคม'
        },
        {
            id: 4,
            name: 'เมษายน'
        },
        {
            id: 5,
            name: 'พฤษภาคม'
        },
        {
            id: 6,
            name: 'มิถุนายน'
        },
        {
            id: 7,
            name: 'กรกฎาคม'
        },
        {
            id: 8,
            name: 'สิงหาคม'
        },
        {
            id: 9,
            name: 'กันยายน'
        },
        {
            id: 10,
            name: 'ตุลาคม'
        },
        {
            id: 11,
            name: 'พฤศจิกายน'
        },
        {
            id: 12,
            name: 'ธันวาคม'
        }
    ]
}
export function commonDataReducer(state = initialState, action) {
    switch (action.type) {
        case 'COMMON_DATA_GET_YEAR':
            return Object.assign({}, state, { year: action.payload });
        case 'COMMON_DATA_GET_TYPE_RICE':
            return Object.assign({}, state, { type_rice: action.payload });
        case 'COMMON_DATA_GET_COMPANY':
            return Object.assign({}, state, { company: action.payload });
        case 'COMMON_DATA_SET_YEAR':
            return Object.assign({}, state, { selectYear: action.payload });
        default:
            return state
    }
}
export function commonDataAction(store) {
    return [commonAction(),
    {
        COMMON_DATA_SET_YEAR: function (obj) {
            store.dispatch({ type: 'COMMON_DATA_SET_YEAR', payload: obj })
        },
        COMMON_DATA_GET_YEAR: function () {
            axios.get('./common/year')
                .then(function (response) {
                    store.dispatch({ type: 'COMMON_DATA_GET_YEAR', payload: response.data })
                }.bind(this))
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        COMMON_DATA_GET_TYPE_RICE: function () {
            axios.get('./common/type_rice')
                .then(function (response) {
                    store.dispatch({ type: 'COMMON_DATA_GET_TYPE_RICE', payload: response.data })
                }.bind(this))
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        COMMON_DATA_GET_COMPANY: function () {
            axios.get('./common/exporter')
                .then(function (response) {
                    store.dispatch({ type: 'COMMON_DATA_GET_COMPANY', payload: response.data })
                }.bind(this))
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        }
    }
    ]
}