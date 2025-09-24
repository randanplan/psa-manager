import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { PsaReport, PsaReportItem } from '../types';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Sample data for demonstration
const sampleReports: PsaReport[] = [
  {
    id: '1',
    anwender: 'Max Mustermann',
    prueferName: 'Anna Schmidt',
    ort: 'Werkstatt A',
    datum: '2024-01-15',
    items: [
      {
        index: 1,
        itemDescription: 'Schutzhelm',
        enNorm: 'EN 397',
        itemSN: 'SH-2024-001',
        baujahr: 2023,
        zustand: 'Gut',
        ergebnis: 'GUT',
        naechstePruefung: '2025-01-15'
      },
      {
        index: 2,
        itemDescription: 'Sicherheitsgurt',
        enNorm: 'EN 361',
        itemSN: 'SG-2024-002',
        baujahr: 2022,
        zustand: 'Leichte Abnutzung',
        ergebnis: 'BEOBACHTEN',
        naechstePruefung: '2024-07-15'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'demo-user',
    updatedBy: 'demo-user'
  },
  {
    id: '2',
    anwender: 'Lisa Weber',
    prueferName: 'Thomas Müller',
    ort: 'Baustelle B',
    datum: '2024-01-20',
    items: [
      {
        index: 1,
        itemDescription: 'Sicherheitsschuhe',
        enNorm: 'EN 345',
        itemSN: 'SS-2024-003',
        baujahr: 2021,
        zustand: 'Sohle abgenutzt',
        ergebnis: 'REPARIEREN',
        naechstePruefung: '2024-03-20'
      }
    ],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'demo-user',
    updatedBy: 'demo-user'
  }
];

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  // Demo mode
  signInDemo: () => void;
}

interface ReportState {
  reports: PsaReport[];
  loading: boolean;
  error: string | null;
  demoMode: boolean;
  fetchReports: () => Promise<void>;
  createReport: (report: Omit<PsaReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateReport: (id: string, report: Partial<PsaReport>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReportById: (id: string) => PsaReport | undefined;
  searchReports: (query: string) => PsaReport[];
  filterReportsByYear: (year: number) => PsaReport[];
  // Demo mode
  loadSampleData: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      loading: true,

      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          set({ user: session?.user ?? null, loading: false });

          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              if (process.env.NODE_ENV !== 'production') {
                console.log('Auth state changed:', session);
              }
              set({ user: session?.user ?? null });
            }
          );

          return () => subscription.unsubscribe();
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ loading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          console.log('Sign-in successful:', data);
        } catch (error) {
          console.error('Error signing in:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          if (process.env.NODE_ENV === 'development') {
            console.log('Sign-up successful:', data);
          }

        } catch (error) {
          console.error('Error signing up:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
        } catch (error) {
          console.error('Error signing out:', error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Demo mode sign in
      signInDemo: () => {
        set({
          user: {
            id: 'demo-user',
            email: 'demo@psa-manager.de',
            aud: 'authenticated',
            role: 'authenticated',
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {}
          } as User,
          loading: false
        });
      },
    }),
    { name: 'auth-store' }
  )
);

