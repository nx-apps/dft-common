import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    list: [],
    data: {}
}
export function reportReducer(state = initialState, action) {
    switch (action.type) {
        case 'REPORT_GET_LIST':
            return Object.assign({}, state, { list: action.payload });
        case 'REPORT_SELECT':
            return Object.assign({}, state, { data: action.payload });
        default:
            return state
    }
}
export function reportAction(store) {
    return [commonAction(),
    {
        REPORT_GET_LIST: function (val) {

            axios.get('./report/report', {
                params: {
                    month: val.month,
                    year: val.selectYear,
                    quota: val.quota || true,
                    type_rice_id: val.type_rice_id
                }
            })
                .then(function (response) {
                    store.dispatch({ type: 'REPORT_GET_LIST', payload: response.data })
                }.bind(this))
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        REPORT_SELECT: function (id) {
            axios.get('./report/report_SelectOnly?id=' + id)
                .then(function (response) {
                    store.dispatch({ type: 'REPORT_SELECT', payload: response.data })
                    this.$$('nylon-panel-right').open();
                    // console.log('success!!');
                    // console.log(response.data);
                }.bind(this))
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        REPORT_INSERT: function (data) {
            this.fire('toast', { status: 'load' });
            axios.post('./report/report', data)
                .then(function (response) {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: function () {
                            console.log('success');
                            console.log(response.data);
                        }.bind(this)
                    });
                }.bind(this))
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        REPORT_UPDATE: function (data) {
            this.fire('toast', { status: 'load' });
            axios.put('./report/report', data)
                .then(function (response) {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: function () {
                            console.log('success');
                            console.log(response.data);
                        }.bind(this)
                    });
                }.bind(this))
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        REPORT_DELETE: function (id) {
            this.fire('toast', { status: 'load' });
            axios.delete('./report/report/'+id)
                .then(function (response) {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: function () {
                            console.log('success');
                            console.log(response.data);
                        }.bind(this)
                    });
                }.bind(this))
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        }
    }
    ]
}