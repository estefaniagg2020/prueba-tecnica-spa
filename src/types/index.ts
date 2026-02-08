export type TherapistRole = 'manager' | 'therapist';

export type ServiceCategory = 'manual' | 'hydrotherapy' | 'aesthetic' | 'wellness';

export interface Service {
    id: string;
    name: string;
    category: ServiceCategory;
    duration: number; // minutes
    price: number;
    description?: string;
    requiresCabin?: boolean;
    requiresTherapist?: boolean;
}

export interface Spa {
  id: string;
  name: string;
  themeColor: string; // e.g., 'teal', 'blue', 'purple' for UI theming
  serviceIds?: string[];
}

export interface Therapist {
  id: string;
  name: string;
  photoUrl: string;
  linkedInUrl?: string;
  phoneNumber: string;
  email: string;
  weeklyHours: number; // e.g., 20 or 40
  color: string; // Hex code for their personalized calendar color
  role: TherapistRole;
  spaId: string;
}

export type ScheduleBlockType = 'work' | 'vacation' | 'training' | 'admin' | 'other';

export interface ScheduleBlock {
  id: string;
  therapistId: string;
  start: string; // ISO 8601 Date String
  end: string; // ISO 8601 Date String
  type: ScheduleBlockType;
  title: string;
  description?: string;
  status?: 'confirmed' | 'pending';
}

export interface ViewOption {
  value: 'day' | 'week' | 'month';
  label: string;
}

