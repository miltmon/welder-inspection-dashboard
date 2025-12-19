import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { InspectionItem, WelderInfo } from '../App';

// Types for Firestore documents
export interface FirestoreInspection {
  id?: string;
  welderInfo: WelderInfo;
  inspectionItems: InspectionItem[];
  status: 'pending' | 'completed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

export interface FirestoreWPSRecord {
  id?: string;
  wpsId: string;
  process: string;
  materialSpec: string;
  thickness: string;
  position: string;
  issueDate: string;
  expirationDate: string;
  status: 'active' | 'expiring' | 'expired';
  notes: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreDefectRecord {
  id?: string;
  jointId: string;
  defectType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  detectionMethod: string;
  photoUrls: string[];
  reportedDate: string;
  status: 'open' | 'repaired' | 'accepted';
  notes: string;
  linkedInspectionId?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirestoreCertification {
  id?: string;
  type: string;
  certificationBody: string;
  certNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expiring' | 'expired';
  daysRemaining: number;
  reminderSent: boolean;
  notes: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection names
const COLLECTIONS = {
  inspections: 'inspections',
  wpsRecords: 'wpsRecords',
  defectRecords: 'defectRecords',
  certifications: 'certifications',
  users: 'users'
} as const;

// Helper function to create user-specific collection reference
const getUserCollection = (userId: string, collectionName: string) => {
  return collection(db, 'users', userId, collectionName);
};

// Upload file to Firebase Storage
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

// Upload base64 image to Firebase Storage
export const uploadBase64Image = async (base64Data: string, path: string): Promise<string> => {
  // Convert base64 to blob
  const response = await fetch(base64Data);
  const blob = await response.blob();

  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, blob);
  return await getDownloadURL(snapshot.ref);
};

// Delete file from Firebase Storage
export const deleteFile = async (url: string): Promise<void> => {
  const fileRef = ref(storage, url);
  await deleteObject(fileRef);
};

// INSPECTION SERVICES
export const createInspection = async (userId: string, data: Omit<FirestoreInspection, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const inspectionData: Omit<FirestoreInspection, 'id'> = {
    ...data,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(getUserCollection(userId, COLLECTIONS.inspections), inspectionData);
  return docRef.id;
};

export const updateInspection = async (userId: string, inspectionId: string, data: Partial<FirestoreInspection>): Promise<void> => {
  const docRef = doc(getUserCollection(userId, COLLECTIONS.inspections), inspectionId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const getInspections = async (userId: string): Promise<FirestoreInspection[]> => {
  const q = query(
    getUserCollection(userId, COLLECTIONS.inspections),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreInspection));
};

export const subscribeToInspections = (userId: string, callback: (inspections: FirestoreInspection[]) => void) => {
  const q = query(
    getUserCollection(userId, COLLECTIONS.inspections),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const inspections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreInspection));
    callback(inspections);
  });
};

// WPS RECORD SERVICES
export const createWPSRecord = async (userId: string, data: Omit<FirestoreWPSRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const wpsData: Omit<FirestoreWPSRecord, 'id'> = {
    ...data,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(getUserCollection(userId, COLLECTIONS.wpsRecords), wpsData);
  return docRef.id;
};

export const updateWPSRecord = async (userId: string, recordId: string, data: Partial<FirestoreWPSRecord>): Promise<void> => {
  const docRef = doc(getUserCollection(userId, COLLECTIONS.wpsRecords), recordId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteWPSRecord = async (userId: string, recordId: string): Promise<void> => {
  const docRef = doc(getUserCollection(userId, COLLECTIONS.wpsRecords), recordId);
  await deleteDoc(docRef);
};

export const getWPSRecords = async (userId: string): Promise<FirestoreWPSRecord[]> => {
  const snapshot = await getDocs(getUserCollection(userId, COLLECTIONS.wpsRecords));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreWPSRecord));
};

export const subscribeToWPSRecords = (userId: string, callback: (records: FirestoreWPSRecord[]) => void) => {
  return onSnapshot(getUserCollection(userId, COLLECTIONS.wpsRecords), (snapshot) => {
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreWPSRecord));
    callback(records);
  });
};

// DEFECT RECORD SERVICES
export const createDefectRecord = async (userId: string, data: Omit<FirestoreDefectRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'photoUrls'>, photos: string[] = []): Promise<string> => {
  // Upload photos if any
  const photoUrls: string[] = [];
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    if (photo.startsWith('data:')) {
      // Base64 image, upload to storage
      const photoPath = `defects/${userId}/${Date.now()}_${i}.jpg`;
      const photoUrl = await uploadBase64Image(photo, photoPath);
      photoUrls.push(photoUrl);
    } else {
      // Already a URL
      photoUrls.push(photo);
    }
  }

