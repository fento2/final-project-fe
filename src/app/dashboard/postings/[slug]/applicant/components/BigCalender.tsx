"use client";

import React, { useState } from "react";
import {
    Calendar as BigCalendar,
    dateFnsLocalizer,
    Views,
    Event,
    SlotInfo,
} from "react-big-calendar";
import withDragAndDrop, { EventInteractionArgs } from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { id } from "date-fns/locale";

const locales = { "id-ID": id };

const localizer = dateFnsLocalizer({
    format,
    parse: (dateString: string) => new Date(dateString),
    startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
    getDay,
    locales,
});

// export interface supaya parent bisa import
export interface InterviewEvent extends Event {
    id: number;
    isFixed?: boolean;
    location?: string;
}

const DnDCalendar = withDragAndDrop(BigCalendar);

interface InterviewCalendarProps {
    existingEvents: InterviewEvent[];
    newSchedule?: InterviewEvent | null;
    onNewScheduleChange?: (schedule: InterviewEvent | null) => void;
}

const InterviewCalendar: React.FC<InterviewCalendarProps> = ({
    existingEvents,
    newSchedule,
    onNewScheduleChange,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const events = [...existingEvents, ...(newSchedule ? [newSchedule] : [])];

    const handleSelectSlot = ({ start, end }: SlotInfo) => {
        // Cek kalau sudah ada newSchedule
        if (newSchedule) {
            alert("You can only add 1 new interview schedule!");
            return;
        }

        // Cek overlap dengan existingEvents
        const overlap = existingEvents.some(event => {
            if (!event.start || !event.end) return false;
            return start < event.end && end > event.start;
        });

        if (overlap) {
            alert("This time slot overlaps with an existing interview!");
            return;
        }

        const title = prompt("Enter interview title:", "New Interview");
        if (!title) return;

        const location = prompt("Enter interview location:", "Online / Office");
        if (location === null) return;

        const createdEvent: InterviewEvent = {
            id: Date.now(),
            title,
            start,
            end,
            location,
            isFixed: false,
        };

        onNewScheduleChange?.(createdEvent);
    };

    const handleSelectEvent = (event: InterviewEvent) => {
        if (newSchedule?.id !== event.id) return;

        const newTitle = prompt("Edit interview title:", event.title as string);
        if (newTitle === null) return;
        if (newTitle === "") {
            if (confirm(`Delete event "${event.title}"?`)) {
                onNewScheduleChange?.(null);
            }
            return;
        }

        const newLocation = prompt("Edit interview location:", event.location ?? "");
        if (newLocation === null) return;

        onNewScheduleChange?.({ ...event, title: newTitle, location: newLocation });
    };

    const handleEventDrop = (args: EventInteractionArgs<InterviewEvent>) => {
        const { event, start, end } = args;
        if (newSchedule?.id !== event.id) return;
        const startDate = start instanceof Date ? start : new Date(start);
        const endDate = end instanceof Date ? end : new Date(end);

        // Cek overlap saat drag & drop
        const overlap = existingEvents.some(ev => {
            if (!ev.start || !ev.end) return false;
            return ev.id !== event.id && startDate < ev.end && endDate > ev.start;
        });
        if (overlap) {
            alert("This new position overlaps with an existing interview!");
            return;
        }

        onNewScheduleChange?.({ ...event, start: startDate, end: endDate });
    };

    const handleEventResize = (args: EventInteractionArgs<InterviewEvent>) => {
        const { event, start, end } = args;
        if (newSchedule?.id !== event.id) return;
        const startDate = start instanceof Date ? start : new Date(start);
        const endDate = end instanceof Date ? end : new Date(end);

        // Cek overlap saat resize
        const overlap = existingEvents.some(ev => {
            if (!ev.start || !ev.end) return false;
            return ev.id !== event.id && startDate < ev.end && endDate > ev.start;
        });
        if (overlap) {
            alert("Resized time overlaps with an existing interview!");
            return;
        }

        onNewScheduleChange?.({ ...event, start: startDate, end: endDate });
    };

    return (
        <div style={{ height: "80vh", padding: "1rem" }}>
            <DnDCalendar
                localizer={localizer}
                events={events}
                date={currentDate}
                onNavigate={(d) => setCurrentDate(d)}
                defaultView={Views.WEEK}
                views={{ week: true }}
                selectable
                resizable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventResize}
                step={30}
                timeslots={1}
                style={{ height: "100%" }}
                toolbar
                eventPropGetter={(event: InterviewEvent) => {
                    if (event.isFixed) {
                        return { style: { backgroundColor: "#f87171", color: "white", pointerEvents: "none" } };
                    }
                    if (newSchedule?.id === event.id) {
                        return { style: { backgroundColor: "#10b981", color: "white" } }; // new = hijau
                    }
                    return { style: { backgroundColor: "#3b82f6", color: "white" } };
                }}
            />
        </div>
    );
};

export default InterviewCalendar;
