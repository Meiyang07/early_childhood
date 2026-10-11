import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { AdminRecord, Kind, Settings } from '@/types/admin';
import { defaultSettings } from '@/types/admin';
import { useAuth } from './auth';

type PortalData = {
  records: AdminRecord[];
  settings: Settings;
  settingsRevision: number;
};

type PortalContextValue = {
  data: PortalData;
  addRecord: (kind: Kind, values: { name: string; status: string; data: Record<string, string> }) => void;
  updateRecord: (id: string, values: { name: string; status: string; data: Record<string, string> }) => void;
  removeRecord: (id: string) => void;
  updateSettings: (settings: Settings) => void;
  refresh: () => void;
};

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Server currently exposes no records/settings endpoint.
  // Everything starts empty and only the staff mutation feeds the cache.
  const data = useMemo<PortalData>(
    () => ({
      records: [],
      settings: defaultSettings,
      settingsRevision: 0,
    }),
    [],
  );

  const value = useMemo<PortalContextValue>(
    () => ({
      data,
      addRecord: () => {
        // TODO: wire to server when endpoint exists
      },
      updateRecord: () => {
        // TODO: wire to server when endpoint exists
      },
      removeRecord: () => {
        // TODO: wire to server when endpoint exists
      },
      updateSettings: () => {
        // TODO: wire to server when endpoint exists
      },
      refresh: () => {
        // no-op until server endpoints exist
      },
    }),
    [data],
  );

  // user is referenced so the provider re-renders on auth changes
  void user;

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside PortalProvider');
  return ctx;
}