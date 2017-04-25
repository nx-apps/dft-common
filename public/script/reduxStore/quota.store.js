import axios from '../axios'
import { commonAction } from '../config'


const initialState = {
    list: [],
    data: {
        quantity: [],
    }
}

export function quotaReducer(state = initialState, action) {
    switch (action.type) {
        case 'QUOTA_GET_QUOTA':
            return Object.assign({}, state, { list: action.payload });
        case 'QUOTA_SELECT':
            return Object.assign({}, state, { data: action.payload });
        default:
            return state;
    }
}

export function quotaAction(store) {
    return [commonAction(),
    {   
        QUOTA_GET_QUOTA: function (year) {
            // store.getState().commonData.selectYear;
            // console.log(store.getState().commonData.selectYear);
            this.fire('toast', { status: 'load' });
            axios.get('./quota/quota/year/' + year)
                .then(function(response) {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: function () {
                            store.dispatch({ type: 'QUOTA_GET_QUOTA', payload: response.data })
                        }.bind(this)
                    });


                }.bind(this))
                .catch(function(error){
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        QUOTA_INSERT: function (data) {
            this.fire('toast', { status: 'load' });
            axios.post('./quota/quota', data)
                .then(function(response) {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: function () {
                            this.dispatchAction('COMMON_DATA_GET_YEAR');
                        }.bind(this)
                    });

                }.bind(this))
                .catch((error) => {
                    console.log('error');
                    console.log(error);
                });
        },
        QUOTA_SELECT: function (id) {
            axios.get('./quota/quota/id/'+id)
                .then(function(response){
                    this.$$('nylon-panel-right').open();
                    store.dispatch({ type: 'QUOTA_SELECT', payload: response.data })
                }.bind(this))
                .catch(function(error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        QUOTA_UPDATE: function (data) {
            this.fire('toast', { status: 'load' });
            axios.put('./quota/quota', data)
                .then(function(response) {
                    this.fire('toast', {
                        status: 'success', text: 'บันทึกสำเร็จ',
                        callback: function () {
                        }
                    });
                }.bind(this))
                .catch(function(error){
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        QUOTA_DELETE:function (id) {
            this.fire('toast',{status:'load'});
            axios.delete('./quota/quota/'+id)
            .then(function(response){
                this.fire('toast',{status:'success',text:'บันทึกสำเร็จ',
                  callback:function(){
                  }
                 });
            }.bind(this))
            .catch(function(error){
            console.log('error');
            console.log(error);
            }.bind(this));
        }
    }
    ]
}