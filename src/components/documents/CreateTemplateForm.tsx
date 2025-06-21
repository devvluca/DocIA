import React, { useState } from 'react';
import { Plus, X, GripVertical, Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CreateTemplateFormProps {
  onClose: () => void;
}

interface TemplateField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  description?: string;
}

const CreateTemplateForm: React.FC<CreateTemplateFormProps> = ({ onClose }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fieldTypes = [
    { value: 'text', label: 'Texto Curto' },
    { value: 'textarea', label: 'Texto Longo' },
    { value: 'select', label: 'Lista Suspensa' },
    { value: 'checkbox', label: 'Caixa de Seleção' },
    { value: 'radio', label: 'Seleção Única' },
    { value: 'date', label: 'Data' },
  ];

  const addField = () => {
    const newField: TemplateField = {
      id: Date.now().toString(),
      type: 'text',
      label: '',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<TemplateField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex(field => field.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < fields.length - 1)
    ) {
      const newFields = [...fields];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
      setFields(newFields);
    }
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert('Por favor, insira um nome para o template.');
      return;
    }

    if (fields.length === 0) {
      alert('Por favor, adicione pelo menos um campo ao template.');
      return;
    }

    // Aqui você salvaria o template
    console.log('Salvando template:', {
      name: templateName,
      description: templateDescription,
      category: templateCategory,
      fields: fields
    });

    onClose();
  };

  const renderFieldPreview = (field: TemplateField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder || 'Digite aqui...'}
            disabled
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder || 'Digite aqui...'}
            disabled
            rows={3}
          />
        );
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" name={field.id} disabled />
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
        );
      case 'date':
        return (
          <Input type="date" disabled />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Construtor</TabsTrigger>
          <TabsTrigger value="preview">Visualização</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Nome do Template *</Label>
                  <Input
                    id="templateName"
                    placeholder="Ex: Anamnese Cardiológica"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateCategory">Categoria</Label>
                  <Select value={templateCategory} onValueChange={setTemplateCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anamnese">Anamnese</SelectItem>
                      <SelectItem value="Exame Físico">Exame Físico</SelectItem>
                      <SelectItem value="Avaliação">Avaliação</SelectItem>
                      <SelectItem value="Seguimento">Seguimento</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateDescription">Descrição</Label>
                <Textarea
                  id="templateDescription"
                  placeholder="Descreva o propósito e uso deste template..."
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Fields */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campos do Template</CardTitle>
              <Button onClick={addField} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Campo
              </Button>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Nenhum campo adicionado ainda
                  </p>
                  <Button onClick={addField} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar Primeiro Campo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col gap-2 mt-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveField(field.id, 'up')}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveField(field.id, 'down')}
                              disabled={index === fields.length - 1}
                            >
                              ↓
                            </Button>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Tipo do Campo</Label>
                                <Select
                                  value={field.type}
                                  onValueChange={(value) => 
                                    updateField(field.id, { type: value as TemplateField['type'] })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fieldTypes.map(type => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Rótulo do Campo</Label>
                                <Input
                                  placeholder="Ex: Queixa Principal"
                                  value={field.label}
                                  onChange={(e) => 
                                    updateField(field.id, { label: e.target.value })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Placeholder</Label>
                                <Input
                                  placeholder="Texto de ajuda..."
                                  value={field.placeholder || ''}
                                  onChange={(e) => 
                                    updateField(field.id, { placeholder: e.target.value })
                                  }
                                />
                              </div>
                            </div>

                            {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && (
                              <div className="space-y-2">
                                <Label>Opções (uma por linha)</Label>
                                <Textarea
                                  placeholder="Opção 1&#10;Opção 2&#10;Opção 3"
                                  value={field.options?.join('\n') || ''}
                                  onChange={(e) => 
                                    updateField(field.id, { 
                                      options: e.target.value.split('\n').filter(opt => opt.trim()) 
                                    })
                                  }
                                  rows={3}
                                />
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`required-${field.id}`}
                                  checked={field.required}
                                  onChange={(e) => 
                                    updateField(field.id, { required: e.target.checked })
                                  }
                                />
                                <Label htmlFor={`required-${field.id}`}>Campo obrigatório</Label>
                              </div>
                              
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeField(field.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{templateName || 'Nome do Template'}</CardTitle>
                  {templateDescription && (
                    <p className="text-muted-foreground mt-1">{templateDescription}</p>
                  )}
                </div>
                {templateCategory && (
                  <Badge variant="secondary">{templateCategory}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Adicione campos na aba "Construtor" para ver a visualização
                </p>
              ) : (
                fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label className="flex items-center gap-2">
                      {field.label || 'Campo sem nome'}
                      {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    {field.description && (
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    )}
                    {renderFieldPreview(field)}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Salvar Template
        </Button>
      </div>
    </div>
  );
};

export default CreateTemplateForm;