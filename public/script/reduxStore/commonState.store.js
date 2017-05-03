import axios from '../axios'
import { commonAction } from '../config'
const initialState = {
    btnState:false
}
export function commonStateReducer(state = initialState, action) {
    switch (action.type) {
        case 'BTN_SET_STATE':
            return Object.assign({}, state, { btnState: action.payload });
        default:
            return state
    }
}
export function commonStateAction(store) {
    return [commonAction(),
    {
        BTN_SET_STATE: function (status) {
            store.dispatch({ type: 'BTN_SET_STATE', payload: status })
        }
    }
    ]
}