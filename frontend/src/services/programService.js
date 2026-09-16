import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const programsRef = collection(db, 'programs')

export async function getPrograms() {
  const snapshot = await getDocs(query(programsRef, orderBy('name')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function addProgram(data) {
  const reference = await addDoc(programsRef, {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    type: data.type,
    branchId: data.branchId,
    branchName: data.branchName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: reference.id, ...data }
}

export async function updateProgram(id, data) {
  await updateDoc(doc(db, 'programs', id), {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    type: data.type,
    branchId: data.branchId,
    branchName: data.branchName,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProgram(id) {
  await deleteDoc(doc(db, 'programs', id))
}
