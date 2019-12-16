import {takeLatest, call, put, all} from 'redux-saga/effects';
import ShopActionTypes from './shop.types';

import {firestore, convertCollectionSnapshotToMap} from '../../firebase/firebase.utils';
import {
    fetchCollectionSuccess,
    fetchCollectionFailure
} from './shop.actions';

export function* fetchCollectionsAsync(){
    yield console.log("I am fired");

    try{
        const collectionRef = firestore.collection('collections');
        const snapshot = yield collectionRef.get();
        const collectionMap = yield call(convertCollectionSnapshotToMap, snapshot);
        yield put(fetchCollectionSuccess(collectionMap));
    } catch(error) {
        yield put(fetchCollectionFailure(error.message));
    }    
}

export function* fetchCollectionStart(){
    yield takeLatest(
        ShopActionTypes.FETCH_COLLECTION_START, 
        fetchCollectionsAsync);
}

export function* shopSagas(){
    yield all([call(fetchCollectionStart)])
}