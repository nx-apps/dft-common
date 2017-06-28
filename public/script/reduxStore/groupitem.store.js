import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    list: [],
    data: {  }
}
export function groupItemReducer(state = initialState, action) {
    switch (action.type) {
        case 'GROUP_ITEM_GET_DATA':
            return Object.assign({}, state, { list: action.payload });
        case 'GROUP_ITEM_GET_ID':
            return Object.assign({}, state, { data: action.payload });
        case 'GROUP_ITEM_CLEAR_SELECT':
            return Object.assign({}, state, { data: { } });
        default:
            return state
    }
}
export function groupItemAction(store) {
    return [commonAction(),
    {
        GROUP_ITEM_GET_DATA: function (data) {
            axios.get('./groupItem?group_id=' + data)
                .then(function (response) {
                    store.dispatch({ type: 'GROUP_ITEM_GET_DATA', payload: response.data })
                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                });
        },
        GROUP_ITEM_GET_ID: function (id) {
            axios.get('./groupItem/id/' + id)
                .then(function (response) {
                    store.dispatch({ type: 'GROUP_ITEM_GET_ID', payload: response.data })
                })
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                });
        },
        GROUP_ITEM_INSERT: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        // console.log(data);
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.post('./groupItem/insert', data)
                            .then((response) => {
                                // console.log("success");
                                // console.log(response);
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                            this.GROUP_ITEM_GET_DATA(data.table);
                                            this.GROUP_ITEM_CLEAR_SELECT();
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
        GROUP_ITEM_EDIT: function (data, dataseleted) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        var newData = {
                            id: data.sub_group_id,
                            code:data.code,
                            group_id: data.group_id,
                            name_th: data.name_th,
                            name_en: data.name_en,
                            table: data.table,
                            sub: data.sub
                        }
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.put('./groupItem/update', newData)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                            this.GROUP_ITEM_GET_DATA(dataseleted.table);
                                            this.GROUP_ITEM_GET_ID(newData.id);
                                            this.dispatchAction('BTN_SET_STATE', true);
                                        }
                                    });
                                }
                                else {
                                    this.fire('toast', {
                                        status: 'connectError', text: 'มีอยู่แล้ว',
                                        callback: function () {
                                        }
                                    })
                                }
                            })
                    }
                }
            })
        },
        GROUP_ITEM_DELETE: function (data, dataseleted) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการลบข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        this.fire('toast', { status: 'load' });
                        axios.delete('./groupItem/delete/id/' + data)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'ลบข้อมูลสำเร็จ', callback: () => {
                                            this.GROUP_ITEM_GET_DATA(dataseleted.table);
                                        }
                                    });
                                } else {
                                    this.fire('toast', {
                                        status: 'connectError', text: 'ไม่สามารถลบได้',
                                        callback: function () {
                                        }
                                    })
                                }
                            })
                    }
                }
            })
        },
        GROUP_ITEM_CLEAR_SELECT: function () {
            store.dispatch({ type: 'GROUP_ITEM_CLEAR_SELECT' })
        }
    }
    ]
}