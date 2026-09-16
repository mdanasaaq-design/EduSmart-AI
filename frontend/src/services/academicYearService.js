import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const academicYearsRef = collection(db, 'academicYears')

export async function getAcademicYears() {
  const snapshot = await getDocs(query(academicYearsRef, orderBy('startYear', 'desc')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function addAcademicYear(data) {
  const reference = await addDoc(academicYearsRef, {
    name: data.name.trim(),
    startYear: Number(data.startYear),
    endYear: Number(data.endYear),
    status: data.status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: reference.id, ...data }
}

export async function updateAcademicYear(id, data) {
  await updateDoc(doc(db, 'academicYears', id), {
    name: data.name.trim(),
    startYear: Number(data.startYear),
    endYear: Number(data.endYear),
    status: data.status,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteAcademicYear(id) {
  await deleteDoc(doc(db, 'academicYears', id))
}
