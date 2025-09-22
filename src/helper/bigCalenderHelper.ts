import { InterviewEvent } from "@/app/dashboard/postings/[slug]/applicant/components/BigCalender";
import { SlotInfo } from "react-big-calendar";
import { EventInteractionArgs } from "react-big-calendar/lib/addons/dragAndDrop";

// Warna event
export const eventPropGetter =
  (editableSchedule: InterviewEvent | null | undefined) =>
  (event: InterviewEvent) => {
    if (event.isFixed) {
      return {
        style: {
          backgroundColor: "oklch(58.6% 0.253 17.585)", // merah = fix (readonly)
          color: "white",
          pointerEvents: "none",
        },
      };
    }
    if (editableSchedule?.id === event.id) {
      return {
        style: {
          backgroundColor: "oklch(62.7% 0.194 149.214)", // hijau = editable
          color: "white",
        },
      };
    }
    return {
      style: {
        backgroundColor: "oklch(58.8% 0.158 241.966)", // biru = default
        color: "white",
      },
    };
  };

// Resize event
export const handleEventResize =
  (
    editableSchedule: InterviewEvent | null | undefined,
    existingEvents: InterviewEvent[],
    onScheduleChange: ((schedule: InterviewEvent | null) => void) | undefined,
    toast: any
  ) =>
  (args: EventInteractionArgs<InterviewEvent>) => {
    const { event, start, end } = args;
    if (editableSchedule?.id !== event.id) return;

    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);

    const overlap = existingEvents.some(
      (ev) =>
        ev.id !== event.id &&
        startDate < (ev.end as Date) &&
        endDate > (ev.start as Date)
    );
    if (overlap) {
      toast.error("Durasi baru bertabrakan dengan jadwal lain!");
      return;
    }

    onScheduleChange?.({ ...event, start: startDate, end: endDate });
    toast.success("Durasi berhasil diubah");
  };

// Drag & Drop
export const handleEventDrop =
  (
    editableSchedule: InterviewEvent | null | undefined,
    existingEvents: InterviewEvent[],
    onScheduleChange: ((schedule: InterviewEvent | null) => void) | undefined,
    toast: any
  ) =>
  (args: EventInteractionArgs<InterviewEvent>) => {
    const { event, start, end } = args;
    if (editableSchedule?.id !== event.id) return;

    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);

    const overlap = existingEvents.some(
      (ev) =>
        ev.id !== event.id &&
        startDate < (ev.end as Date) &&
        endDate > (ev.start as Date)
    );
    if (overlap) {
      toast.error("Posisi baru bertabrakan dengan jadwal lain!");
      return;
    }

    onScheduleChange?.({ ...event, start: startDate, end: endDate });
    toast.success("Posisi berhasil diubah");
  };

// Select Event (edit/delete)
export const handleSelectEvent =
  (
    editableSchedule: InterviewEvent | null | undefined,
    setOpenEdit: (val: boolean) => void,
    setEditingEvent: (event: InterviewEvent | null) => void,
    toast: any
  ) =>
  (event: InterviewEvent) => {
    if (editableSchedule?.id !== event.id) return;

    // simpan event yang sedang diedit
    setEditingEvent(event);
    setOpenEdit(true);

    // nanti InputDialog Edit yang bakal ubah title/location
    toast.info("Silakan edit judul & lokasi interview");
  };

// Select Slot (create new schedule)
export const handleSelectSlot =
  (
    editableSchedule: InterviewEvent | null | undefined,
    existingEvents: InterviewEvent[],
    setPendingSlot: (slot: { start: Date; end: Date } | null) => void,
    setOpen: (val: boolean) => void,
    toast: any
  ) =>
  ({ start, end }: SlotInfo) => {
    if (editableSchedule) {
      toast.error("Hanya bisa buat 1 jadwal baru sekaligus!");
      return;
    }

    const overlap = existingEvents.some(
      (ev) => start < (ev.end as Date) && end > (ev.start as Date)
    );
    if (overlap) {
      toast.error("Waktu bertabrakan dengan jadwal lain!");
      return;
    }

    // simpan slot sementara, buka dialog input
    setPendingSlot({ start, end });
    setOpen(true);
    toast.info("Isi judul & lokasi untuk jadwal baru");
  };
