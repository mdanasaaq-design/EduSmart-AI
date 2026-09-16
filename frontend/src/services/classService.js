import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const classesRef = collection(db, 'classes')

export async function getClasses() {
  const snapshot = await getDocs(query(classesRef, orderBy('name')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function addClass(data) {
  const reference = await addDoc(classesRef, {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    programId: data.programId,
    programName: data.programName,
    academicYearId: data.academicYearId,
    academicYearName: data.academicYearName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: reference.id, ...data }
}

export async function updateClass(id, data) {
  await updateDoc(doc(db, 'classes', id), {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    programId: data.programId,
    programName: data.programName,
    academicYearId: data.academicYearId,
    academicYearName: data.academicYearName,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteClass(id) {
  await deleteDoc(doc(db, 'classes', id))
}
