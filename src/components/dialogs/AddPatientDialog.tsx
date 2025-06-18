import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Patient } from '@/types';

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
    age: '',
    gender: 'M' as 'M' | 'F',
    email: '',
    phone: '',
    condition: '',
    lastVisit: '',
    anamnesis: '',
    tags: [] as string[],
    documents: [] as any[],
    avatarColor: ''
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (mode === 'edit' && editingPatient) {
      setFormData({
        name: editingPatient.name,
        age: editingPatient.age.toString(),
        gender: editingPatient.gender,
        email: editingPatient.email,
        phone: editingPatient.phone,
        condition: editingPatient.condition,
        lastVisit: editingPatient.lastVisit,
        anamnesis: editingPatient.anamnesis || '',
        tags: [...editingPatient.tags],
        documents: [...editingPatient.documents],
        avatarColor: editingPatient.avatarColor || ''
      });
    } else {
      // Reset para modo adicionar
      setFormData({
        name: '',
        age: '',
        gender: 'M',
        email: '',
        phone: '',
        condition: '',
        lastVisit: '',
        anamnesis: '',
        tags: [],
        documents: [],
        avatarColor: ''
      });
    }
  }, [mode, editingPatient]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        age: parseInt(formData.age) || 0,
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
          age: '',
          gender: 'M',
          email: '',
          phone: '',
          condition: '',
          lastVisit: '',
          anamnesis: '',
          tags: [],
          documents: [],
          avatarColor: ''
        });
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

          {/* Idade */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm">Idade</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="Digite a idade"
              min="0"
              max="120"
              className="text-sm lg:text-base"
            />
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
            className="text-sm lg:text-base"
          />
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
        <div className="space-y-2">
          <Label htmlFor="anamnesis" className="text-sm">Anamnese Inicial</Label>
          <Textarea
            id="anamnesis"
            value={formData.anamnesis}
            onChange={(e) => handleInputChange('anamnesis', e.target.value)}
            placeholder="Digite informações iniciais sobre o paciente..."
            rows={3}
            className="text-sm lg:text-base"
          />
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
