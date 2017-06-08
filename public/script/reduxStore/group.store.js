import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    list: [],
    listtable:[],
    data: {}
}
export function groupReducer(state = initialState, action) {
    switch (action.type) {
        case 'GROUP_GET_DATA':
            return Object.assign({}, state, { list: action.payload });
        case 'GROUP_GET_ID':
            return Object.assign({}, state, { data: action.payload });
        case 'GROUP_GET_LIST_TABLE':
            return Object.assign({}, state, { listtable: action.payload });
        case 'GROUP_CLEAR_SELECT':
            return Object.assign({}, state, { data: {} });
        default:
            return state
    }
}
export function groupAction(store) {
    return [commonAction(),
    {
        GROUP_GET_DATA: function () {
            axios.get('./group')
                .then(function (response) {
                    store.dispatch({ type: 'GROUP_GET_DATA', payload: response.data })
                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                });
        },
        GROUP_GET_LIST_TABLE: function () {
            axios.get('./group/table')
                .then(function (response) {
                    store.dispatch({ type: 'GROUP_GET_LIST_TABLE', payload: response.data })
                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                });
        },
        GROUP_GET_ID: function (id) {
            axios.get('./group/id/' + id)
                .then(function (response) {
                    store.dispatch({ type: 'GROUP_GET_ID', payload: response.data })
                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                });
        },
        GROUP_INSERT: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        // console.log(data);
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.post('./group/insert', data)
                            .then((response) => {
                                // console.log("success");
                                // console.log(response);
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                            this.GROUP_GET_DATA();
                                            this.GROUP_CLEAR_SELECT();
                                        }
                                    });
                                }
                                else {
                                    this.fire('toast', {
                                        status: 'connectError', text: 'กลุ่มนี้มีอยู่แล้ว',
                                        callback: function () {
                                        }
                                    })
                                }
                            })
                    }
                }
            })
        },
        GROUP_EDIT: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        var newData = {
                            id: data.group_id,
                            group_name_th: data.group_name_th,
                            group_name_en: data.group_name_en,
                            table: data.table,
                            field_id: data.field_id,
                            name: data.name
                        }
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.put('./group/update', newData)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                            this.GROUP_GET_DATA();
                                            this.GROUP_GET_ID(newData.id);
                                            this.dispatchAction('BTN_SET_STATE', true);
                                        }
                                    });
                                }
                                else {
                                    this.fire('toast', {
                                        status: 'connectError', text: 'ธนาคารนี้มีอยู่แล้ว',
                                        callback: function () {
                                        }
                                    })
                                }
                            })
                    }
                }
            })
        },
        GROUP_DELETE: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการลบข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        this.fire('toast', { status: 'load' });
                        axios.delete('./group/delete/id/' + data)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'ลบข้อมูลสำเร็จ', callback: () => {
                                            this.GROUP_GET_DATA();
                                        }
                                    });
                                }
                            })
                    }
                }
            })
        },
        GROUP_CLEAR_SELECT: function () {
            store.dispatch({ type: 'GROUP_CLEAR_SELECT' })
        }
    }
    ]
}