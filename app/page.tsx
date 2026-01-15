"use client";

import { timetable } from "@/data/timetable";
import { subjects } from "@/data/subjects";
import { useState, useMemo, useEffect } from "react";

// --- Constants & Types ---
const DAY_ORDER = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
type DayType = typeof DAY_ORDER[number];

const DAY_NAMES: Record<DayType, string> = {
  SUN: "Sunday",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
};

const ALL_TIME_SLOTS = [
  "09:00 AM - 09:55 AM",
  "10:00 AM - 10:55 AM",
  "11:00 AM - 11:55 AM",
  "12:00 PM - 12:55 PM",
  "01:00 PM - 01:55 PM",
  "02:00 PM - 02:55 PM",
  "03:00 PM - 03:55 PM",
  "04:00 PM - 04:55 PM",
  "05:00 PM - 05:55 PM",
];

// --- Utilities ---

function getCurrentDay(): DayType {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date().getDay();
  return days[today] as DayType;
}

function parseEntry(entry: string) {
  const codeMatch = entry.match(/([LTP]-\d{2}B\d+[A-Z]+\d+)/);
  const subjectCode = codeMatch ? codeMatch[1] : null;

  const batchMatch = entry.match(/(\d{2}A\d{2}(?:,\d{2}A\d{2})*)/);
  const batches = batchMatch ? batchMatch[1] : null;

  const teacherMatch = entry.match(/\(([A-Z]{2,4})\)/);
  const teacher = teacherMatch ? teacherMatch[1] : null;

  const classroomMatch = entry.match(/\b(LT|CR|TR|LAB|CL)[- ]?\d+(?:_\d+)?\b/i);
  const classroom = classroomMatch ? classroomMatch[0].replace(/\s+/g, "") : null;

  const isLab =
    classroom?.toLowerCase().includes("lab") ||
    entry.includes("LAB") ||
    entry.includes("P-");

  return { subjectCode, batches, teacher, classroom, isLab };
}

function fillBreakSlots(dayEntries: { time: string; entry: string }[]) {
  return ALL_TIME_SLOTS.map((timeSlot) => {
    const existing = dayEntries.find((item) => item.time === timeSlot);
    return existing || { time: timeSlot, entry: "" };
  });
}

// --- Components ---

export default function Page() {
  const [selectedDay, setSelectedDay] = useState<DayType>("MON");
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setSelectedDay(getCurrentDay());
    setMounted(true);
  }, []);

  const currentDayEntries = useMemo(() => {
    const dayData = timetable[selectedDay] || [];
    return selectedDay === "SUN" ? [] : fillBreakSlots(dayData);
  }, [selectedDay]);

  if (!mounted) return null;

  const isToday = selectedDay === getCurrentDay();
  const isSunday = selectedDay === "SUN";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold tracking-tight">Schedule</h1>
            <div className="h-4 w-px bg-border hidden sm:block"></div>
            <p className="text-sm text-muted-foreground hidden sm:block font-medium">
              Sem 4 <span className="mx-1">·</span> Batch 24A12
            </p>
          </div>

          {/* Clean Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold hover:bg-accent hover:text-accent-foreground rounded-md transition-colors border border-transparent hover:border-border"
            >
              <span className="uppercase tracking-wider text-xs text-muted-foreground font-medium">
                {isToday ? "Today" : "View"}:
              </span>
              <span>{DAY_NAMES[selectedDay]}</span>
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-40 py-1">
                  {DAY_ORDER.map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDay(day);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                        selectedDay === day
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {day}
                      {day === getCurrentDay() && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* --- Main Grid --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {currentDayEntries.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-lg bg-card/30">
            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium">No Schedule</h3>
            <p className="text-sm text-muted-foreground mt-1">
              There are no classes scheduled for {DAY_NAMES[selectedDay]}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentDayEntries.map((item, idx) => {
              const isBreak = !item.entry;

              // --- Break Slot (Clearer Time) ---
              if (isBreak) {
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center p-4 border border-dashed border-border rounded-md bg-background/50 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-center gap-2">
                       <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       <span className="font-mono text-sm font-bold text-muted-foreground">
                        {item.time}
                       </span>
                       <span className="text-sm text-muted-foreground/60 ml-2">&mdash; Break</span>
                    </div>
                  </div>
                );
              }

              // --- Corporate Card ---
              const code =
                item.entry.match(/\b\d{2}B\d+[A-Z]+\d+\b/)?.[0] || null;
              const subjectName = code ? subjects[code] : "Unknown Subject";
              const details = parseEntry(item.entry);

              return (
                <article
                  key={idx}
                  className={`group flex flex-col bg-card border border-border rounded-md overflow-hidden hover:border-primary/50 transition-all shadow-sm ${
                    details.isLab
                      ? "border-l-[4px] border-l-orange-500/80"
                      : "border-l-[4px] border-l-blue-500/80"
                  }`}
                >
                  {/* Header Strip: Very Visible Time */}
                  <div className="bg-muted/40 px-4 py-2.5 flex items-center justify-between border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <svg 
                        className="w-4 h-4 text-primary" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-mono text-sm font-bold text-foreground tracking-tight">
                        {item.time}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                      {details.isLab ? "Lab" : "Lecture"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1 gap-3">
                    {/* Subject */}
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {subjectName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 font-mono opacity-80">
                        {details.subjectCode}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-3 mt-auto border-t border-border/30">
                      {details.classroom && (
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-muted-foreground/70 font-bold tracking-wider">
                            Room
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {details.classroom}
                          </span>
                        </div>
                      )}

                      {details.teacher && (
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] uppercase text-muted-foreground/70 font-bold tracking-wider">
                            Faculty
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {details.teacher}
                          </span>
                        </div>
                      )}
                      
                      {/* Optional Batch display for small details */}
                      {details.batches && (
                         <div className="col-span-2 pt-1 mt-1">
                            <span className="inline-block bg-muted/50 rounded px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground truncate max-w-full">
                              Batch: {details.batches}
                            </span>
                         </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}