import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    ordinal: [],
    data: []
}
export function amountReducer(state = initialState, action) {
    switch (action.type) {
        case 'AMOUNT_GET_ORDINAL':
            return Object.assign({}, state, { ordinal: action.payload });
        case 'AMOUNT_GET_DATA':
            return Object.assign({}, state, { data: action.payload });
        default:
            return state
    }
}
export function amountAction(store) {
    return [commonAction(),
    {
        AMOUNT_GET_ORDINAL: function (year, typeRice) {
            axios.get('./amount/amountorinal', {
                params: {
                    year: year,
                    type_rice_id: typeRice
                }
            })
                .then(function (response) {
                    store.dispatch({ type: 'AMOUNT_GET_ORDINAL', payload: response.data })
                }.bind(this))
                .catch(function (error) {
                    console.log('error');
                    console.log(error);
                }.bind(this));
        },
        AMOUNT_GET_DATA: function (year, typeRice, ordinal) {
            axios.get('./amount/amount', {
                params: {
                    year: year,
                    type_rice_id: typeRice,
                    ordinal: ordinal
                }
            })
                .then(function(response){
                    store.dispatch({ type: 'AMOUNT_GET_DATA', payload: response.data })
                })
                .catch(function(error){
                    console.log('error');
                    console.log(error);
                });
        },
        AMOUNT_UPDATE: function (data) {
            axios.put('./amount/amount', data)
                .then(function(response){
                    console.log('success!!');
                    console.log(response.data);
                })
                .catch(function(error){
                    console.log('error');
                    console.log(error);
                });
        }
    }
    ]
}



  // _getAllocate:function(){
            //   // console.log(this.selectQuotaYear,this.selectTypeRice,this.selectQuotaOrdinal)
            //   var stat = Polymer.dom(this.root).querySelectorAll('.searchAllocate').map((item)=>{
            //     return item.validate();
            //   });
            //   const chkStat = function(stat){
            //     return stat == true;
            //   }
            //   if(stat.every(chkStat) == true){
            //      this.fire('toast',{status:'load'});
            //     axios.get('./amount/amount',{
            //       params:{
            //         year:this.selectQuotaYear,
            //         type_rice_id:this.selectTypeRice,
            //         ordinal:this.selectQuotaOrdinal
            //       }
            //     })
            //     .then((response)=>{
            //         this.dataAllocate = response.data;
            //         console.log('..',this.dataAllocate);
            //         this.fire('toast',{status:'success',
            //         callback:()=>{
            //           this.active = false;
            //         }});

            //     })
            //     .catch((error)=>{
            //         console.log(error);
            //     });
            //   }

            //  },

                //  _putData:function(e){
            //     this.fire('toast',{status:'load'});
            //     axios.put('/amount/amount',e.detail)
            //     .then((response)=>{
            //       console.log("success");
            //       // this.textToast = 'แก้ไขข้อมูลสำเร็จ';
            //       console.log(response);
            //       this.fire('toast',{status:'success',
            //       text:'แก้ไขข้อมูลสำเร็จ',
            //       callback:function(){

            //       }
            //       });
            //        this.$$("panel-right").close();
            //       //this._getYear();
            //       this._getAllocate();
            //       // this._getDatalist(this.selectYear);
            //     })
            //     .catch((error)=>{
            //       console.log("error");
            //       console.log(error);
            //     });
            //  }