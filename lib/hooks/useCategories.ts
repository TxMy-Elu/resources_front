import { useState, useEffect, useCallback } from 'react';
import { getCategories, ApiCategory } from '@/lib/api';

/**
 * Hook centralisé pour charger les catégories depuis l'API.
 * Fetch automatiquement au montage du composant.
 * Appeler `refresh()` pour forcer un rechargement (ex. après création/suppression).
 */
export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { categories, loading, refresh };
}
