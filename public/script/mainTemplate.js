import {createStore,combineReducers} from 'redux'
import PolymerRedux from 'polymer-redux'
import {dispatchActionBehavior} from './config'
import {handleAuth} from './auth'

//!import

const rootReducer = combineReducers({
//!reducer
});

const storeApp = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.ReduxBehavior = [PolymerRedux(storeApp),dispatchActionBehavior()];
window.dispatchActionBehavior = dispatchActionBehavior();

handleAuth(storeApp);

//!action