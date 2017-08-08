import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    list: [],
    data: { hamonize_year: new Date().getFullYear() }
}
export function hamonizeReducer(state = initialState, action) {
    switch (action.type) {
        case 'HAMONIZE_GET_DATA':
            return Object.assign({}, state, { list: action.payload });
        case 'HAMONIZE_GET_ID':
            return Object.assign({}, state, { data: action.payload });
        case 'CLEAR_DATA':
            return Object.assign({}, state, { data: { hamonize_year: new Date().getFullYear() } });
        default:
            return state
    }
}
export function hamonizeAction(store) {
    return [commonAction(),
    {
        HAMONIZE_GET_DATA: function () {
            axios.get('./hamonize')
                .then(function (response) {
                    // response.data.map((item) => {
                    //     item.use = false,
                    //         item.check = false
                    //     return item
                    // })
                    store.dispatch({ type: 'HAMONIZE_GET_DATA', payload: response.data })
                })
                .catch(function (error) {
                    console.log('error');
                    //console.log(error);
                });
        },
        HAMONIZE_GET_ID: function (id) {
            axios.get('./hamonize/id/' + id)
                .then(function (response) {
                    store.dispatch({ type: 'HAMONIZE_GET_ID', payload: response.data })
                })
                .catch(function (error) {
                    console.log('error');
                    //console.log(error);
                });
        },
        HAMONIZE_INSERT: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        var newData = {
                            // id: data.hamonize_id,
                            hamonize_code: data.hamonize_code,
                            hamonize_en: data.hamonize_en,
                            hamonize_en2: data.hamonize_en2,
                            hamonize_th: data.hamonize_th,
                            hamonize_th2: data.hamonize_th2,
                            hamonize_year: Number(data.hamonize_year)
                        }
                        // console.log(newData);
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.post('./hamonize/insert', newData)
                            .then((response) => {
                                this.fire('toast', {
                                    status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                        this.HAMONIZE_GET_DATA();
                                        this.CLEAR_DATA();
                                    }
                                });
                            })
                    }
                }
            })
        },
        HAMONIZE_EDIT: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        var newData = {
                            id: data.hamonize_id,
                            hamonize_code: data.hamonize_code,
                            hamonize_en: data.hamonize_en,
                            hamonize_en2: data.hamonize_en2,
                            hamonize_th: data.hamonize_th,
                            hamonize_th2: data.hamonize_th2,
                            hamonize_year: Number(data.hamonize_year)
                        }
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.put('./hamonize/update', newData)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                            this.HAMONIZE_GET_DATA();
                                            this.HAMONIZE_GET_ID(newData.id);
                                            this.dispatchAction('BTN_SET_STATE', true);
                                        }
                                    });
                                }
                                else {
                                    this.fire('toast', {
                                        status: 'connectError', text: 'ข้าวชนิดนี้มีอยู่แล้ว',
                                        callback: function () {
                                        }
                                    })
                                }
                            })
                    }
                }
            })
        },
        HAMONIZE_DELETE: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการลบข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        this.fire('toast', { status: 'load' });
                        axios.delete('./hamonize/delete/id/' + data)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'ลบข้อมูลสำเร็จ', callback: () => {
                                            this.HAMONIZE_GET_DATA();
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