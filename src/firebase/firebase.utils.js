import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyCO-nEnoRjHGlIhhcI56ItETG_Q-QxsRR0",
  authDomain: "crwn-db-e8417.firebaseapp.com",
  databaseURL: "https://crwn-db-e8417.firebaseio.com",
  projectId: "crwn-db-e8417",
  storageBucket: "crwn-db-e8417.appspot.com",
  messagingSenderId: "688222468787",
  appId: "1:688222468787:web:7791a3de8ad01a35ea0ec6",
  measurementId: "G-RLPRPRWG9D"
};

export const createUserProfileDocument = async (userAuth, additionalData ) => {
  if (!userAuth) return;

  // check if user already exist
  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  if (!snapShot.exists){
    const {displayName, email} = userAuth;
    const createdAt = new Date();

    try{
      await userRef.set({
          displayName, 
          email, 
          createdAt, 
          ...additionalData
      })
    }catch(error){
      console.log('error creating user', error.message);
    }
  }
  return userRef;
}
firebase.initializeApp(config);

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) =>{
  const collectionRef = firestore.collection(collectionKey);
  console.log(collectionRef);

  const batch = firestore.batch();
  objectsToAdd.forEach(obj =>{
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
}

export const convertCollectionSnapshotToMap = (collections)=>{
  
  const transformedCollection = collections.docs.map(doc =>{
    const {title, items} = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items
    }
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator
  }, {});
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;