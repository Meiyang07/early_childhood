import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AdminRecord, Kind, PortalData, Settings } from '@/types/admin';

import { portalStorage } from './storage';
import { buildInitialPortal } from '@/data/seed';

type RecordValues = { name: string; status: string; data: Record<string, string> };

type PortalContextValue = {
  data: PortalData | null;
  addRecord: (kind: Kind, values: RecordValues) => AdminRecord | null;
  updateRecord: (id: string, values: RecordValues) => AdminRecord | null;
  removeRecord: (id: string) => void;
  updateSettings: (settings: Settings) => void;
  refresh: () => void;
};

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortalData | null>(null);

  useEffect(() => {
    const stored = portalStorage.load();
    if (stored) {
      setData(stored);
    } else {
      const initial = buildInitialPortal();
      portalStorage.save(initial);
      setData(initial);
    }
  }, []);

  const commit = useCallback((next: PortalData) => {
    setData(next);
    portalStorage.save(next);
  }, []);

  const addRecord = useCallback<PortalContextValue['addRecord']>(
    (kind, values) => {
      if (!data) return null;
      const now = new Date().toISOString();
      const record: AdminRecord = {
        id: crypto.randomUUID(),
        kind,
        name: values.name,
        status: values.status,
        data: values.data,
        revision: 0,
        createdAt: now,
        updatedAt: now,
      };
      commit({ ...data, records: [record, ...data.records] });
      return record;
    },
    [data, commit],
  );

  const updateRecord = useCallback<PortalContextValue['updateRecord']>(
    (id, values) => {
      if (!data) return null;
      const existing = data.records.find((r) => r.id === id);
      if (!existing) return null;
      const updated: AdminRecord = {
        ...existing,
        name: values.name,
        status: values.status,
        data: values.data,
        revision: existing.revision + 1,
        updatedAt: new Date().toISOString(),
      };
      commit({ ...data, records: data.records.map((r) => (r.id === id ? updated : r)) });
      return updated;
    },
    [data, commit],
  );

  const removeRecord = useCallback<PortalContextValue['removeRecord']>(
    (id) => {
      if (!data) return;
      commit({ ...data, records: data.records.filter((r) => r.id !== id) });
    },
    [data, commit],
  );

  const updateSettings = useCallback<PortalContextValue['updateSettings']>(
    (settings) => {
      if (!data) return;
      commit({ ...data, settings, settingsRevision: data.settingsRevision + 1 });
    },
    [data, commit],
  );

  const refresh = useCallback(() => {
    const stored = portalStorage.load();
    if (stored) setData(stored);
  }, []);

  const value = useMemo(
    () => ({ data, addRecord, updateRecord, removeRecord, updateSettings, refresh }),
    [data, addRecord, updateRecord, removeRecord, updateSettings, refresh],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside PortalProvider');
  return ctx;
}