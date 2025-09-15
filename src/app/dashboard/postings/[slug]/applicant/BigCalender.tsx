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
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
    format,
    parse: (dateString: string) => new Date(dateString),
    startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
    getDay,
    locales,
});

interface InterviewEvent extends Event {
    id: number;
    isFixed?: boolean;
}

const DnDCalendar = withDragAndDrop(BigCalendar);

interface InterviewCalendarProps {
    existingEvents: InterviewEvent[];
    onNewEventChange?: (newEvent: InterviewEvent | null) => void;
}

const InterviewCalendar: React.FC<InterviewCalendarProps> = ({
    existingEvents,
    onNewEventChange,
}) => {
    const [newEvent, setNewEvent] = useState<InterviewEvent | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const events = [...existingEvents, ...(newEvent ? [newEvent] : [])];

    // pilih slot untuk event baru
    const handleSelectSlot = ({ start, end }: SlotInfo) => {
        if (newEvent) {
            alert("You can only add 1 new interview schedule!");
            return;
        }

        const isOccupied = existingEvents.some((ev) => start < ev.end && end > ev.start);
        if (isOccupied) {
            alert("This slot is already booked!");
            return;
        }

        const title = prompt("Enter interview title:", "New Interview");
        if (!title) return;

        const createdEvent: InterviewEvent = {
            id: events.length,
            title,
            start,
            end,
            isFixed: false,
        };

        setNewEvent(createdEvent);
        onNewEventChange?.(createdEvent);
    };

    const handleSelectEvent = (event: InterviewEvent) => {
        // edit title
        const newTitle = prompt("Edit interview title:", event.title as string);
        if (newTitle === null) return; // cancel
        if (newTitle === "") {
            if (window.confirm(`Delete event "${event.title}"?`)) {
                if (newEvent?.id === event.id) {
                    setNewEvent(null);
                    onNewEventChange?.(null);
                }
            }
            return;
        }

        const updatedEvent = { ...event, title: newTitle };
        if (newEvent?.id === event.id) {
            setNewEvent(updatedEvent);
            onNewEventChange?.(updatedEvent);
        } else {
            const index = existingEvents.findIndex((ev) => ev.id === event.id);
            if (index >= 0) {
                existingEvents[index] = updatedEvent;
            }
        }
    };

    const handleEventDrop = (args: EventInteractionArgs<any>) => {
        const { event, start, end } = args as EventInteractionArgs<InterviewEvent>;
        const startDate = start instanceof Date ? start : new Date(start);
        const endDate = end instanceof Date ? end : new Date(end);

        const isOccupied = existingEvents.some((ev) => startDate < ev.end && endDate > ev.start && ev.id !== event.id);
        if (isOccupied) {
            alert("Cannot move, slot is occupied!");
            return;
        }

        const updatedEvent = { ...event, start: startDate, end: endDate };
        if (newEvent?.id === event.id) {
            setNewEvent(updatedEvent);
            onNewEventChange?.(updatedEvent);
        } else {
            const index = existingEvents.findIndex((ev) => ev.id === event.id);
            if (index >= 0) existingEvents[index] = updatedEvent;
        }
    };

    const handleEventResize = (args: EventInteractionArgs<any>) => {
        const { event, start, end } = args as EventInteractionArgs<InterviewEvent>;
        const startDate = start instanceof Date ? start : new Date(start);
        const endDate = end instanceof Date ? end : new Date(end);

        const isOccupied = existingEvents.some((ev) => startDate < ev.end && endDate > ev.start && ev.id !== event.id);
        if (isOccupied) {
            alert("Cannot resize, slot is occupied!");
            return;
        }

        const updatedEvent = { ...event, start: startDate, end: endDate };
        if (newEvent?.id === event.id) {
            setNewEvent(updatedEvent);
            onNewEventChange?.(updatedEvent);
        } else {
            const index = existingEvents.findIndex((ev) => ev.id === event.id);
            if (index >= 0) existingEvents[index] = updatedEvent;
        }
    };

    return (
        <div style={{ height: "80vh", padding: "1rem" }}>
            <DnDCalendar
                localizer={localizer}
                events={events as any}
                date={currentDate}
                onNavigate={(date: Date) => setCurrentDate(date)}
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
                    return { style: { backgroundColor: "#3b82f6", color: "white", cursor: "pointer" } };
                }}
            />
        </div>
    );
};

export default InterviewCalendar;
