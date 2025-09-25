import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { PsaReport, PsaReportItem } from '../types';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

interface ReportState {
  reports: PsaReport[];
  loading: boolean;
  error: string | null;
  fetchReports: () => Promise<void>;
  createReport: (report: Omit<PsaReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateReport: (id: string, report: Partial<PsaReport>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReportById: (id: string) => PsaReport | undefined;
  searchReports: (query: string) => PsaReport[];
  filterReportsByYear: (year: number) => PsaReport[];
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

        fetchReports: async () => {
          set({ loading: true, error: null });
          try {
            const { data, error, status ,statusText, count } = await supabase
              .from('psa_reports')
              .select()
              .order('createdAt', { ascending: false });

            if (error) throw error;


            const reports: PsaReport[] = (data || []).map((row: any) => ({
              id: row.id,
              anwender: row.anwender,
              prueferName: row.prueferName,
              ort: row.ort,
              datum: row.datum,
              items: row.items as PsaReportItem[],
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
              createdBy: row.createdBy,
              updatedBy: row.updatedBy,
            }));
            console.log('Fetch reports:', reports, { data, error, status, statusText, count });
            set({ reports, loading: false });
          } catch (error) {
            console.error('Error fetching reports:', error);
            set({ error: 'Failed to fetch reports', loading: false });
          }
        },

        createReport: async (report) => {

          set({ loading: true, error: null });
          try {
            const { data, error } = await supabase
              .from('psa_reports')
              .insert({
                anwender: report.anwender,
                prueferName: report.prueferName,
                ort: report.ort,
                datum: typeof report.datum === 'string' ? report.datum : report.datum.toISOString(),
                items: report.items,
                createdBy: useAuthStore.getState().user?.id,
              })
              .select()
              .single();

            if (error) {
              throw error;
            }

            const newReport: PsaReport = {
              id: data.id,
              anwender: data.anwender,
              prueferName: data.prueferName,
              ort: data.ort,
              datum: data.datum,
              items: data.items as PsaReportItem[],
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              createdBy: data.createdBy,
              updatedBy: data.updatedBy,
            };

            set(state => ({
              reports: [newReport, ...state.reports],
              loading: false
            }));

            return data.id;
          } catch (error) {
            console.error('Error creating report:', error);
            set({ error: `Failed to create report: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`, loading: false });
            throw error;
          }
        },

        updateReport: async (id, reportUpdate) => {

          set({ loading: true, error: null });
          try {
            const { data, error, status, count, statusText } = await supabase
              .from('psa_reports')
              .update({
                ...reportUpdate,
                datum: reportUpdate.datum ? (typeof reportUpdate.datum === 'string' ? reportUpdate.datum : reportUpdate.datum.toISOString()) : undefined,
                updatedBy: useAuthStore.getState().user?.id,
                updatedAt: new Date().toISOString()
              } as any)
              .is('id', id)
              .select()
              .single();


            if (error) {
              console.error('Supabase update error:', error);
              set({ loading: false, error: error.message });
            }

            if (data == null) {
              console.error('No data returned from update operation');
              set({ loading: false, error: 'No data returned from update operation' });
              return;
            }

            const updatedReport: PsaReport = {
              id: id,
              anwender: data.anwender,
              prueferName: data.prueferName,
              ort: data.ort,
              datum: data.datum,
              items: data.items as PsaReportItem[],
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              createdBy: data.createdBy,
              updatedBy: data.updatedBy,
            };
            console.log('Updated report:', updatedReport, data, status, count, statusText);
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
      }),
      {
        name: 'report-store',
        partialize: (state) => ({ reports: state.reports}),
      }
    ),
    { name: 'report-store' }
  )
);