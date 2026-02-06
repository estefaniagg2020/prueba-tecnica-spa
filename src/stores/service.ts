
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Service } from '@/types';

const DEFAULT_SERVICES: Service[] = [
    // 1. Tratamientos Manuales
    {
        id: 'manual-1',
        name: 'Masaje Relajante',
        category: 'manual',
        duration: 60,
        price: 60,
        description: 'Masaje suave para eliminar estrés.',
        requiresTherapist: true,
        requiresCabin: true
    },
    {
        id: 'manual-2',
        name: 'Masaje Descontracturante',
        category: 'manual',
        duration: 50,
        price: 70,
        description: 'Masaje intenso para zonas doloridas.',
        requiresTherapist: true,
        requiresCabin: true
    },
    {
        id: 'manual-3',
        name: 'Tratamiento Facial Anti-Edad',
        category: 'manual',
        duration: 75,
        price: 90,
        description: 'Rejuvenecimiento facial completo.',
        requiresTherapist: true,
        requiresCabin: true
    },
    // 2. Hidroterapia
    {
        id: 'hydro-1',
        name: 'Circuito de Aguas',
        category: 'hydrotherapy',
        duration: 90,
        price: 35,
        description: 'Acceso a piscinas, sauna y baño turco.',
        requiresTherapist: false,
        requiresCabin: false // Requires installation capacity
    },
    {
        id: 'hydro-2',
        name: 'Bañera de Hidromasaje',
        category: 'hydrotherapy',
        duration: 30,
        price: 25,
        description: 'Baño privado con aceites.',
        requiresTherapist: false,
        requiresCabin: true // Cabin/Room
    },
    // 3. Estética
    {
        id: 'aesthetic-1',
        name: 'Manicura Spa',
        category: 'aesthetic',
        duration: 45,
        price: 40,
        requiresTherapist: true,
        requiresCabin: false
    },
    // 4. Bienestar
    {
        id: 'wellness-1',
        name: 'Yoga Privado',
        category: 'wellness',
        duration: 60,
        price: 50,
        requiresTherapist: true,
        requiresCabin: true // Hall
    }
];

export const useServiceStore = defineStore('service', () => {
    const services = ref<Service[]>(DEFAULT_SERVICES);

    function getServiceById(id: string) {
        return services.value.find(s => s.id === id);
    }
    
    function getServicesByCategory(category: string) {
        return services.value.filter(s => s.category === category);
    }

    return {
        services,
        getServiceById,
        getServicesByCategory
    };
});
