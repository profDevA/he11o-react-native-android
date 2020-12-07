import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import thunk from "redux-thunk";
import reducers from './../reducer';
import AsyncStorage from '@react-native-community/async-storage';

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const persistConfig = {
	key: 'he11oProfile',
	storage: AsyncStorage,
	// Whitelist (Save Specific Reducers)
	whitelist: [
		'users',
	],
	// Blacklist (Don't Save Specific Reducers)
	blacklist: [
		'share'
	],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));
export const persistor = persistStore(store);