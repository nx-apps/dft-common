import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    list: [],
    data: {},
    portSearch:[]
}
export function portReducer(state = initialState, action) {
    switch (action.type) {
        case 'PORT_GET_DATA':
            return Object.assign({}, state, { list: action.payload });
        case 'PORT_GET_ID':
            return Object.assign({}, state, { data: action.payload });
        case 'PORT_GET_SEARCH':
            return Object.assign({}, state, { portSearch: action.payload });
        case 'CLEAR_DATA':
            return Object.assign({}, state, { data: {} });
        default:
            return state
    }
}
export function portAction(store) {
    return [commonAction(),
    {
        PORT_GET_DATA: function () {
            axios.get('./port')
                .then(function (response) {
                    store.dispatch({ type: 'PORT_GET_DATA', payload: response.data })
                })
                .catch(function (error) {
                    // console.log('error');
                    //console.log(error);
                });
        },
        PORT_GET_ID: function (id) {
            axios.get('./port/id/' + id)
                .then(function (response) {
                    // console.log(response.data);
                    store.dispatch({ type: 'PORT_GET_ID', payload: response.data })
                })
                .catch(function (error) {
                    // console.log('error');
                    //console.log(error);
                });
        },
        PORT_GET_SEARCH: function (data) {
            axios.get('./port/search?port_name=' + data.port_name + '&country_id=' + data.country_id)
                .then(function (response) {
                    // console.log(response.data);
                    response.data.map((item)=>{
                        item.text =item.port_name
                        item.value = item.port_name
                        item.port_id = item.id
                        return item
                    })
                    store.dispatch({ type: 'PORT_GET_SEARCH', payload: response.data })
                })
                .catch(function (error) {
                    // console.log('error');
                    //console.log(error);
                });
        },
        PORT_INSERT: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการเพิ่มข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        var newData = {
                            id: data.port_id,
                            port_code: data.port_code,
                            port_name: data.port_name,
                            country_id: data.country_id
                        }
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.get('./check/duplicate?table=port&field=id&value=' + data.port_id)
                            .then((response) => {
                                if (response.data == 0) {
                                    this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                                    axios.post('./port/insert', newData)
                                        .then((response) => {
                                            // console.log("success");
                                            // console.log(response);
                                            if (response.data.result == true) {
                                                this.fire('toast', {
                                                    status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                                        this.PORT_GET_DATA();
                                                        this.CLEAR_DATA();
                                                    }
                                                });
                                            }
                                            else {
                                                this.fire('toast', {
                                                    status: 'connectError', text: 'ท่าเรือนี้มีอยู่แล้ว',
                                                    callback: function () {
                                                    }
                                                })
                                            }
                                        })
                                }
                                else {
                                    this.fire('toast', {
                                        status: 'connectError', text: 'ท่าเรือนี้มีอยู่แล้ว',
                                        callback: function () {
                                        }
                                    })
                                }
                            })

                        // axios.post('./port/insert', newData)
                        //     .then((response) => {
                        //         // console.log("success");
                        //         // console.log(response);
                        //         if (response.data.result == true) {
                        //             this.fire('toast', {
                        //                 status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                        //                     this.PORT_GET_DATA();
                        //                     this.CLEAR_DATA();
                        //                 }
                        //             });
                        //         }
                        //         else {
                        //             this.fire('toast', {
                        //                 status: 'connectError', text: 'ท่าเรือนี้มีอยู่แล้ว',
                        //                 callback: function () {
                        //                 }
                        //             })
                        //         }
                        //     })
                    }
                }
            })
        },
        PORT_EDIT: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการแก้ไขข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        var newData = {
                            id: data.port_id,
                            port_code: data.port_code,
                            port_name: data.port_name,
                            country_id: data.country_id
                        }

                        console.log(data);
                        console.log(this.data);
                        this.fire('toast', { status: 'load', text: 'กำลังบันทึกข้อมูล...' })
                        axios.put('./port/update', newData)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'บันทึกสำเร็จ', callback: () => {
                                            this.PORT_GET_DATA();
                                            this.PORT_GET_ID(newData.id);
                                            this.dispatchAction('BTN_SET_STATE', true);
                                        }
                                    });
                                }
                                else {
                                    this.fire('toast', {
                                        status: 'connectError', text: 'ท่าเรือนี้มีอยู่แล้ว',
                                        callback: function () {
                                        }
                                    })
                                }
                            })
                    }
                }
            })
        },
        PORT_DELETE: function (data) {
            this.fire('toast', {
                status: 'openDialog',
                text: 'ต้องการลบข้อมูลใช่หรือไม่ ?',
                confirmed: (result) => {
                    if (result == true) {
                        this.fire('toast', { status: 'load' });
                        axios.delete('./port/delete/id/' + data)
                            .then((response) => {
                                if (response.data.result == true) {
                                    this.fire('toast', {
                                        status: 'success', text: 'ลบข้อมูลสำเร็จ', callback: () => {
                                            this.PORT_GET_DATA();
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