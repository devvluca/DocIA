
import React, { useState } from 'react';
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
  Palette, 
  Shield, 
  Database, 
  MessageSquare, 
  FileText,
  Save,
  Upload
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { AnamnesisTemplate } from '@/types';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [userProfile, setUserProfile] = useState({
    name: 'Dr. João Silva',
    email: 'joao.silva@email.com',
    specialty: 'Cardiologia',
    crm: '12345-SP',
    phone: '(11) 99999-9999',
    bio: 'Cardiologista com 15 anos de experiência em diagnósticos cardiovasculares.'
  });

  const [notifications, setNotifications] = useState({
    emailReminders: true,
    whatsappAlerts: true,
    systemUpdates: false,
    appointmentConfirmations: true
  });

  const [anamnesisTemplates, setAnamnesisTemplates] = useState<AnamnesisTemplate[]>([
    {
      id: '1',
      specialty: 'Cardiologia',
      template: 'Paciente refere dor no peito há [tempo]. Localização: [local]. Irradiação: [irradiação]. Fatores de melhora/piora: [fatores].'
    },
    {
      id: '2',
      specialty: 'Psicologia',
      template: 'Paciente apresenta [sintomas] há [tempo]. História familiar: [história]. Eventos significativos: [eventos].'
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({ specialty: '', template: '' });

  const handleSaveProfile = () => {
    // Simulação de salvamento
    alert('Perfil atualizado com sucesso!');
  };

  const handleSaveNotifications = () => {
    // Simulação de salvamento
    alert('Configurações de notificação atualizadas!');
  };

  const handleAddTemplate = () => {
    if (newTemplate.specialty && newTemplate.template) {
      const template: AnamnesisTemplate = {
        id: Date.now().toString(),
        specialty: newTemplate.specialty,
        template: newTemplate.template
      };
      setAnamnesisTemplates([...anamnesisTemplates, template]);
      setNewTemplate({ specialty: '', template: '' });
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setAnamnesisTemplates(anamnesisTemplates.filter(t => t.id !== id));
  };

  return (
    <div className="ml-64 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-2">Gerencie suas preferências e configurações do sistema</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Templates
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
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-lg">JS</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Alterar Foto
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialty">Especialidade</Label>
                    <Select value={userProfile.specialty} onValueChange={(value) => setUserProfile({...userProfile, specialty: value})}>
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
                      onChange={(e) => setUserProfile({...userProfile, crm: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={userProfile.bio}
                    onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
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
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aparência */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Personalização da Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tema da Interface</Label>
                    <p className="text-sm text-muted-foreground">
                      Atualmente usando tema {theme === 'dark' ? 'escuro' : 'claro'}
                    </p>
                  </div>
                  <Button onClick={toggleTheme} variant="outline">
                    {theme === 'dark' ? 'Mudar para Claro' : 'Mudar para Escuro'}
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label>Cores do Sistema</Label>
                  <p className="text-sm text-muted-foreground mb-4">Personalize as cores principais do sistema</p>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-2"></div>
                      <p className="text-xs">Primária</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-secondary rounded-lg mx-auto mb-2"></div>
                      <p className="text-xs">Secundária</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-accent rounded-lg mx-auto mb-2"></div>
                      <p className="text-xs">Destaque</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-2"></div>
                      <p className="text-xs">Neutra</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates */}
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Modelos de Anamnese
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Criar Novo Template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={newTemplate.specialty} onValueChange={(value) => setNewTemplate({...newTemplate, specialty: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                        <SelectItem value="Psicologia">Psicologia</SelectItem>
                        <SelectItem value="Nutrição">Nutrição</SelectItem>
                        <SelectItem value="Fisioterapia">Fisioterapia</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="md:col-span-2">
                      <Textarea
                        value={newTemplate.template}
                        onChange={(e) => setNewTemplate({...newTemplate, template: e.target.value})}
                        placeholder="Digite o template da anamnese..."
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddTemplate} className="gap-2">
                    <Save className="w-4 h-4" />
                    Adicionar Template
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Templates Existentes</Label>
                  {anamnesisTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{template.specialty}</Badge>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.template}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
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
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
