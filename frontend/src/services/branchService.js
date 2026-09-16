import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const branchesRef = collection(db, 'branches')

export async function getBranches() {
  const snapshot = await getDocs(query(branchesRef, orderBy('name')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function addBranch(data) {
  const reference = await addDoc(branchesRef, {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    location: data.location.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: reference.id, ...data }
}

export async function updateBranch(id, data) {
  await updateDoc(doc(db, 'branches', id), {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    location: data.location.trim(),
    updatedAt: serverTimestamp(),
  })
}

export async function deleteBranch(id) {
  await deleteDoc(doc(db, 'branches', id))
}
