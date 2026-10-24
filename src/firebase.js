import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
)

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
export const db = app ? getFirestore(app) : null

export async function getRecipesFromFirestore() {
  if (!db) return []

  const recipesCollection = collection(db, 'recipes')
  const q = query(recipesCollection, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    ingredients: doc.data().ingredients || [],
  }))
}

export async function addRecipeToFirestore(recipe) {
  if (!db) return recipe

  const recipeToSave = {
    ...recipe,
    createdAt: new Date().toISOString(),
  }

  const docRef = await addDoc(collection(db, 'recipes'), recipeToSave)

  return {
    ...recipeToSave,
    id: docRef.id,
  }
}
