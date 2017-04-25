import axios from '../axios'
import {commonAction} from '../config'

const intialState = {
    list:[]
}

export function calculateReducer(state = intialState, action){
    switch (action.type) {
        case 'CALCULATE_GET_DATA':
            return Object.assign({}, state, {list:action.payload})
            break;
        default:
            return state
            break;
    }
}

export function calculateAction(store){
    return [commonAction(),
    {
        CALCULATE_GET_DATA:function(year){
            axios.get('./calculate/list?year='+year)
            .then(function(res){
                console.log(res.data);
                // store.getState().commonData.COMMON_DATA_SET_YEAR(year);
                store.dispatch({type: 'CALCULATE_GET_DATA', payload:res.data})
                
            }.bind(this))
            .catch(function(error){
                console.log(error);
            }.bind(this))
        },
        CALCULATE_GET_YEAR:function(){
            axios.get('./calculate/year/report')
            .then(function(response){
                console.log(response.data);
                console.log(JSON.stringify(response.data));
            }.bind(this))
            .catch(function(error){
            }.bind(this));
        }

        //     _postSumData:function(e){
        //       console.log(e.detail);
        //       axios.post('/calculate/cal',e.detail)
        //       .then((response)=>{
        //       console.log("success");
        //       //this.textToast = 'บันทึกข้อมูลสำเร็จ';
        //       console.log(response.data);
        //       // this.sumData = response.data;

        //       this.answerSum = {
        //         sum_export : response.data.report,
        //         sum_for_cal : response.data.calculate,
        //         sum_quota : response.data.confirm,
        //         quota_amount : response.data.amount
        //       }
        //       this.textToast = 'คำนวณสำเร็จ';
        //       this.fire('toast',{
        //         status:'success',
        //         text:this.textToast,
        //         callback:function(){
        //         //console.log('test');
                  
        //         }
        //       });
        //       // console.log(this.answerSum);
        //       })
        //       .catch((error)=>{
        //         console.log("error");
        //         console.log(error);
        //     });
        //   },
        //   _postData:function(e){
        //       console.log(e.detail);
        //       this.fire('toast',{status:'load'});
              
        //       axios.post('/calculate/calculate',e.detail)
        //       .then((response)=>{
        //       console.log("success");
        //       console.log(response);
        //       //this.textToast = 'บันทึกข้อมูลสำเร็จ';
        //       this.textToast = 'บันทึกข้อมูลสำเร็จ';
        //       this.fire('toast',{
        //         status:'success',
        //         text:this.textToast,
        //         callback:function(){
        //         //console.log('test');
                
        //         }
        //       });
        //       this.$$("panel-right").close();
        //         this._getDatalist();
        //       })
        //       .catch((error)=>{
        //         console.log("error");
        //         console.log(error);
        //     });
        //   },
        //   _updateDataList:function(e){
        //       axios.post('./calculate/allocate/'+e.detail)
        //       .then((response)=>{
        //         console.log("success!!");
        //         console.log('dataListupdate',response);
        //         // this.dataList = response.data;
        //         this._getDatalist();
        //       })
        //       .catch((error)=>{
        //         console.log("error");
        //         console.log(error);
        //         this.fire('toast',{status:'connectError',text:error.message,
        //           callback:function(){
        //             //console.log('test');
        //           }})
        //       });
        //   },
        //   _getDatalist:function(){
        //       this.fire('toast',{status:'load'});
        //       axios.get('./calculate/list?year='+this.sendQuotaYear )
        //       .then((response)=>{
        //         console.log("success!!");
        //         console.log('dataList',response.data);
        //         this.dataList = response.data;
        //         //this.fire('toast',{status:'loadSuccess'});
        //         this.fire('toast',{
        //           status:'success',
        //           text:this.textToast,
        //           callback:function(){
        //             //console.log('test');
        //           }
        //         });      
        //       })
        //       .catch((error)=>{
        //         console.log("error");
        //         console.log(error);
        //         this.fire('toast',{status:'connectError',text:error.message,
        //           callback:function(){
        //             //console.log('test');
        //           }})
        //       });
        //   },
        //   _onDataSelect:function(e){
        //     this.getDatalistQuota(e.detail);
        //     // console.log('1234',e.detail)
        //     this.getKey = e.detail;
        //   },
        //   getDatalistQuota:function(key){
        //     this.fire('toast',{status:'load'});
        //     axios.get('./calculate/spreadsheet/'+key)
        //     .then((response)=>{
        //       console.log(response.data);
        //       // this.dataListQuota = response.data;
        //       this.fire('toast',{
        //           status:'success',
        //           callback:()=>{
        //             this.pageSelect = 1;
        //             this.$$('panel-right')._setWidth('95%');
        //             this.$$('panel-right').open();
        //             this.dataListQuota = response.data;
        //           }
        //         });
        //     })   
        //     .catch((error)=>{

        //     })
        //   },
        //   _confirmData:function(){
        //       this.fire('toast',{
        //       status:'openDialog',
        //       text:'ต้องการลบข้อมูลใช่หรือไม่ ?',
        //       confirmed:this._deleteData.bind(this)
        //     })
        //   },
        //   _saveData:function(e){
        //     console.log(e.detail);
        //     this.fire('toast',{status:'load'});
        //     axios.put('/calculate/spreadsheet',e.detail)
        //     .then((response)=>{
        //       console.log("success");
        //       console.log('save::',response.data);
        //       this.textToast = 'บันทึกข้อมูลสำเร็จ';
        //       this.fire('toast',{
        //         status:'success',
        //         text:this.textToast,
        //         callback:function(){
        //         //console.log('test');
                
        //         }
        //       });
        //       this.$$("panel-right").close();
        //       this._getDatalist();
        //       // this._getYear();
        //       // this._getDatalist(this.selectYear);
        //     })
        //     .catch((error)=>{
        //       console.log("error");
        //       console.log(error);
        //     });
        //   },
        //   _deleteData:function(result,detail){
        //      console.log('key:',this.getKey);
        //     // var data = detail.data;
        //     if(result == true){
        //         //this.fire('toast',{status:'load'});
        //         // http://localhost:3000/api/eu/calculate/allocate_quota?id=462106d4-ea26-4151-9cf1-07371ed01a9d
        //         axios.delete('/eu/calculate/allocate_quota',{
        //         params:{
        //           id : this.getKey
        //         }
        //         })
        //         .then((response)=>{
        //           console.log("success");
        //           this.textToast = 'ลบข้อมูลสำเร็จ';
        //           console.log(response);
        //           this.$$('panel-right').close();
        //           this._getDatalist();
        //         })
        //         .catch((error)=>{
        //           console.log("error");
        //           console.log(error);
        //         });
        //     }
        //   }
    }
    ]
}