/**
 * Genera una URL de avatar estable a partir del nombre (iniciales).
 * Útil cuando no hay photoUrl o como fallback; la URL es determinista por nombre.
 */
export const getAvatarUrlForName = (name: string, size = 200): string => {
  const encoded = encodeURIComponent(name.trim() || '?');
  return `https://ui-avatars.com/api/?name=${encoded}&size=${size}&background=94a3b8&color=fff`;
};