  const defectData: Omit<FirestoreDefectRecord, 'id'> = {
    ...data,
    photoUrls,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(getUserCollection(userId, COLLECTIONS.defectRecords), defectData);
  return docRef.id;
};

export const updateDefectRecord = async (userId: string, recordId: string, data: Partial<FirestoreDefectRecord>): Promise<void> => {
  const docRef = doc(getUserCollection(userId, COLLECTIONS.defectRecords), recordId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const getDefectRecords = async (userId: string): Promise<FirestoreDefectRecord[]> => {
  const q = query(
    getUserCollection(userId, COLLECTIONS.defectRecords),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreDefectRecord));
};

export const subscribeToDefectRecords = (userId: string, callback: (records: FirestoreDefectRecord[]) => void) => {
  const q = query(
    getUserCollection(userId, COLLECTIONS.defectRecords),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreDefectRecord));
    callback(records);
  });
};

// CERTIFICATION SERVICES
export const createCertification = async (userId: string, data: Omit<FirestoreCertification, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const certData: Omit<FirestoreCertification, 'id'> = {
    ...data,
    userId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(getUserCollection(userId, COLLECTIONS.certifications), certData);
  return docRef.id;
};

export const updateCertification = async (userId: string, certId: string, data: Partial<FirestoreCertification>): Promise<void> => {
  const docRef = doc(getUserCollection(userId, COLLECTIONS.certifications), certId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const getCertifications = async (userId: string): Promise<FirestoreCertification[]> => {
  const snapshot = await getDocs(getUserCollection(userId, COLLECTIONS.certifications));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreCertification));
};

export const subscribeToCertifications = (userId: string, callback: (certs: FirestoreCertification[]) => void) => {
  return onSnapshot(getUserCollection(userId, COLLECTIONS.certifications), (snapshot) => {
    const certs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreCertification));
    callback(certs);
  });
};

// MIGRATION UTILITIES
export const migrateLocalStorageToFirestore = async (userId: string): Promise<void> => {
  const batch = writeBatch(db);

  try {
    // Migrate current inspection
    const currentInspection = localStorage.getItem('current-inspection');
    if (currentInspection) {
      const data = JSON.parse(currentInspection);
      await createInspection(userId, {
        welderInfo: data.welderInfo,
        inspectionItems: data.inspectionData,
        status: 'pending'
      });
    }

    // Migrate WPS records
    const wpsRecords = localStorage.getItem(`wps-records-${userId}`);
    if (wpsRecords) {
      const records = JSON.parse(wpsRecords);
      for (const record of records) {
        await createWPSRecord(userId, record);
      }
    }

    // Migrate defect records
    const defectRecords = localStorage.getItem(`defect-records-${userId}`);
    if (defectRecords) {
      const records = JSON.parse(defectRecords);
      for (const record of records) {
        await createDefectRecord(userId, record, record.photos || []);
      }
    }

    // Migrate certifications
    const certifications = localStorage.getItem(`certifications-${userId}`);
    if (certifications) {
      const certs = JSON.parse(certifications);
      for (const cert of certs) {
        await createCertification(userId, cert);
      }
    }

    await batch.commit();
    console.log('Successfully migrated localStorage data to Firestore');
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
    throw error;
  }
};
