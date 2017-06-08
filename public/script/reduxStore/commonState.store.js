import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    btnState:false,
    data:{id:1}
}
export function commonStateReducer(state = initialState, action) {
    switch (action.type) {
        case 'BTN_SET_STATE':
            return Object.assign({}, state, { btnState: action.payload });
        case 'COMMON_DATA_SELECTED':
            return Object.assign({}, state, { data: action.payload });
        default:
            return state
    }
}
export function commonStateAction(store) {
    return [commonAction(),
    {
        BTN_SET_STATE: function (status) {
            store.dispatch({ type: 'BTN_SET_STATE', payload: status })
        },
        COMMON_DATA_SELECTED: function (data) {
            // console.log(data);
            store.dispatch({ type: 'COMMON_DATA_SELECTED', payload: data })
        }
    }
    ]
}