"use client";
import React, { useState } from "react";
import {
    Calendar as BigCalendar,
    dateFnsLocalizer,
    Views,
    Event,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, startOfWeek, getDay } from "date-fns";
import { id } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
    eventPropGetter,
    handleEventDrop,
    handleEventResize,
    handleSelectEvent,
    handleSelectSlot,
} from "@/helper/bigCalenderHelper";
import { useToast } from "@/components/basic-toast";
import InputDialog from "./DialogBigCalender";

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
const DnDCalendar = withDragAndDrop<InterviewEvent>(BigCalendar);

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
    const toast = useToast();

    // state untuk dialog
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(editableSchedule ? editableSchedule.title : '');
    const [location, setLocation] = useState(editableSchedule ? editableSchedule.location : '');

    // state khusus untuk create
    const [pendingSlot, setPendingSlot] = useState<{
        start: Date;
        end: Date;
    } | null>(null);

    // state khusus untuk edit
    const [editingEvent, setEditingEvent] = useState<InterviewEvent | null>(null);

    // gabungin jadwal backend + editable
    const events = [
        ...existingEvents,
        ...(editableSchedule ? [editableSchedule] : []),
    ];

    // confirm dari InputDialog
    const handleConfirm = (titleVal: string, locationVal: string) => {
        // mode CREATE
        if (pendingSlot) {
            const newEvent: InterviewEvent = {
                id: Date.now(),
                title: titleVal,
                start: pendingSlot.start,
                end: pendingSlot.end,
                location: locationVal,
                isFixed: false,
            };
            onScheduleChange?.(newEvent);
            toast.success("Jadwal berhasil dibuat");
            setPendingSlot(null);
        }

        // mode EDIT
        if (editingEvent) {
            const updated: InterviewEvent = {
                ...editingEvent,
                title: titleVal,
                location: locationVal,
            };
            onScheduleChange?.(updated);
            toast.success("Jadwal berhasil diperbarui");
            setEditingEvent(null);
        }

        // reset input
        setTitle("");
        setLocation("");
        setOpen(false);
    };

    return (
        <div style={{ height: "80vh", padding: "1rem" }}>
            <DnDCalendar
                localizer={localizer}
                events={events as any}
                date={currentDate}
                onNavigate={(d) => setCurrentDate(d)}
                defaultView={Views.WEEK}
                views={{ month: true, week: true, day: true, agenda: true }}
                view={view}
                onView={(newView) => setView(newView as any)}
                selectable
                resizable
                onSelectSlot={handleSelectSlot(
                    editableSchedule,
                    existingEvents,
                    setPendingSlot,
                    setOpen,
                    toast
                )}
                onSelectEvent={handleSelectEvent(
                    editableSchedule,
                    setOpen,
                    setEditingEvent,
                    toast
                )}
                onEventDrop={handleEventDrop(
                    editableSchedule,
                    existingEvents,
                    onScheduleChange,
                    toast
                )}
                onEventResize={handleEventResize(
                    editableSchedule,
                    existingEvents,
                    onScheduleChange,
                    toast
                )}
                step={30}
                timeslots={1}
                toolbar
                eventPropGetter={eventPropGetter(editableSchedule)}
            />

            <InputDialog
                open={open}
                setOpen={setOpen}
                dialogLabel={editingEvent ? "Edit Interview" : "Create Interview"}
                titleValue={title as string}
                setTitleValue={setTitle}
                locationValue={location as string}
                setLocationValue={setLocation}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default InterviewCalendar;
