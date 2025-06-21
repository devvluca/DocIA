
import React, { useState, useEffect } from 'react';
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
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Save,
  Upload
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  
  // Função para carregar dados do localStorage
  const loadUserProfile = () => {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      name: 'Dr. João Silva',
      email: 'joao.silva@email.com',
      specialty: 'Cardiologia',
      crm: '12345-SP',
      phone: '(11) 99999-9999',
      bio: 'Cardiologista com 15 anos de experiência em diagnósticos cardiovasculares.'
    };
  };

  const [userProfile, setUserProfile] = useState(loadUserProfile);
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  
  // Salvar automaticamente no localStorage quando o perfil mudar
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Detectar mudanças no perfil
  const handleProfileChange = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
    setIsProfileChanged(true);
  };
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    whatsappAlerts: true,
    systemUpdates: false,
    appointmentConfirmations: true
  });
  const handleSaveProfile = () => {
    // Os dados já estão sendo salvos automaticamente no localStorage
    setIsProfileChanged(false);
    alert('Perfil atualizado com sucesso!');
  };
  const handleSaveNotifications = () => {
    // Simulação de salvamento
    alert('Configurações de notificação atualizadas!');
  };
  return (
    <div className="min-h-screen bg-background lg:pl-64 pt-16 lg:pt-0">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Gerencie suas preferências e configurações do sistema</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-4 lg:space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Perfil */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-lg">
                      {userProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Alterar Foto
                  </Button>
                </div><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialty">Especialidade</Label>
                    <Select value={userProfile.specialty} onValueChange={(value) => handleProfileChange('specialty', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                        <SelectItem value="Psicologia">Psicologia</SelectItem>
                        <SelectItem value="Nutrição">Nutrição</SelectItem>
                        <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                        <SelectItem value="Pediatria">Pediatria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="crm">CRM/CRP</Label>
                    <Input
                      id="crm"
                      value={userProfile.crm}
                      onChange={(e) => handleProfileChange('crm', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={userProfile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    placeholder="Descreva sua experiência profissional..."
                  />
                </div>

                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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

                <Button onClick={handleSaveNotifications} className="gap-2">
                  <Save className="w-4 h-4" />
                  Salvar Preferências
                </Button>              </CardContent>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Segurança e Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Alterar Senha</Label>
                  <div className="space-y-4 mt-2">
                    <Input type="password" placeholder="Senha atual" />
                    <Input type="password" placeholder="Nova senha" />
                    <Input type="password" placeholder="Confirmar nova senha" />
                    <Button>Alterar Senha</Button>
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
              </CardContent>
            </Card>          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
