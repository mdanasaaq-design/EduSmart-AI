import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const sectionsRef = collection(db, 'sections')

export async function getSections() {
  const snapshot = await getDocs(query(sectionsRef, orderBy('name')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function addSection(data) {
  const reference = await addDoc(sectionsRef, {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    classId: data.classId,
    className: data.className,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: reference.id, ...data }
}

export async function updateSection(id, data) {
  await updateDoc(doc(db, 'sections', id), {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    classId: data.classId,
    className: data.className,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteSection(id) {
  await deleteDoc(doc(db, 'sections', id))
}
