// firebaseFunctions.js
import { firestore, auth } from "./Config";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";

export const saveDoc = async (uid, data, collection) => {
  try {
    await firestore.collection(collection).doc(uid).set(data);
  } catch (error) {
    console.log("error saveData", error);
    throw error;
  }
};

export const deleteSingleDoc = async (collection, uid) => {
  try {
    await firestore.collection(collection).doc(uid).delete();
  } catch (error) {
    console.error("Error deleting user document:", error);
  }
};

// export const getSingleDoc = async (id, collection) => {
//   try {
//     const response = await firestore.collection(collection).doc(id).get();
//     return response.data();
//   } catch (error) {
//     console.log("=== getSingleDoc error", error);
//     throw error;
//   }
// };

export const getSingleDoc = async (id, collection) => {
  try {
    const docRef = doc(firestore, collection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.log("=== getSingleDoc error", error);
    throw error;
  }
};

export const getAllDocs = async (collection) => {
  try {
    const snapshot = await firestore.collection(collection).get();
    const tempArray = snapshot.docs.map((doc) => doc.data());
    return tempArray;
  } catch (error) {
    console.log("=== getAllDoc error", error);
    throw error;
  }
};

export const getDocsById = (collection, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firestore
      .collection(collection)
      .where(...id)
      .orderBy("createdAdd", "desc")
      .onSnapshot(
        (chatsSnapshot) => {
          const detectorDataArray = [];
          chatsSnapshot.forEach((chatSnapshot) => {
            const detectorData = chatSnapshot.data();
            detectorDataArray.push(detectorData);
          });
          resolve(detectorDataArray);
        },
        (error) => {
          console.error("Error:", error);
          reject(error);
        }
      );
    return unsubscribe;
  });
};

export const updateCollection = async (collection, uid, data) => {
  try {
    const docRef = firestore.collection(collection).doc(uid);
    await docRef.update(data);
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};

export const deleteUser = async (uid) => {
  try {
    const user = auth.currentUser;
    if (user && user.uid === uid) {
      await user.delete();
    } else {
      throw new Error("User not authenticated or UID mismatch");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

export const checkUserExist = async (email) => {
  try {
    const methods = await auth.fetchSignInMethodsForEmail(
      email?.trim()?.toLowerCase()
    );
    return methods.length > 0;
  } catch (error) {
    console.error("Error checking user existence========>", error);
    return false;
  }
};
