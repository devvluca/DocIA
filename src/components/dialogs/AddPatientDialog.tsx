import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, FileText } from 'lucide-react';
import { Patient } from '@/types';

interface Template {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  category: string;
  createdDate: string;
  lastModified: string;
}

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required: boolean;
  options?: string[];
}

interface AddPatientDialogProps {
  onAddPatient?: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  onEditPatient?: (patientId: string, patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  editingPatient?: Patient | null;
  mode?: 'add' | 'edit';
}

const AddPatientDialog: React.FC<AddPatientDialogProps> = ({ 
  onAddPatient, 
  onEditPatient,
  editingPatient,
  mode = 'add'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: 'M' as 'M' | 'F',
    email: '',
    phone: '',
    condition: '',
    lastVisit: '',
    nextAppointment: '',
    anamnesis: '',
    tags: [] as string[],
    documents: [] as any[],
    avatarColor: ''
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasNoConsultations, setHasNoConsultations] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Função para calcular idade a partir da data de nascimento
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Carregar templates mock
  useEffect(() => {
    const mockTemplates: Template[] = [
      {
        id: '1',
        name: 'Anamnese Geral',
        description: 'Template padrão para anamnese geral de pacientes adultos',
        fields: [
          { id: '1', label: 'Queixa Principal', type: 'textarea', required: true },
          { id: '2', label: 'História da Doença Atual', type: 'textarea', required: true },
          { id: '3', label: 'Antecedentes Pessoais', type: 'textarea', required: false },
          { id: '4', label: 'Antecedentes Familiares', type: 'textarea', required: false }
        ],
        category: 'Anamnese',
        createdDate: '2024-01-10',
        lastModified: '2024-01-12'
      },
      {
        id: '2',
        name: 'Anamnese Pediátrica',
        description: 'Template específico para consultas pediátricas',
        fields: [
          { id: '1', label: 'Queixa Principal', type: 'textarea', required: true },
          { id: '2', label: 'História Perinatal', type: 'textarea', required: true },
          { id: '3', label: 'Desenvolvimento', type: 'textarea', required: false },
          { id: '4', label: 'Vacinação', type: 'select', required: false, options: ['Em dia', 'Atrasada', 'Incompleta'] }
        ],
        category: 'Anamnese',
        createdDate: '2024-01-08',
        lastModified: '2024-01-10'
      }
    ];
    setTemplates(mockTemplates);
  }, []);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (mode === 'edit' && editingPatient) {
      // Converter idade de volta para data de nascimento (aproximação)
      const currentYear = new Date().getFullYear();
      const approximateBirthYear = currentYear - editingPatient.age;
      const approximateBirthDate = `${approximateBirthYear}-01-01`;
      
      setFormData({
        name: editingPatient.name,
        birthDate: approximateBirthDate,
        gender: editingPatient.gender,
        email: editingPatient.email,
        phone: editingPatient.phone,
        condition: editingPatient.condition,
        lastVisit: editingPatient.lastVisit,
        nextAppointment: '',
        anamnesis: editingPatient.anamnesis || '',
        tags: [...editingPatient.tags],
        documents: [...editingPatient.documents],
        avatarColor: editingPatient.avatarColor || ''
      });
    } else {
      // Reset para modo adicionar
      setFormData({
        name: '',
        birthDate: '',
        gender: 'M',
        email: '',
        phone: '',
        condition: '',
        lastVisit: '',
        nextAppointment: '',
        anamnesis: '',
        tags: [],
        documents: [],
        avatarColor: ''
      });
    }
    setHasNoConsultations(false);
  }, [mode, editingPatient]);

  // Verificar se deve ativar o switch baseado na data da última visita
  useEffect(() => {
    if (!formData.lastVisit || formData.lastVisit === '') {
      setHasNoConsultations(true);
    }
  }, [formData.lastVisit]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Se estiver limpando a data da última visita, ativar o switch "sem consultas"
    if (field === 'lastVisit' && value === '') {
      setHasNoConsultations(true);
    }
    // Se estiver preenchendo a data da última visita, desativar o switch "sem consultas"
    else if (field === 'lastVisit' && value !== '') {
      setHasNoConsultations(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const applyTemplate = (templateId: string) => {
    if (templateId === "none" || !templateId) {
      setSelectedTemplate('');
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const templateText = template.fields.map(field => {
        let fieldText = `${field.label}:`;
        if (field.type === 'select' && field.options) {
          fieldText += ` (${field.options.join('/')})`;
        }
        fieldText += '\n_____________________\n';
        return fieldText;
      }).join('\n');
      
      handleInputChange('anamnesis', templateText);
      setSelectedTemplate(templateId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações básicas
      if (!formData.name || !formData.email || !formData.condition) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Criar objeto paciente
      const patientData: Omit<Patient, 'id' | 'createdAt'> = {
        name: formData.name,
        age: calculateAge(formData.birthDate),
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        condition: formData.condition,
        lastVisit: formData.lastVisit || new Date().toLocaleDateString('pt-BR'),
        anamnesis: formData.anamnesis,
        tags: formData.tags.length > 0 ? formData.tags : ['novo'],
        documents: formData.documents,
        avatarColor: formData.avatarColor
      };

      if (mode === 'edit' && editingPatient && onEditPatient) {
        // Chamar função para editar paciente
        onEditPatient(editingPatient.id, patientData);
      } else if (mode === 'add' && onAddPatient) {
        // Chamar função para adicionar paciente
        onAddPatient(patientData);
      }

      // Reset formulário apenas no modo adicionar
      if (mode === 'add') {
        setFormData({
          name: '',
          birthDate: '',
          gender: 'M',
          email: '',
          phone: '',
          condition: '',
          lastVisit: '',
          nextAppointment: '',
          anamnesis: '',
          tags: [],
          documents: [],
          avatarColor: ''
        });
        setHasNoConsultations(false);
      }

    } catch (error) {
      console.error(`Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} paciente:`, error);
      alert(`Erro ao ${mode === 'edit' ? 'editar' : 'adicionar'} paciente. Tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-xs sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
      <DialogHeader>
        <DialogTitle className="text-lg lg:text-xl">
          {mode === 'edit' ? `Editar ${editingPatient?.name}` : 'Adicionar Novo Paciente'}
        </DialogTitle>
        <DialogDescription>
          {mode === 'edit' ? 'Edite as informações do paciente abaixo.' : 'Preencha as informações para cadastrar um novo paciente.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          {/* Nome */}
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="name" className="text-sm">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Digite o nome completo"
              required
              className="text-sm lg:text-base"
            />
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-sm">Data de Nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              placeholder="DD/MM/AAAA"
              className="text-sm lg:text-base"
            />
            {formData.birthDate && (
              <p className="text-xs text-muted-foreground">
                Idade: {calculateAge(formData.birthDate)} anos
              </p>
            )}
          </div>

          {/* Gênero */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm">Gênero</Label>
            <Select value={formData.gender} onValueChange={(value: 'M' | 'F') => handleInputChange('gender', value)}>
              <SelectTrigger className="text-sm lg:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@exemplo.com"
              required
              className="text-sm lg:text-base"
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
              className="text-sm lg:text-base"
            />
          </div>

          {/* Condição */}
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="condition" className="text-sm">Condição Médica *</Label>
            <Input
              id="condition"
              value={formData.condition}
              onChange={(e) => handleInputChange('condition', e.target.value)}
              placeholder="Ex: Diabetes, Hipertensão..."
              required
              className="text-sm lg:text-base"
            />
          </div>
        </div>

        {/* Consultas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Histórico de Consultas</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="no-consultations" className="text-sm text-muted-foreground">
                Paciente não teve consultas
              </Label>
              <Switch
                id="no-consultations"
                checked={hasNoConsultations}
                onCheckedChange={(checked) => {
                  setHasNoConsultations(checked);
                  if (checked) {
                    handleInputChange('lastVisit', '');
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            {/* Data da última visita */}
            <div className="space-y-2">
              <Label htmlFor="lastVisit" className="text-sm">Data da Última Visita</Label>
              <Input
                id="lastVisit"
                type="date"
                value={formData.lastVisit ? new Date(formData.lastVisit.split('/').reverse().join('-')).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const dateValue = e.target.value;
                  if (dateValue) {
                    const date = new Date(dateValue);
                    const formattedDate = date.toLocaleDateString('pt-BR');
                    handleInputChange('lastVisit', formattedDate);
                  } else {
                    handleInputChange('lastVisit', '');
                  }
                }}
                disabled={hasNoConsultations}
                className="text-sm lg:text-base"
              />
            </div>

            {/* Data da próxima consulta */}
            <div className="space-y-2">
              <Label htmlFor="nextAppointment" className="text-sm">Próxima Consulta</Label>
              <Input
                id="nextAppointment"
                type="date"
                value={formData.nextAppointment ? new Date(formData.nextAppointment.split('/').reverse().join('-')).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const dateValue = e.target.value;
                  if (dateValue) {
                    const date = new Date(dateValue);
                    const formattedDate = date.toLocaleDateString('pt-BR');
                    handleInputChange('nextAppointment', formattedDate);
                  } else {
                    handleInputChange('nextAppointment', '');
                  }
                }}
                className="text-sm lg:text-base"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-sm">Tags</Label>
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Adicionar tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="text-sm lg:text-base flex-1"
            />
            <Button type="button" onClick={addTag} variant="outline" size="sm" className="text-sm">
              Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Anamnese */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="anamnesis" className="text-sm">Anamnese Inicial</Label>
            <div className="flex items-center gap-2">
              <Select value={selectedTemplate} onValueChange={applyTemplate}>
                <SelectTrigger className="w-48 text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  <SelectValue placeholder="Usar template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem template</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTemplate('');
                    handleInputChange('anamnesis', '');
                  }}
                  className="text-xs"
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
          <Textarea
            id="anamnesis"
            value={formData.anamnesis}
            onChange={(e) => handleInputChange('anamnesis', e.target.value)}
            placeholder="Digite informações iniciais sobre o paciente ou selecione um template acima..."
            rows={6}
            className="text-sm lg:text-base"
          />
          {selectedTemplate && (
            <p className="text-xs text-muted-foreground">
              Template "{templates.find(t => t.id === selectedTemplate)?.name}" aplicado
            </p>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="medical-gradient text-white w-full sm:w-auto text-sm lg:text-base">
            {isSubmitting ? 
              (mode === 'edit' ? 'Salvando...' : 'Adicionando...') : 
              (mode === 'edit' ? 'Salvar Alterações' : 'Adicionar Paciente')
            }
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default AddPatientDialog;
