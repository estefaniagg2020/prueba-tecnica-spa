import { ref, reactive, computed, onMounted } from 'vue';
import { useTherapistStore } from '@/stores/therapist';
import { useSpaStore } from '@/stores/spa';
import type { Therapist } from '@/interfaces';
import { THERAPIST_MANAGER } from '@/data/constants';

const DEFAULT_IDS_ORDER = ['1', '2', '3', '4', '5', '6', '7', '8'];

export type TherapistFormState = {
  name: string;
  email: string;
  phoneNumber: string;
  weeklyHours: number;
  photoUrl: string;
  linkedInUrl: string | undefined;
  role: 'therapist' | 'manager';
  spaId: string;
};

const getInitialForm = (): TherapistFormState => ({
  name: '',
  email: '',
  phoneNumber: '',
  weeklyHours: 40,
  photoUrl: '',
  linkedInUrl: undefined,
  role: 'therapist',
  spaId: ''
});

export const useTherapistManager = () => {
  const store = useTherapistStore();
  const spaStore = useSpaStore();

  const isModalOpen = ref(false);
  const isEditing = ref(false);
  const editingId = ref<string | null>(null);
  const form = reactive<TherapistFormState>(getInitialForm());

  const orderedTherapists = computed(() => {
    const list = store.therapists;
    const byId = new Map(list.map((t) => [t.id, t]));
    const result: Therapist[] = [];
    for (const id of DEFAULT_IDS_ORDER) {
      const t = byId.get(id);
      if (t) result.push(t);
    }
    for (const t of list) {
      if (!DEFAULT_IDS_ORDER.includes(t.id)) result.push(t);
    }
    return result;
  });

  const resetForm = () => {
    Object.assign(form, getInitialForm());
    form.spaId = spaStore.spas[0]?.id ?? '';
  };

  const openCreateModal = () => {
    isEditing.value = false;
    editingId.value = null;
    resetForm();
    form.photoUrl = `https://i.pravatar.cc/150?u=${Date.now()}`;
    isModalOpen.value = true;
  };

  const editTherapist = (therapist: Therapist) => {
    isEditing.value = true;
    editingId.value = therapist.id;
    form.name = therapist.name;
    form.email = therapist.email;
    form.phoneNumber = therapist.phoneNumber;
    form.weeklyHours = therapist.weeklyHours;
    form.photoUrl = therapist.photoUrl;
    form.linkedInUrl = therapist.linkedInUrl ?? '';
    form.role = therapist.role as 'therapist' | 'manager';
    form.spaId = therapist.spaId || (spaStore.spas[0]?.id ?? '');
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const saveTherapist = () => {
    if (!form.spaId && spaStore.spas.length > 0) {
      form.spaId = spaStore.spas[0].id;
    }
    const payload = {
      ...form,
      linkedInUrl: form.linkedInUrl?.trim() || undefined
    };
    if (isEditing.value && editingId.value) {
      store.updateTherapist(editingId.value, payload);
    } else {
      store.addTherapist(payload);
    }
    closeModal();
  };

  const deleteTherapist = (id: string) => {
    if (confirm(THERAPIST_MANAGER.DELETE_CONFIRM)) {
      store.deleteTherapist(id);
    }
  };

  const getSpaName = (id: string) => {
    const spa = spaStore.getSpaById(id);
    return spa ? spa.name : THERAPIST_MANAGER.NO_SPA;
  };

  onMounted(() => {
    store.initialize();
    spaStore.initialize();
  });

  return {
    orderedTherapists,
    isModalOpen,
    isEditing,
    form,
    spaStore,
    openCreateModal,
    editTherapist,
    closeModal,
    saveTherapist,
    deleteTherapist,
    getSpaName
  };
};
