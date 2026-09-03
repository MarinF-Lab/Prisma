import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase.js";
import { CURATED_COLORS } from "./data/curatedColors.js";

/* Librería de colores: arranca con la lista local (siempre disponible,
   sin esperar red) y la amplía con lo que haya en la colección pública
   `colors` de Firestore, para poder crecerla sin tocar código. */
export function useColorLibrary() {
  const [colors, setColors] = useState(CURATED_COLORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getDocs(collection(db, "colors"))
      .then((snap) => {
        if (cancelled || snap.empty) return;
        const remote = snap.docs.map((d) => d.data());
        const seen = new Set(CURATED_COLORS.map((c) => c.hex));
        const extra = remote.filter((c) => c.hex && !seen.has(c.hex));
        if (extra.length) setColors([...CURATED_COLORS, ...extra]);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { colors, loading };
}
