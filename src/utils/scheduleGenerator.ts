import type { ScheduleBlock, Therapist } from '../types';
import { useScheduleStore } from '../stores/schedule';

export function generateAllSchedules(therapists: Therapist[], baseDate: Date = new Date()) {
    const store = useScheduleStore();
    
    // Clear existing for a clean slate if needed, or just append. 
    // For now, we assume we append or fill.

    const startOfWeek = new Date(baseDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
    startOfWeek.setDate(diff); // Monday
    startOfWeek.setHours(0,0,0,0);

    const blocks: Omit<ScheduleBlock, 'id'>[] = [];

    therapists.forEach(therapist => {
        // Deterministic randomness based on therapist ID for consistancy across reloads if we wanted, 
        // but simple math.random is fine for this demo.
        
        // 5 days a week work pattern for most
        for (let i = 0; i < 5; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);

            // Random chance of vacation or absence (5%)
            if (Math.random() < 0.05) {
                blocks.push({
                    therapistId: therapist.id,
                    start: setTime(currentDay, 9, 0),
                    end: setTime(currentDay, 17, 0),
                    type: 'vacation',
                    title: 'Día Libre',
                    description: 'Descanso personal'
                });
                continue;
            }

            // Shifts based on weekly hours roughly
            if (therapist.weeklyHours >= 35) {
                // Long shifts or split
                if (Math.random() > 0.5) {
                    // Split
                    blocks.push({
                        therapistId: therapist.id,
                        start: setTime(currentDay, 9, 0),
                        end: setTime(currentDay, 13, 30),
                        type: 'work',
                        title: 'Mañana',
                    });
                    blocks.push({
                        therapistId: therapist.id,
                        start: setTime(currentDay, 16, 0),
                        end: setTime(currentDay, 19, 30),
                        type: 'work',
                        title: 'Tarde',
                    });
                } else {
                    // Continuous
                    blocks.push({
                        therapistId: therapist.id,
                        start: setTime(currentDay, 10, 0),
                        end: setTime(currentDay, 18, 0),
                        type: 'work',
                        title: 'Jornada Continua',
                    });
                }
            } else {
                // Part time - mostly mornings or afternoons
                const isMorning = Math.random() > 0.5;
                if (isMorning) {
                    blocks.push({
                        therapistId: therapist.id,
                        start: setTime(currentDay, 9, 0),
                        end: setTime(currentDay, 13, 0),
                        type: 'work',
                        title: 'Mañana',
                    });
                } else {
                     blocks.push({
                        therapistId: therapist.id,
                        start: setTime(currentDay, 15, 0),
                        end: setTime(currentDay, 19, 0),
                        type: 'work',
                        title: 'Tarde',
                    });
                }
            }

            // Occasional Training/Admin (10%)
            if (Math.random() < 0.1) {
                 blocks.push({
                    therapistId: therapist.id,
                    start: setTime(currentDay, 8, 0),
                    end: setTime(currentDay, 9, 0),
                    type: 'admin',
                    title: 'Reunión',
                });
            }
        }
    });

    blocks.forEach(b => store.addBlock(b));
}

function setTime(date: Date, h: number, m: number) {
    const d = new Date(date);
    d.setHours(h, m, 0);
    return d.toISOString();
}
