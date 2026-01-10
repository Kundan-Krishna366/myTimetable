"use client";

import { timetable } from "@/data/timetable";
import { subjects } from "@/data/subjects";
import { useState, useMemo } from "react";

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

// All possible time slots from 9:00 AM to 5:55 PM
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

function getCurrentDay(): DayType {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date().getDay();
  return days[today] as DayType;
}

function getSubjectCode(entry: string) {
  const match = entry.match(/\b\d{2}B\d+[A-Z]+\d+\b/);
  return match ? match[0] : null;
}

// Extract details from entry
function parseEntry(entry: string) {
  const codeMatch = entry.match(/([LTP]-\d{2}B\d+[A-Z]+\d+)/);
  const subjectCode = codeMatch ? codeMatch[1] : null;
  
  const batchMatch = entry.match(/(\d{2}A\d{2}(?:,\d{2}A\d{2})*)/);
  const batches = batchMatch ? batchMatch[1] : null;
  
  const teacherMatch = entry.match(/\(([A-Z]{2,4})\)/);
  const teacher = teacherMatch ? teacherMatch[1] : null;
  
  const classroomMatch = entry.match(/\b(LT|CR|TR|LAB|CL)[- ]?\d+(?:_\d+)?\b/i);
  const classroom = classroomMatch ? classroomMatch[0].replace(/\s+/g, '') : null;
  
  return { subjectCode, batches, teacher, classroom };
}

// Function to fill in break slots
function fillBreakSlots(dayEntries: { time: string; entry: string }[]) {
  const existingTimes = new Set(dayEntries.map(item => item.time));
  const completeSchedule = ALL_TIME_SLOTS.map(timeSlot => {
    const existing = dayEntries.find(item => item.time === timeSlot);
    return existing || { time: timeSlot, entry: "" };
  });
  
  return completeSchedule;
}

export default function Page() {
  const [selectedDay, setSelectedDay] = useState<DayType>(getCurrentDay());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fill break slots for the selected day
  const currentDayEntries = useMemo(() => {
    const dayData = timetable[selectedDay] || [];
    return selectedDay === "SUN" ? [] : fillBreakSlots(dayData);
  }, [selectedDay]);

  const isToday = selectedDay === getCurrentDay();
  const isSunday = selectedDay === "SUN";

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                Class Schedule
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                BTech Semester 4 · 24A12
              </p>
            </div>

            {/* Day Selector */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full sm:w-64 flex items-center justify-between gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-[var(--radius)] font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
              >
                <span className="flex items-center gap-2.5">
                  {isToday && !isSunday && (
                    <span className="w-2 h-2 rounded-full bg-primary-foreground/80 animate-pulse"></span>
                  )}
                  {isSunday && (
                    <span className="text-base">🌴</span>
                  )}
                  <span>{DAY_NAMES[selectedDay]}</span>
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown with backdrop blur */}
              {isDropdownOpen && (
                <>
                  {/* Blur Overlay */}
                  <div
                    className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 left-0 sm:left-auto mt-2 w-full sm:w-72 bg-popover/95 backdrop-blur-xl border border-border rounded-[var(--radius)] shadow-2xl shadow-primary/10 z-50 overflow-hidden">
                    <div className="p-2">
                      {DAY_ORDER.map((day) => {
                        const isDayToday = day === getCurrentDay();
                        const isDaySunday = day === "SUN";
                        const classCount = timetable[day]?.length || 0;

                        return (
                          <button
                            key={day}
                            onClick={() => {
                              setSelectedDay(day);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg text-sm font-medium transition-all ${
                              selectedDay === day
                                ? "bg-accent text-accent-foreground scale-[0.98]"
                                : "hover:bg-accent/50 text-popover-foreground active:scale-[0.98]"
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              {isDayToday && !isDaySunday && (
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                              )}
                              {isDaySunday && (
                                <span className="text-base">🌴</span>
                              )}
                              <span className={isDaySunday ? "text-muted-foreground" : ""}>
                                {DAY_NAMES[day]}
                              </span>
                            </span>
                            <div className="flex items-center gap-2">
                              {isDaySunday ? (
                                <span className="text-xs px-2 py-0.5 bg-destructive/20 text-destructive rounded-full font-medium">
                                  Holiday
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {classCount}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Today Indicator */}
          {isToday && !isSunday && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Today's Classes
              </span>
            </div>
          )}
          
          {/* Sunday Badge */}
          {isSunday && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-destructive/10 border border-destructive/20 rounded-full text-xs font-medium text-destructive">
                <span className="text-sm">🌴</span>
                Holiday
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-3">
          {currentDayEntries.length > 0 ? (currentDayEntries.map((item, idx) => {
              // Skip rendering empty break slots or render them differently
              const isBreak = !item.entry;
              
              if (isBreak) {
                // Render break slot - MORE VISIBLE
                return (
                  <article
                    key={idx}
                    className="bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-[var(--radius)] overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Coffee/Break Icon */}
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        {/* Time */}
                        <div>
                          <span className="font-mono text-sm sm:text-base font-bold text-muted-foreground block mb-0.5">
                            {item.time}
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground/80 font-medium">
                            Free Time / Break
                          </span>
                        </div>
                      </div>
                      {/* Break emoji */}
                      <span className="text-2xl sm:text-3xl opacity-60">☕</span>
                    </div>
                  </article>
                );
              }

              const code = getSubjectCode(item.entry);
              const subjectName = code ? subjects[code] : null;
              const details = parseEntry(item.entry);

              return (
                <article
                  key={idx}
                  className="group bg-card border border-border rounded-[var(--radius)] overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 active:scale-[0.99]"
                >
                  <div className="p-4 sm:p-6">
                    {/* Time + Subject */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-5">
                      {/* Time Badge */}
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary/15 border border-primary/30 rounded-lg">
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-mono text-base sm:text-lg font-bold text-primary">
                            {item.time}
                          </span>
                        </div>
                      </div>

                      {/* Subject Name */}
                      <div className="flex-1">
                        {subjectName && (
                          <h2 className="text-lg sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                            {subjectName}
                          </h2>
                        )}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-border/50">
                      {/* Subject Code */}
                      {details.subjectCode && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                              />
                            </svg>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Code</span>
                          </div>
                          <p className="font-mono text-xs sm:text-sm font-semibold text-foreground break-all">
                            {details.subjectCode}
                          </p>
                        </div>
                      )}

                      {/* Batch */}
                      {details.batches && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Batch</span>
                          </div>
                          <p className="font-mono text-xs sm:text-sm font-semibold text-foreground">
                            {details.batches}
                          </p>
                        </div>
                      )}

                      {/* Teacher */}
                      {details.teacher && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Faculty</span>
                          </div>
                          <p className="font-mono text-xs sm:text-sm font-semibold text-foreground">
                            {details.teacher}
                          </p>
                        </div>
                      )}

                      {/* Classroom */}
                      {details.classroom && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Room</span>
                          </div>
                          <p className="font-mono text-xs sm:text-sm font-semibold text-foreground">
                            {details.classroom}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Full Entry */}
                    <div className="bg-muted/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-border/30">
                      <p className="text-xs leading-relaxed text-muted-foreground font-mono break-words">
                        {item.entry}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="text-center py-16 sm:py-24 bg-card border border-border rounded-[var(--radius)]">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-4">
                <span className="text-4xl sm:text-5xl">{isSunday ? "🌴" : "🎉"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2">
                {isSunday ? "It's a Holiday!" : "No Classes Today"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isSunday ? "Enjoy your Sunday!" : "Enjoy your day off!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
