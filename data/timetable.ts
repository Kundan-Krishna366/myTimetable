export type TimetableEntry = {
  time: string;
  entry: string;
};

export type Timetable = {
  [day: string]: TimetableEntry[];
};

export const timetable: Timetable = {
  MON: [
    { time: "09:00 AM - 09:55 AM", entry: "P-25B17CI471 24A12 (HSL) CL9_1" },
    { time: "10:00 AM - 10:55 AM", entry: "P-25B17CI471 24A12 (HSL) CL9_1" },
    { time: "11:00 AM - 11:55 AM", entry: "P-25B17CI473 24A12 (RBT) CL6" },
    { time: "12:00 PM - 12:55 PM", entry: "P-25B17CI473 24A12 (RBT) CL6" },
    { time: "02:00 PM - 02:55 PM", entry: "L-25B1WHS434 (RTK) LT3" },
    { time: "04:00 PM - 04:55 PM", entry: "L-25B11CI413 24A11,24A12,24A13 (RBT) LT2" },
  ],

  TUE: [
    { time: "09:00 AM - 09:55 AM", entry: "L-25B11CI411 24A11,24A12,24A13 (ALK) CR7" },
    { time: "10:00 AM - 10:55 AM", entry: "L-25B1WCI431 24A11,24A12,24A13 (ATA) CR10" },
    { time: "11:00 AM - 11:55 AM", entry: "P-25B17CI476 24A12 (MGN) CL9_1" },
    { time: "12:00 PM - 12:55 PM", entry: "P-25B17CI476 24A12 (MGN) CL9_1" },
    { time: "02:00 PM - 02:55 PM", entry: "L-25B1WHS434 (RTK) LT2" },
    { time: "05:00 PM - 05:55 PM", entry: "L-25B1WHS434 (RTK) LT2" },
  ],

  WED: [
    { time: "09:00 AM - 09:55 AM", entry: "L-25B11CI414 24A11,24A12,24A13 (SRJ) CR6" },
    { time: "10:00 AM - 10:55 AM", entry: "L-25B11GE411 24A11,24A12,24A13 (TYN) CR2" },
    { time: "11:00 AM - 11:55 AM", entry: "L-25B11CI412 24A11,24A12,24A13 (AKJ) CR8" },
    { time: "12:00 PM - 12:55 PM", entry: "L-25B11CI413 24A11,24A12,24A13 (RBT) LT2" },
    { time: "03:00 PM - 03:55 PM", entry: "P-25B1WCI471 B12[24A12] (ATA) CL5_2" },
    { time: "04:00 PM - 04:55 PM", entry: "P-25B1WCI471 B12[24A12] (ATA) CL5_2" },
    { time: "05:00 PM - 05:55 PM", entry: "L-25B1WHS434 (RTK) LT2" },
  ],

  THU: [
    { time: "09:00 AM - 09:55 AM", entry: "L-25B11CI414 24A11,24A12,24A13 (SRJ) CR9" },
    { time: "10:00 AM - 10:55 AM", entry: "L-25B11GE411 24A11,24A12,24A13 (TYN) CR8" },
    { time: "11:00 AM - 11:55 AM", entry: "L-25B11CI411 24A11,24A12,24A13 (ALK) CR2" },
    { time: "12:00 PM - 12:55 PM", entry: "L-25B11CI413 24A11,24A12,24A13 (RBT) CR7" },
    { time: "02:00 PM - 02:55 PM", entry: "L-25B1WHS434 (RTK) LT2" },
    { time: "03:00 PM - 03:55 PM", entry: "L-25B11CI412 24A11,24A12,24A13 (AKJ) CR7" },
  ],

  FRI: [
    { time: "09:00 AM - 09:55 AM", entry: "L-25B11CI414 24A11,24A12,24A13 (SRJ) LT3" },
    { time: "10:00 AM - 10:55 AM", entry: "L-25B1WCI431 24A11,24A12,24A13 (ATA) CR10" },
    { time: "11:00 AM - 11:55 AM", entry: "P-25B17CI472 24A12 (AKJ) CL4" },
    { time: "12:00 PM - 12:55 PM", entry: "P-25B17CI472 24A12 (AKJ) CL4" },
    { time: "04:00 PM - 04:55 PM", entry: "L-25B11GE411 24A11,24A12,24A13 (TYN) LT3" },
    { time: "05:00 PM - 05:55 PM", entry: "L-25B1WHS434 (RTK) LT2" },
  ],

  SAT: [
    { time: "09:00 AM - 09:55 AM", entry: "L-25B11CI411 24A11,24A12,24A13 (ALK) CR5" },
    { time: "10:00 AM - 10:55 AM", entry: "L-25B11CI412 24A11,24A12,24A13 (AKJ) CR5" },
    { time: "11:00 AM - 11:55 AM", entry: "T-25B11CI412 24A12 (AKJ) TR7" },
  ],
};
