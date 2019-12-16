import {firestore, convertCollectionSnapshotToMap} from '../../firebase/firebase.utils'
import ShopActionTypes from './shop.types';

export const fetchCollectionsStart = () =>({
    type: ShopActionTypes.FETCH_COLLECTION_START,
});

export const fetchCollectionSuccess = collectionMap =>({
    type: ShopActionTypes.FETCH_COLLECTION_SUCCESS,
    payload: collectionMap
});

export const fetchCollectionFailure = (error) => ({
    type: ShopActionTypes.FETCH_COLLECTION_FAILURE,
    payload: error 
});

export const fetchCollectionStartAsync = () =>{
    return dispatch =>{
        const collectionRef = firestore.collection('collections');
        dispatch(fetchCollectionsStart());

    collectionRef
        .get()
        .then(snapshot => {
            const collectionMap =  convertCollectionSnapshotToMap(snapshot);
            dispatch(fetchCollectionSuccess(collectionMap));
        })
        .catch(error => dispatch(fetchCollectionFailure(error.message)));
    };
};