export const useReportStore = create<ReportState>()(
  devtools(
    persist(
      (set, get) => ({
        reports: [],
        loading: false,
        error: null,
        demoMode: false,

        fetchReports: async () => {
          // Check if in demo mode
          if (get().demoMode) {
            set({ reports: sampleReports, loading: false });
            return;
          }

          set({ loading: true, error: null });
          try {
            const { data, error, status ,statusText, count } = await supabase
              .from('psa_reports')
              .select('*')
              .order('created_at', { ascending: false });

            if (error) throw error;

            if (process.env.NODE_ENV === 'development') {
              console.log('Fetch reports response:', { data, error, status, statusText, count });
            }

            const reports: PsaReport[] = (data || []).map((row: any) => ({
              id: row.id,
              anwender: row.anwender,
              prueferName: row.prueferName,
              ort: row.ort,
              datum: row.datum,
              items: row.items as PsaReportItem[],
              createdAt: row.created_at,
              updatedAt: row.updated_at,
              createdBy: row.created_by,
              updatedBy: row.updated_by,
            }));

            set({ reports, loading: false });
          } catch (error) {
            console.error('Error fetching reports:', error);
            set({ error: 'Failed to fetch reports', loading: false });
          }
        },

        createReport: async (report) => {
          // Check if in demo mode
          if (get().demoMode) {
            const newReport: PsaReport = {
              id: `demo-${Date.now()}`,
              ...report,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: 'demo-user',
              updatedBy: 'demo-user',
            };

            set(state => ({
              reports: [newReport, ...state.reports],
              loading: false
            }));

            return newReport.id;
          }

          set({ loading: true, error: null });
          try {
            const { data, error, status, statusText, count } = await supabase
              .from('psa_reports')
              .insert({
                anwender: report.anwender,
                prueferName: report.prueferName,
                ort: report.ort,
                datum: typeof report.datum === 'string' ? report.datum : report.datum.toISOString(),
                items: report.items,
                created_by: useAuthStore.getState().user?.id,
              } as any)
              .select()
              .single();

            if (error) throw error;
            if (process.env.NODE_ENV === 'development') {
              console.log('Create report response:', { data, error, status, statusText, count });
            }
            const newReport: PsaReport = {
              id: data.id,
              anwender: data.anwender,
              prueferName: data.prueferName,
              ort: data.ort,
              datum: data.datum,
              items: data.items as PsaReportItem[],
              createdAt: data.created_at,
              updatedAt: data.updated_at,
              createdBy: data.created_by,
              updatedBy: data.updated_by,
            };

            set(state => ({
              reports: [newReport, ...state.reports],
              loading: false
            }));

            return data.id;
          } catch (error) {
            console.error('Error creating report:', error);
            set({ error: 'Failed to create report', loading: false });
            throw error;
          }
        },

        updateReport: async (id, reportUpdate) => {
          // Check if in demo mode
          if (get().demoMode) {
            set(state => ({
              reports: state.reports.map(r => r.id === id ? {
                ...r,
                ...reportUpdate,
                updatedAt: new Date().toISOString(),
                updatedBy: 'demo-user'
              } : r),
              loading: false
            }));
            return;
          }

          set({ loading: true, error: null });
          try {
            const { data, error, status, count, statusText } = await supabase
              .from('psa_reports')
              .update({
                ...reportUpdate,
                datum: reportUpdate.datum && typeof reportUpdate.datum !== 'string'
                  ? reportUpdate.datum.toISOString()
                  : reportUpdate.datum,
                updated_by: useAuthStore.getState().user?.id,
                updated_at: new Date().toISOString(),
              } as any)
              .eq('id', id)
              .select()
              .single();

            console.log('Update report response:', { data, error, status, count, statusText });

            if (error) throw error;

            const updatedReport: PsaReport = {
              id: data.id,
              anwender: data.anwender,
              prueferName: data.prueferName,
              ort: data.ort,
              datum: data.datum,
              items: data.items as PsaReportItem[],
              createdAt: data.created_at,
              updatedAt: data.updated_at,
              createdBy: data.created_by,
              updatedBy: data.updated_by,
            };

            set(state => ({
              reports: state.reports.map(r => r.id === id ? updatedReport : r),
              loading: false
            }));
          } catch (error) {
            console.error('Error updating report:', error);
            set({ error: 'Failed to update report', loading: false });
            throw error;
          }
        },

        deleteReport: async (id) => {
          // Check if in demo mode
          if (get().demoMode) {
            set(state => ({
              reports: state.reports.filter(r => r.id !== id),
              loading: false
            }));
            return;
          }

          set({ loading: true, error: null });
          try {
            const { data, error, count, status, statusText } = await supabase
              .from('psa_reports')
              .delete()
              .eq('id', id);

            if (process.env.NODE_ENV === 'development') {
              console.log('Delete report response:', { data, error, count, status, statusText });
            }

            if (error) throw error;

            set(state => ({
              reports: state.reports.filter(r => r.id !== id),
              loading: false
            }));
          } catch (error) {
            console.error('Error deleting report:', error);
            set({ error: 'Failed to delete report', loading: false });
            throw error;
          }
        },

        getReportById: (id) => {
          return get().reports.find(r => r.id === id);
        },

        searchReports: (query) => {
          const reports = get().reports;
          const lowerQuery = query.toLowerCase();
          return reports.filter(report =>
            report.anwender.toLowerCase().includes(lowerQuery) ||
            report.prueferName?.toLowerCase().includes(lowerQuery) ||
            report.ort?.toLowerCase().includes(lowerQuery)
          );
        },

        filterReportsByYear: (year) => {
          const reports = get().reports;
          return reports.filter(report => {
            const reportDate = new Date(report.datum);
            return reportDate.getFullYear() === year;
          });
        },

        // Demo mode
        loadSampleData: () => {
          set({
            reports: sampleReports,
            demoMode: true,
            loading: false
          });
        },
      }),
      {
        name: 'report-store',
        partialize: (state) => ({ reports: state.reports, demoMode: state.demoMode }),
      }
    ),
    { name: 'report-store' }
  )
);