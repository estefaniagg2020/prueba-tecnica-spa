export type TherapistRole = 'manager' | 'therapist';

export interface Therapist {
  id: string;
  name: string;
  photoUrl: string;
  /** URL del perfil de LinkedIn (se persiste para enlazar foto y perfil). */
  linkedInUrl?: string;
  phoneNumber: string;
  email: string;
  weeklyHours: number;
  color: string;
  role: TherapistRole;
  spaId: string;
}
