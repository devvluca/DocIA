// Utilitários para gerenciar dados do usuário entre Settings e outras páginas

export const getUserProfile = () => {
  const saved = localStorage.getItem('userProfile');
  const authData = localStorage.getItem('userData');
  
  let profile = null;
  let authUser = null;
  
  if (saved) {
    profile = JSON.parse(saved);
  }
  
  if (authData) {
    authUser = JSON.parse(authData);
  }
  
  // Combinar dados de ambas as fontes, priorizando o userProfile para dados de perfil
  if (profile && authUser) {
    return {
      ...profile,
      email: authUser.email || profile.email,
      isTestUser: authUser.isTestUser || false,
      isPaidUser: authUser.isPaidUser || false,
      planType: authUser.planType || ''
    };
  }
  
  // Fallback para dados do auth se não há perfil salvo
  if (authUser) {
    return {
      name: authUser.name || 'Dr. Usuário',
      email: authUser.email || 'usuario@docia.com',
      specialty: 'Clínico Geral',
      crm: '',
      phone: '',
      bio: '',
      avatar: null,
      avatarColor: 'bg-blue-500',
      gender: authUser.title === 'Dr.' ? 'M' : authUser.title === 'Dra.' ? 'F' : 'M',
      isTestUser: authUser.isTestUser || false,
      isPaidUser: authUser.isPaidUser || false,
      planType: authUser.planType || ''
    };
  }
  
  // Default fallback
  return {
    name: 'Dr. Usuário',
    email: 'usuario@docia.com',
    specialty: 'Clínico Geral',
    crm: '',
    phone: '',
    bio: '',
    avatar: null,
    avatarColor: 'bg-blue-500',
    gender: 'M',
    isTestUser: false,
    isPaidUser: false,
    planType: ''
  };
};

export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return 'U';
  
  return name
    .split(' ')
    .filter(word => word.length > 0 && word.toLowerCase() !== 'dr.' && word.toLowerCase() !== 'dra.')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

export const getFirstName = (name: string): string => {
  if (!name || typeof name !== 'string') return 'Usuário';
  
  const cleanName = name.replace(/^(Dr\.|Dra\.)/, '').trim();
  return cleanName.split(' ')[0] || 'Usuário';
};

export const getDisplayTitle = (name: string, gender: string): string => {
  if (name && name.includes('Dr.')) return name;
  if (name && name.includes('Dra.')) return name;
  
  const title = gender === 'F' ? 'Dra.' : 'Dr.';
  const cleanName = name ? name.replace(/^(Dr\.|Dra\.)/, '').trim() : 'Usuário';
  
  return `${title} ${cleanName}`;
};
