import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Therapist } from '@/types';

// Helper to generate a random pastel color
function generatePastelColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
}

const DEFAULT_THERAPISTS: Therapist[] = [
  {
    id: '1',
    name: 'Vicente Vicente Mulero',
    photoUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQH9mUPVPbbYAg/profile-displayphoto-crop_800_800/B4DZrCbBwOJMAI-/0/1764198457439?e=1772064000&v=beta&t=EoPQ08z8ojMmJ0gYD7th74S6Ihtv3C03bb4XpXEKpK4',
    phoneNumber: '+34 600 000 001',
    email: 'vicente@spalopia.com',
    weeklyHours: 40,
    color: '#D1E8E2',
    role: 'therapist',
    spaId: 'spa-1'
  },
  {
    id: '2',
    name: 'Marcel-lí P.',
    photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    phoneNumber: '+34 600 000 002',
    email: 'marcel@spalopia.com',
    weeklyHours: 40,
    color: '#D9E2F3',
    role: 'therapist',
    spaId: 'spa-1'
  },
  {
    id: '3',
    name: 'Eleazar Pérez Arencibia',
    photoUrl: 'https://media.licdn.com/dms/image/v2/C4D03AQGWscT2sfFZFg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1587233316749?e=1772064000&v=beta&t=BoevnATWqz3u2uf39vK6Wffru4tp2gRq-8arrzkpxsM',
    phoneNumber: '+34 600 000 003',
    email: 'eleazar@spalopia.com',
    weeklyHours: 40,
    color: '#F9E4D4',
    role: 'therapist',
    spaId: 'spa-1'
  },
  {
    id: '4',
    name: 'Rayco Alonso de la Rosa',
    photoUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
    phoneNumber: '+34 600 000 004',
    email: 'rayco@spalopia.com',
    weeklyHours: 35,
    color: '#E2D4F9',
    role: 'therapist',
    spaId: 'spa-2'
  },
  {
    id: '5',
    name: 'Antonio José Medina Rivero',
    photoUrl: 'https://media.licdn.com/dms/image/v2/C5603AQGB4YDhpsw9Jg/profile-displayphoto-crop_800_800/0/1516877478062?e=1772064000&v=beta&t=hSNtAuwg55kIHaPT27Ui3ebbnuFsZLgfBNhmfTIxw2k',
    phoneNumber: '+34 600 000 005',
    email: 'antonio@spalopia.com',
    weeklyHours: 40,
    color: '#FFD1DC',
    role: 'manager',
    spaId: 'spa-2'
  },
  {
    id: '6',
    name: 'Natalia Ramos García',
    photoUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQH9mUPVPbbYAg/profile-displayphoto-scale_200_200/B4DZrCbBwOJMAY-/0/1764198457522?e=1772064000&v=beta&t=e37EyAYMkPKbgN4zPGGWvZ4TzTuz_IY9EXHBNrM1rMQ',
    phoneNumber: '+34 600 000 006',
    email: 'natalia@spalopia.com',
    weeklyHours: 30,
    color: '#C1E1C1', // Pastel Green
    role: 'therapist',
    spaId: 'spa-3'
  },
  {
    id: '7',
    name: 'Javier García Cabrera',
    photoUrl: '',
    phoneNumber: '+34 600 000 007',
    email: 'javier.garcia@spalopia.com',
    weeklyHours: 40,
    color: '#AEC6CF', // Pastel Blue
    role: 'therapist',
    spaId: 'spa-3'
  },
  {
    id: '8',
    name: 'Javier Albelo',
    photoUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
    phoneNumber: '+34 600 000 008',
    email: 'javier.albelo@spalopia.com',
    weeklyHours: 20,
    color: '#B39EB5', // Pastel Purple
    role: 'therapist',
    spaId: 'spa-3'
  }
];

export const useTherapistStore = defineStore('therapist', () => {
  const therapists = ref<Therapist[]>([]);

  // Load from local storage or set defaults
  function initialize() {
    const stored = localStorage.getItem('spa-therapists-final');
    if (stored) {
      try {
        therapists.value = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing therapists from local storage', e);
        therapists.value = DEFAULT_THERAPISTS;
      }
    } else {
      therapists.value = DEFAULT_THERAPISTS;
    }
  }

  // Persist changes
  watch(therapists, (newVal) => {
    localStorage.setItem('spa-therapists-final', JSON.stringify(newVal));
  }, { deep: true });

  function addTherapist(therapist: Omit<Therapist, 'id' | 'color'> & { color?: string }) {
    const newTherapist: Therapist = {
      ...therapist,
      id: crypto.randomUUID(),
      color: therapist.color || generatePastelColor(),
      role: 'therapist'
    };
    therapists.value.push(newTherapist);
  }

  function updateTherapist(id: string, updates: Partial<Therapist>) {
    const index = therapists.value.findIndex(t => t.id === id);
    if (index !== -1) {
      therapists.value[index] = { ...therapists.value[index], ...updates };
    }
  }

  function deleteTherapist(id: string) {
    therapists.value = therapists.value.filter(t => t.id !== id);
  }

  function getTherapistById(id: string) {
    return therapists.value.find(t => t.id === id);
  }

  return {
    therapists,
    initialize,
    addTherapist,
    updateTherapist,
    deleteTherapist,
    getTherapistById
  };
});
