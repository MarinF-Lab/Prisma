import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase.js";

export function useUserPalettes(uid) {
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(!!uid);

  useEffect(() => {
    if (!uid) {
      setPalettes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, "users", uid, "palettes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPalettes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  const savePalette = (uid2, { name, colors }) =>
    addDoc(collection(db, "users", uid2, "palettes"), {
      name,
      colors,
      fav: false,
      createdAt: serverTimestamp(),
    });

  const removePalette = (uid2, paletteId) => deleteDoc(doc(db, "users", uid2, "palettes", paletteId));

  const toggleFavPalette = (uid2, paletteId, fav) =>
    updateDoc(doc(db, "users", uid2, "palettes", paletteId), { fav: !fav });

  return { palettes, loading, savePalette, removePalette, toggleFavPalette };
}
