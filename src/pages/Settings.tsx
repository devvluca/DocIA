import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Save,
  Upload,
  Crop,
  RotateCcw,
  Check
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useNavbar } from '@/contexts/NavbarContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { isCollapsed } = useNavbar();
  const { user, completeWelcomeSetup } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Estados para controle do crop
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedMainSpecialty, setSelectedMainSpecialty] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  const mainSpecialties = [
    'Médico',
    'Nutricionista', 
    'Cirurgião Dentista',
    'Fisioterapeuta',
    'Psicólogo',
    'Enfermeiro',
    'Farmacêutico',
    'Fonoaudiólogo',
    'Terapeuta Ocupacional',
    'Biomédico',
    'Veterinário'
  ];

  const medicalSpecialties = [
    'Clínico Geral',
    'Cardiologia',
    'Neurologia', 
    'Pediatria',
    'Ginecologia e Obstetrícia',
    'Ortopedia',
    'Dermatologia',
    'Psiquiatria',
    'Endocrinologia',
    'Gastroenterologia',
    'Pneumologia',
    'Urologia',
    'Oftalmologia',
    'Otorrinolaringologia',
    'Radiologia',
    'Anestesiologia',
    'Cirurgia Geral',
    'Medicina Interna',
    'Medicina de Família',
    'Oncologia',
    'Reumatologia'
  ];

  const getRegistrationLabel = (specialty: string) => {
    const labels: Record<string, string> = {
      'Médico': 'CRM',
      'Nutricionista': 'CRN',
      'Cirurgião Dentista': 'CRO',
      'Fisioterapeuta': 'CREFITO',
      'Psicólogo': 'CRP',
      'Enfermeiro': 'COREN',
      'Farmacêutico': 'CRF',
      'Fonoaudiólogo': 'CRFa',
      'Terapeuta Ocupacional': 'CREFITO',
      'Biomédico': 'CRBM',
      'Veterinário': 'CRMV'
    };
    
    // Se for uma especialidade médica, retorna CRM
    if (medicalSpecialties.includes(specialty)) {
      return 'CRM';
    }
    
    return labels[specialty] || 'Registro Profissional';
  };

  // Função para carregar dados do localStorage e integrar com auth context
  const loadUserProfile = () => {
    const saved = localStorage.getItem('userProfile');
    
    // Se há dados salvos no localStorage, usar eles
    if (saved) {
      const savedProfile = JSON.parse(saved);
      
      // Se há dados do usuário do auth context, sincronizar
      if (user) {
        return {
          ...savedProfile,
          name: user.name || savedProfile.name,
          email: user.email || savedProfile.email,
          // Detectar gênero baseado no título
          gender: user.title === 'Dr.' ? 'M' : user.title === 'Dra.' ? 'F' : savedProfile.gender
        };
      }
      
      return savedProfile;
    }
    
    // Se não há dados salvos, usar dados do auth context ou defaults
    if (user && user.name && user.title) {
      return {
        name: user.name,
        email: user.email || 'usuario@docia.com',
        specialty: user.isTestUser ? 'Clínico Geral' : 'Cardiologia',
        crm: user.isTestUser ? '' : '12345-SP',
        phone: '',
        bio: user.isTestUser ? '' : 'Profissional de saúde dedicado ao cuidado dos pacientes.',
        avatar: null,
        avatarColor: 'bg-blue-500',
        gender: user.title === 'Dr.' ? 'M' : user.title === 'Dra.' ? 'F' : 'M'
      };
    }
    
    // Default fallback
    return {
      name: 'Dr. João Silva',
      email: 'joao.silva@email.com',
      specialty: 'Cardiologia',
      crm: '12345-SP',
      phone: '(11) 99999-9999',
      bio: 'Cardiologista com 15 anos de experiência em diagnósticos cardiovasculares.',
      avatar: null,
      avatarColor: 'bg-blue-500',
      gender: 'M'
    };
  };

  const [userProfile, setUserProfile] = useState(loadUserProfile);
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  
  // Sincronizar com dados do auth context quando user mudar
  useEffect(() => {
    if (user && user.name && user.title) {
      setUserProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email || prev.email,
        gender: user.title === 'Dr.' ? 'M' : user.title === 'Dra.' ? 'F' : prev.gender
      }));
    }
  }, [user]);
  
  // Salvar automaticamente no localStorage quando o perfil mudar
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Detectar mudanças no perfil
  const handleProfileChange = (field: string, value: string) => {
    setUserProfile(prev => {
      const updated = { ...prev, [field]: value };
      
      // Se o gênero mudou, atualizar o nome para refletir o título correto
      if (field === 'gender' && prev.name) {
        const nameWithoutTitle = prev.name.replace(/^(Dr\.|Dra\.)/, '').trim();
        const newTitle = value === 'F' ? 'Dra.' : 'Dr.';
        updated.name = `${newTitle} ${nameWithoutTitle}`;
      }
      
      return updated;
    });
    setIsProfileChanged(true);
  };
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    whatsappAlerts: true,
    systemUpdates: false,
    appointmentConfirmations: true
  });  const handleSaveProfile = () => {
    // Salvar no localStorage (já está sendo feito automaticamente)
    setIsProfileChanged(false);
    
    // Atualizar também o contexto de autenticação se necessário
    if (user && (userProfile.name !== user.name)) {
      // Detectar título baseado no gênero ou manter o existente
      let title = user.title;
      if (!title) {
        title = userProfile.gender === 'F' ? 'Dra.' : 'Dr.';
      }
      
      // Atualizar contexto de autenticação
      const updatedUserData = {
        ...user,
        title: title,
        name: userProfile.name,
        email: userProfile.email
      };
      
      // Atualizar localStorage do auth context
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
    }
    
    toast.success('Alteração feita com sucesso!', {
      position: 'bottom-center',
      duration: 3000,
    });
  };  const handleSaveNotifications = () => {
    toast.success('Configurações de notificação salvas!', {
      position: 'bottom-center',
      duration: 3000,
    });
  };

  // Função para iniciar o crop da imagem
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCropImage(result);
        setImageLoaded(false);
        // Reset crop position to center when new image is loaded
        setCropPosition({ x: 0, y: 0 });
        setCropSize(200);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input para permitir upload da mesma imagem novamente
    event.target.value = '';
  };

  // Função para quando a imagem carregar no modal
  const handleImageLoad = () => {
    if (imageRef.current) {
      // Aguardar um frame para garantir que o layout foi calculado
      requestAnimationFrame(() => {
        if (!imageRef.current) return;
        
        const rect = imageRef.current.getBoundingClientRect();
        const img = imageRef.current;
        
        // Calcular as dimensões reais da imagem exibida considerando object-fit: contain
        const imgAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = rect.width / rect.height;
        
        let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
        
        if (imgAspectRatio > containerAspectRatio) {
          // Imagem mais larga - limitada pela largura
          displayWidth = rect.width;
          displayHeight = rect.width / imgAspectRatio;
          offsetY = (rect.height - displayHeight) / 2;
        } else {
          // Imagem mais alta - limitada pela altura
          displayHeight = rect.height;
          displayWidth = rect.height * imgAspectRatio;
          offsetX = (rect.width - displayWidth) / 2;
        }
        
        // Posicionar o crop no centro da área visível da imagem
        const centerX = offsetX + (displayWidth - cropSize) / 2;
        const centerY = offsetY + (displayHeight - cropSize) / 2;
        
        setCropPosition({ 
          x: Math.max(offsetX, Math.min(centerX, offsetX + displayWidth - cropSize)),
          y: Math.max(offsetY, Math.min(centerY, offsetY + displayHeight - cropSize))
        });
        
        setImageLoaded(true);
      });
    }
  };

  // Função para processar o crop da imagem
  const handleCrop = () => {
    if (!imageRef.current || !canvasRef.current || !imageLoaded || !cropImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Criar uma nova imagem para trabalhar com as dimensões originais
    const img = new Image();
    img.onload = () => {
      // Obter as dimensões da imagem como ela está sendo exibida no modal
      const imgElement = imageRef.current!;
      const containerRect = imgElement.getBoundingClientRect();
      
      // Calcular como a imagem está sendo redimensionada para caber no container
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Descobrir qual é a escala real aplicada à imagem
      let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
      
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const containerAspectRatio = containerWidth / containerHeight;
      
      if (imgAspectRatio > containerAspectRatio) {
        // A imagem é mais larga - será limitada pela largura
        displayWidth = containerWidth;
        displayHeight = containerWidth / imgAspectRatio;
        offsetY = (containerHeight - displayHeight) / 2;
      } else {
        // A imagem é mais alta - será limitada pela altura
        displayHeight = containerHeight;
        displayWidth = containerHeight * imgAspectRatio;
        offsetX = (containerWidth - displayWidth) / 2;
      }
      
      // Calcular a escala entre a imagem original e como ela está sendo exibida
      const scaleX = img.naturalWidth / displayWidth;
      const scaleY = img.naturalHeight / displayHeight;
      
      // Ajustar as coordenadas do crop considerando o offset
      const adjustedCropX = (cropPosition.x - offsetX) * scaleX;
      const adjustedCropY = (cropPosition.y - offsetY) * scaleY;
      const adjustedCropSize = cropSize * scaleX;
      
      // Garantir que as coordenadas estão dentro dos limites da imagem
      const finalCropX = Math.max(0, Math.min(adjustedCropX, img.naturalWidth - adjustedCropSize));
      const finalCropY = Math.max(0, Math.min(adjustedCropY, img.naturalHeight - adjustedCropSize));
      const finalCropSize = Math.max(1, Math.min(adjustedCropSize, img.naturalWidth - finalCropX, img.naturalHeight - finalCropY));
      
      // Configurar canvas para o resultado final
      const outputSize = 300;
      canvas.width = outputSize;
      canvas.height = outputSize;
      
      // Limpar canvas
      ctx.clearRect(0, 0, outputSize, outputSize);
      
      // Criar máscara circular
      ctx.save();
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      
      // Desenhar exatamente a área selecionada
      ctx.drawImage(
        img,
        finalCropX, finalCropY, finalCropSize, finalCropSize, // área fonte na imagem original
        0, 0, outputSize, outputSize // área destino no canvas
      );
      
      ctx.restore();
        // Converter para base64
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      handleProfileChange('avatar', croppedDataUrl);      setIsCropModalOpen(false);
      setCropImage(null);
      setImageLoaded(false);
      toast.success('Foto atualizada com sucesso!', {
        position: 'bottom-center',
        duration: 3000,
      });
    };
    
    // Usar a imagem original
    img.src = cropImage;
  };

  // Função para lidar com o mouse down no crop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageLoaded) return;
    e.preventDefault();
    setIsDragging(true);
  };

  // Função para lidar com o movimento do mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current || !imageLoaded) return;

    const rect = imageRef.current.getBoundingClientRect();
    const img = imageRef.current;
    
    // Calcular as dimensões reais da imagem exibida
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const containerAspectRatio = rect.width / rect.height;
    
    let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
    
    if (imgAspectRatio > containerAspectRatio) {
      displayWidth = rect.width;
      displayHeight = rect.width / imgAspectRatio;
      offsetY = (rect.height - displayHeight) / 2;
    } else {
      displayHeight = rect.height;
      displayWidth = rect.height * imgAspectRatio;
      offsetX = (rect.width - displayWidth) / 2;
    }
    
    // Coordenadas do mouse relativas ao container
    const x = e.clientX - rect.left - cropSize / 2;
    const y = e.clientY - rect.top - cropSize / 2;

    // Limitar as posições à área visível da imagem
    const maxX = offsetX + displayWidth - cropSize;
    const maxY = offsetY + displayHeight - cropSize;

    setCropPosition({
      x: Math.max(offsetX, Math.min(maxX, x)),
      y: Math.max(offsetY, Math.min(maxY, y))
    });
  };

  // Função para parar o drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Função para lidar com touch events (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageLoaded) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !imageRef.current || !imageLoaded) return;

    const touch = e.touches[0];
    const rect = imageRef.current.getBoundingClientRect();
    const img = imageRef.current;
    
    // Calcular as dimensões reais da imagem exibida
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const containerAspectRatio = rect.width / rect.height;
    
    let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
    
    if (imgAspectRatio > containerAspectRatio) {
      displayWidth = rect.width;
      displayHeight = rect.width / imgAspectRatio;
      offsetY = (rect.height - displayHeight) / 2;
    } else {
      displayHeight = rect.height;
      displayWidth = rect.height * imgAspectRatio;
      offsetX = (rect.width - displayWidth) / 2;
    }
    
    const x = touch.clientX - rect.left - cropSize / 2;
    const y = touch.clientY - rect.top - cropSize / 2;

    const maxX = offsetX + displayWidth - cropSize;
    const maxY = offsetY + displayHeight - cropSize;

    setCropPosition({
      x: Math.max(offsetX, Math.min(maxX, x)),
      y: Math.max(offsetY, Math.min(maxY, y))
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Atualizar posição do crop quando o tamanho mudar - ajustada
  const handleCropSizeChange = (newSize: number) => {
    if (!imageRef.current || !imageLoaded) {
      setCropSize(newSize);
      return;
    }

    const rect = imageRef.current.getBoundingClientRect();
    const img = imageRef.current;
    
    // Calcular área visível da imagem
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const containerAspectRatio = rect.width / rect.height;
    
    let displayWidth, displayHeight, offsetX = 0, offsetY = 0;
    
    if (imgAspectRatio > containerAspectRatio) {
      displayWidth = rect.width;
      displayHeight = rect.width / imgAspectRatio;
      offsetY = (rect.height - displayHeight) / 2;
    } else {
      displayHeight = rect.height;
      displayWidth = rect.height * imgAspectRatio;
      offsetX = (rect.width - displayWidth) / 2;
    }

    const maxX = offsetX + displayWidth - newSize;
    const maxY = offsetY + displayHeight - newSize;

    // Ajustar posição se necessário
    setCropPosition(prev => ({
      x: Math.max(offsetX, Math.min(maxX, prev.x)),
      y: Math.max(offsetY, Math.min(maxY, prev.y))
    }));
    
    setCropSize(newSize);
  };

  const getInitials = (name: string): string => {
    if (!name || typeof name !== 'string') return 'U';
    
    return name
      .split(' ')
      .filter(word => word.length > 0 && word.toLowerCase() !== 'dr.' && word.toLowerCase() !== 'dr')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };  const handleRemovePhoto = () => {
    handleProfileChange('avatar', null);
    toast.success('Foto removida com sucesso!', {
      position: 'bottom-center',
      duration: 3000,
    });
  };
  return (
    <div className={`min-h-screen bg-background pt-16 lg:pt-2 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Gerencie suas preferências e configurações do sistema</p>
          </div>
        </div>        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 lg:space-y-6">
          <div className="relative">
            <TabsList className="grid w-full grid-cols-3 relative bg-muted p-1 h-auto">
              {/* Animated background slider */}
              <div 
                className={`absolute top-1 bottom-1 bg-background rounded-md shadow-sm transition-all duration-300 ease-in-out z-0 ${
                  activeTab === 'profile' 
                    ? 'left-1 w-[calc(33.333%-4px)]' 
                    : activeTab === 'notifications' 
                      ? 'left-[33.333%] w-[calc(33.333%-2px)]' 
                      : 'left-[66.666%] w-[calc(33.333%-4px)]'
                }`}
              />
              
              <TabsTrigger 
                value="profile" 
                className={`flex items-center gap-2 relative z-10 transition-all duration-300 ${
                  activeTab === 'profile' 
                    ? 'text-foreground shadow-none bg-transparent' 
                    : 'text-muted-foreground bg-transparent hover:text-foreground'
                }`}
              >
                <User className={`w-4 h-4 transition-transform duration-300 ${
                  activeTab === 'profile' ? 'scale-110' : 'scale-100'
                }`} />
                <span className="font-medium">Perfil</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="notifications" 
                className={`flex items-center gap-2 relative z-10 transition-all duration-300 ${
                  activeTab === 'notifications' 
                    ? 'text-foreground shadow-none bg-transparent' 
                    : 'text-muted-foreground bg-transparent hover:text-foreground'
                }`}
              >
                <Bell className={`w-4 h-4 transition-transform duration-300 ${
                  activeTab === 'notifications' ? 'scale-110' : 'scale-100'
                }`} />
                <span className="font-medium">Notificações</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="security" 
                className={`flex items-center gap-2 relative z-10 transition-all duration-300 ${
                  activeTab === 'security' 
                    ? 'text-foreground shadow-none bg-transparent' 
                    : 'text-muted-foreground bg-transparent hover:text-foreground'
                }`}
              >
                <Shield className={`w-4 h-4 transition-transform duration-300 ${
                  activeTab === 'security' ? 'scale-110' : 'scale-100'
                }`} />
                <span className="font-medium">Segurança</span>
              </TabsTrigger>
            </TabsList>
          </div>          {/* Perfil */}
          <TabsContent value="profile">
            <Card className="min-h-[600px] card-gradient shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 h-full">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback className={`${userProfile.avatarColor || 'bg-blue-500'} text-white text-lg`}>
                      {getInitials(userProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <label htmlFor="photo-upload">
                        <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                          <span>
                            <Upload className="w-4 h-4" />
                            {userProfile.avatar ? 'Alterar Foto' : 'Adicionar Foto'}
                          </span>
                        </Button>
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      {userProfile.avatar && (
                        <Button 
                          variant="outline" 
                          onClick={handleRemovePhoto}
                          className="text-destructive hover:text-destructive"
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {userProfile.avatar 
                        ? 'Foto personalizada carregada' 
                        : 'Usando iniciais como avatar'
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="input-enhanced"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gênero</Label>
                    <Select 
                      value={userProfile.gender || 'M'} 
                      onValueChange={(value) => handleProfileChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino (Dr.)</SelectItem>
                        <SelectItem value="F">Feminino (Dra.)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="input-enhanced"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialty">Área de Atuação</Label>
                    <Select 
                      value={selectedMainSpecialty || userProfile.specialty} 
                      onValueChange={(value) => {
                        setSelectedMainSpecialty(value);
                        if (value !== 'Médico') {
                          handleProfileChange('specialty', value);
                        } else {
                          // Se escolher Médico, automaticamente seta "Clínico Geral"
                          handleProfileChange('specialty', 'Clínico Geral');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua área" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainSpecialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Submenu de especialidades médicas */}
                  {selectedMainSpecialty === 'Médico' && (
                    <div>
                      <Label htmlFor="medical-specialty">Especialidade Médica</Label>
                      <Select 
                        value={userProfile.specialty} 
                        onValueChange={(value) => handleProfileChange('specialty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a especialidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicalSpecialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="crm">{getRegistrationLabel(userProfile.specialty)}</Label>                    <Input
                      id="crm"
                      value={userProfile.crm}
                      onChange={(e) => handleProfileChange('crm', e.target.value)}
                      placeholder={`Ex: ${getRegistrationLabel(userProfile.specialty)} 12345-SP`}
                      className="input-enhanced"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="input-enhanced"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografia</Label>                  <Textarea
                    id="bio"
                    value={userProfile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    placeholder="Descreva sua experiência profissional..."
                    className="input-enhanced min-h-24"
                  />
                </div>                <Button onClick={handleSaveProfile} className="gap-2 medical-gradient">
                  <Check className="w-4 h-4" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>          {/* Notificações */}
          <TabsContent value="notifications">
            <Card className="min-h-[600px] card-gradient shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 h-full flex flex-col">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-reminders">Lembretes por Email</Label>
                      <p className="text-sm text-muted-foreground">Receber lembretes de consultas por email</p>
                    </div>
                    <Switch
                      id="email-reminders"
                      checked={notifications.emailReminders}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailReminders: checked})}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="whatsapp-alerts">Alertas WhatsApp</Label>
                      <p className="text-sm text-muted-foreground">Receber alertas importantes via WhatsApp</p>
                    </div>
                    <Switch
                      id="whatsapp-alerts"
                      checked={notifications.whatsappAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, whatsappAlerts: checked})}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">Atualizações do Sistema</Label>
                      <p className="text-sm text-muted-foreground">Notificações sobre novas funcionalidades</p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appointment-confirmations">Confirmações de Consulta</Label>
                      <p className="text-sm text-muted-foreground">Solicitar confirmação de consultas aos pacientes</p>
                    </div>
                    <Switch
                      id="appointment-confirmations"
                      checked={notifications.appointmentConfirmations}
                      onCheckedChange={(checked) => setNotifications({...notifications, appointmentConfirmations: checked})}
                    />
                  </div>
                </div>

                <div className="mt-auto pt-6">                  <Button onClick={handleSaveNotifications} className="gap-2 medical-gradient">
                    <Save className="w-4 h-4" />
                    Salvar Preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>          {/* Segurança */}
          <TabsContent value="security">
            <Card className="min-h-[600px] card-gradient shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Segurança e Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 h-full flex flex-col">
                <div className="flex-1 space-y-6">
                  <div>
                    <Label>Alterar Senha</Label>                    <div className="space-y-4 mt-2">
                      <Input type="password" placeholder="Senha atual" className="input-enhanced" />
                      <Input type="password" placeholder="Nova senha" className="input-enhanced" />
                      <Input type="password" placeholder="Confirmar nova senha" className="input-enhanced" />
                      <Button className="medical-gradient">Alterar Senha</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Autenticação de Dois Fatores</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                    <Button variant="outline">Configurar 2FA</Button>
                  </div>

                  <Separator />

                  <div>
                    <Label>Backup dos Dados</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Faça backup dos seus dados regularmente
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2">
                        <Database className="w-4 h-4" />
                        Fazer Backup
                      </Button>
                      <Button variant="outline">Agendar Backup Automático</Button>
                    </div>
                  </div>
                </div>

                {/* Spacer para manter consistência visual */}
                <div className="flex-1"></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>      </div>

      {/* Modal de Crop da Imagem */}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="w-5 h-5" />
              Redimensionar Foto
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cropImage && (
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  ref={imageRef}
                  src={cropImage}
                  alt="Crop preview"
                  className="w-full h-80 object-contain select-none"
                  onLoad={handleImageLoad}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{ 
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none'
                  }}
                  draggable={false}
                />
                
                {/* Overlay de crop circular */}
                {imageLoaded && (
                  <div
                    className="absolute border-4 border-primary rounded-full bg-transparent pointer-events-none"
                    style={{
                      width: cropSize,
                      height: cropSize,
                      left: cropPosition.x,
                      top: cropPosition.y,
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                      transition: isDragging ? 'none' : 'all 0.1s ease'
                    }}
                  >
                    {/* Indicador central */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full opacity-80" />
                  </div>
                )}

                {/* Loading indicator */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm">Carregando imagem...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Tamanho do Crop: {cropSize}px</Label>
                <input
                  type="range"
                  min="100"
                  max="400"
                  step="10"
                  value={cropSize}
                  onChange={(e) => handleCropSizeChange(parseInt(e.target.value))}
                  className="w-full mt-2"
                  disabled={!imageLoaded}
                />
              </div>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {imageLoaded 
                    ? 'Arraste o círculo para posicionar e ajuste o tamanho com o slider'
                    : 'Aguarde o carregamento da imagem...'
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCropModalOpen(false);
                  setCropImage(null);
                  setImageLoaded(false);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCrop}
                disabled={!imageLoaded}
                className="flex-1 medical-gradient text-white disabled:opacity-50"
              >
                <Crop className="w-4 h-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </div>
          
          {/* Canvas oculto para processamento */}
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
