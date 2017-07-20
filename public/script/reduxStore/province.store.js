import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    list: [],
    data: {}
}
export function provinceReducer(state = initialState, action) {
    switch (action.type) {
        case 'PROVINCE_GET_DATA':
            return Object.assign({}, state, { list: action.payload });
        case 'PROVINCE_GET_ID':
            return Object.assign({}, state, { data: action.payload });
        case 'CLEAR_DATA':
            return Object.assign({}, state, { data: {} });
        default:
            return state
    }
}
export function provinceAction(store) {
    return [commonAction(),
    {
        PROVINCE_GET_DATA: function () {
            axios.get('./province')
                .then(function (response) {
                    store.dispatch({ type: 'PROVINCE_GET_DATA', payload: response.data })
                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                });
        },
        PROVINCE_GET_ID: function (id) {
            axios.get('./province/id/'+id)
                .then(function (response) {
                    store.dispatch({ type: 'PROVINCE_GET_ID', payload: response.data })
                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                });
        },
        PROVINCE_INSERT: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        var newData = {
                            id: data.province_id,
                            province_name_th: data.province_name_th,
                            province_name_en: data.province_name_en,
                            zip_code: Number(data.zip_code)
                        }
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.post('./province/insert', newData)
                            .then((response) => {
                                // console.log("success");
                                // console.log(response);
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                            this.PROVINCE_GET_DATA();
                                            this.CLEAR_DATA();
                                        }
                                    });
                                }
                                else {
                                    this.fire('toast', {
                                        status: 'connectError', text: 'จังหวัดนี้มีอยู่แล้ว',
                                        callback: function () {
                                        }
                                    })
                                }
                            })
                    }
                }
            })
        },
        PROVINCE_EDIT: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        var newData = {
                            id: data.province_id,
                            province_name_th: data.province_name_th,
                            province_name_en: data.province_name_en,
                            zip_code: Number(data.zip_code)
                        }
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.put('./province/update', newData)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                            this.PROVINCE_GET_DATA();
                                            this.PROVINCE_GET_ID(newData.id);
                                            this.dispatchAction('BTN_SET_STATE',true);
                                        }
                                    });
                                }
                                else {
                                    this.fire('toast', {
                                        status: 'connectError', text: 'จังหวัดนี้มีอยู่แล้ว',
                                        callback: function () {
                                        }
                                    })
                                }
                            })
                    }
                }
            })
        },
        PROVINCE_DELETE: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการลบข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        this.fire('toast', { status: 'load' });
                        axios.delete('./province/delete/id/' + data)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'ลบข้อมูลสำเร็จ', callback: () => {
                                            this.PROVINCE_GET_DATA();
                                        }
                                    });
                                }
                            })
                    }
                }
            })
        },
        CLEAR_DATA: function () {
            store.dispatch({ type: 'CLEAR_DATA' })
        }
    }
    ]
}