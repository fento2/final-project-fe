"use client";

import React, { useState } from "react";
import {
    Calendar as BigCalendar,
    dateFnsLocalizer,
    Views,
    Event,
    SlotInfo,
} from "react-big-calendar";
import withDragAndDrop, {
    EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { id } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// Localizer
const locales = { "id-ID": id };
const localizer = dateFnsLocalizer({
    format,
    parse: (dateString: string) => new Date(dateString),
    startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
    getDay,
    locales,
});

// Interface event
export interface InterviewEvent extends Event {
    id: number;
    isFixed?: boolean; // dari backend (readonly)
    location?: string;
}

const DnDCalendar = withDragAndDrop(BigCalendar);

interface InterviewCalendarProps {
    existingEvents: InterviewEvent[]; // jadwal dari backend (readonly)
    editableSchedule?: InterviewEvent | null; // event yang bisa di-create / edit
    onScheduleChange?: (schedule: InterviewEvent | null) => void;
}

const InterviewCalendar: React.FC<InterviewCalendarProps> = ({
    existingEvents,
    editableSchedule,
    onScheduleChange,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState(Views.WEEK);

    // gabungin jadwal backend + editable
    const events = [
        ...existingEvents,
        ...(editableSchedule ? [editableSchedule] : []),
    ];

    // Create new schedule
    const handleSelectSlot = ({ start, end }: SlotInfo) => {
        if (editableSchedule) {
            alert("Hanya bisa buat 1 jadwal baru sekaligus!");
            return;
        }

        // cek overlap
        const overlap = existingEvents.some(
            (ev) => start < (ev.end as Date) && end > (ev.start as Date)
        );
        if (overlap) {
            alert("Waktu bertabrakan dengan jadwal lain!");
            return;
        }

        const title = prompt("Masukkan judul interview:", "Interview Baru");
        if (!title) return;

        const location = prompt("Masukkan lokasi/Zoom:", "Online / Office");
        if (location === null) return;

        const newEvent: InterviewEvent = {
            id: Date.now(),
            title,
            start,
            end,
            location,
            isFixed: false,
        };

        onScheduleChange?.(newEvent);
    };

    // Edit event (title, location, delete)
    const handleSelectEvent = (event: InterviewEvent) => {
        if (editableSchedule?.id !== event.id) return;

        const newTitle = prompt("Edit judul interview:", event.title as string);
        if (newTitle === null) return;

        if (newTitle === "") {
            if (confirm(`Hapus event "${event.title}"?`)) {
                onScheduleChange?.(null);
            }
            return;
        }

        const newLocation = prompt("Edit lokasi:", event.location ?? "");
        if (newLocation === null) return;

        onScheduleChange?.({
            ...event,
            title: newTitle,
            location: newLocation,
        });
    };

    // Drag & Drop
    const handleEventDrop = (args: EventInteractionArgs<InterviewEvent>) => {
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
            alert("Posisi baru bertabrakan dengan jadwal lain!");
            return;
        }

        onScheduleChange?.({ ...event, start: startDate, end: endDate });
    };

    // Resize event
    const handleEventResize = (args: EventInteractionArgs<InterviewEvent>) => {
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
            alert("Durasi baru bertabrakan dengan jadwal lain!");
            return;
        }

        onScheduleChange?.({ ...event, start: startDate, end: endDate });
    };


    return (
        <div style={{ height: "80vh", padding: "1rem" }}>
            <DnDCalendar
                localizer={localizer}
                events={events}
                date={currentDate}
                onNavigate={(d) => setCurrentDate(d)}
                defaultView={Views.WEEK}
                views={{ month: true, week: true, day: true, agenda: true }}
                view={view}                  // controlled view
                onView={(newView) => setView(newView as any)} // update state
                selectable
                resizable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
                step={30}
                timeslots={1}
                toolbar
                eventPropGetter={(event: InterviewEvent) => {
                    if (event.isFixed) {
                        return {
                            style: {
                                backgroundColor: "#f87171", // merah = fix (readonly)
                                color: "white",
                                pointerEvents: "none",
                            },
                        };
                    }
                    if (editableSchedule?.id === event.id) {
                        return {
                            style: {
                                backgroundColor: "#10b981", // hijau = editable
                                color: "white",
                            },
                        };
                    }
                    return {
                        style: {
                            backgroundColor: "#3b82f6", // biru = default
                            color: "white",
                        },
                    };
                }}
            />
        </div>
    );
};

export default InterviewCalendar;
