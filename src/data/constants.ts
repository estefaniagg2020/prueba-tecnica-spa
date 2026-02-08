export const DASHBOARD_CONSTANTS = {
    DEFAULT_USER_NAME: 'Usuario',
    REPORT_SIMULATION_MSG: 'Generando reporte semanal... (Funcionalidad Simulada)',
    TIP_OF_THE_DAY: 'Agrupa tratamientos similares en la misma sala para reducir tiempos.',
};

export const SCHEDULER_CONSTANTS = {
    STATUS_CONFIRMED: 'confirmed' as const,
    STATUS_PENDING: 'pending' as const,
    REVISE_BUTTON: 'Revisar',
    PENDING_CHANGES_MSG: (count: number) => `Tienes ${count} cambios pendientes de aprobar`,
    REVIEW_HINT: 'Revisa los bloques marcados con ⏳',
    QUICK_ACTIONS_TITLE: 'Acciones Rápidas',
    GENERATE_TEST_DATA: '⚡ Generar datos de prueba',
    QUICK_ADD_HINT: 'Selecciona una franja horaria en el calendario para añadir un turno rápidamente.',
    REGENERATE_CONFIRM: '¿Generar nuevos datos aleatorios? Esto borrará los cambios actuales.',
    APPROVE_SIMULATION_MSG: 'Esta funcionalidad aprobaría todos los cambios (simulado)',
    SAVE_SUCCESS_MSG: 'Cambios guardados correctamente',
    SAVE_PENDING_MSG: 'Cambios guardados. Esperando confirmación del manager.',
    DEFAULT_EVENT_TITLE: 'Evento'
};

export const THERAPIST_MANAGER = {
    PAGE_TITLE: 'Terapeutas',
    PAGE_SUBTITLE: 'Gestiona el equipo de profesionales',
    BTN_NEW: 'Nuevo Terapeuta',
    ROLE_MANAGER: 'Manager',
    ROLE_THERAPIST: 'Terapeuta',
    HOURS_SUFFIX: 'h / semana',
    MODAL_TITLE_EDIT: 'Editar Terapeuta',
    MODAL_TITLE_NEW: 'Nuevo Terapeuta',
    LABEL_NAME: 'Nombre Completo',
    LABEL_EMAIL: 'Email',
    LABEL_PHONE: 'Teléfono',
    LABEL_SPA: 'Spa Asignado',
    LABEL_LINKEDIN: 'URL perfil LinkedIn',
    LABEL_WEEKLY_HOURS: 'Horas Semanales',
    LABEL_PHOTO_URL: 'Foto URL',
    PLACEHOLDER_LINKEDIN: 'https://linkedin.com/in/...',
    PLACEHOLDER_PHOTO: 'URL de la foto de perfil',
    BTN_CANCEL: 'Cancelar',
    BTN_SAVE: 'Guardar Cambios',
    BTN_CREATE: 'Crear Terapeuta',
    DELETE_CONFIRM: '¿Estás seguro de que quieres eliminar este terapeuta?',
    NO_SPA: 'Sin Spa'
} as const;
