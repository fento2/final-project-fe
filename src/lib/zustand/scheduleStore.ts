import { create } from "zustand";

export interface Schedule {
  application_id: number;
  startDate: string;
  endDate: string;
  note: string;
  location?: string;
}

interface SchedulesState {
  newSchedule: Schedule | null;

  setNewSchedule: (schedule: Schedule | null) => void;
  clearNewSchedule: () => void;
}

export const useSchedulesStore = create<SchedulesState>((set) => ({
  existingSchedules: [],
  newSchedule: null,

  setNewSchedule: (schedule) => set({ newSchedule: schedule }),
  clearNewSchedule: () => set({ newSchedule: null }),
}));
