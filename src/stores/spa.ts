import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Spa } from '@/types';

const DEFAULT_SPAS: Spa[] = [
    {
        id: 'spa-1',
        name: 'Spa Principal',
        themeColor: 'teal'
    },
    {
        id: 'spa-2',
        name: 'Spa Resort & Wellness',
        themeColor: 'purple'
    },
    {
        id: 'spa-3',
        name: 'Urban Spa Center',
        themeColor: 'blue'
    }
];

export const useSpaStore = defineStore('spa', () => {
    const spas = ref<Spa[]>([]);
    const currentSpaId = ref<string>('spa-1');

    function initialize() {
        const storedSpas = localStorage.getItem('spa-list');
        if (storedSpas) {
            try {
                spas.value = JSON.parse(storedSpas);
            } catch (e) {
                console.error('Error parsing spas', e);
                spas.value = DEFAULT_SPAS;
            }
        } else {
            spas.value = DEFAULT_SPAS;
        }

        const storedCurrent = localStorage.getItem('spa-current-id');
        if (storedCurrent && spas.value.find(s => s.id === storedCurrent)) {
            currentSpaId.value = storedCurrent;
        } else if (spas.value.length > 0) {
            currentSpaId.value = spas.value[0].id;
        }
    }

    watch(spas, (newVal) => {
        localStorage.setItem('spa-list', JSON.stringify(newVal));
    }, { deep: true });

    watch(currentSpaId, (newVal) => {
        localStorage.setItem('spa-current-id', newVal);
    });

    function setCurrentSpa(id: string) {
        if (spas.value.find(s => s.id === id)) {
            currentSpaId.value = id;
        }
    }

    function getSpaById(id: string) {
        return spas.value.find(s => s.id === id);
    }

    function addSpa(spa: Omit<Spa, 'id'>) {
        const newSpa: Spa = {
            ...spa,
            id: crypto.randomUUID()
        };
        spas.value.push(newSpa);
    }

    function updateSpa(id: string, updates: Partial<Spa>) {
        const index = spas.value.findIndex(s => s.id === id);
        if (index !== -1) {
            spas.value[index] = { ...spas.value[index], ...updates };
        }
    }

    function deleteSpa(id: string) {
        spas.value = spas.value.filter(s => s.id !== id);
        // If we deleted the current spa, switch to another
        if (currentSpaId.value === id) {
            currentSpaId.value = spas.value.length > 0 ? spas.value[0].id : '';
        }
    }

    return {
        spas,
        currentSpaId,
        initialize,
        setCurrentSpa,
        getSpaById,
        addSpa,
        updateSpa,
        deleteSpa
    };
});
