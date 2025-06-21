import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2,
  Eye,
  Calendar,
  User,
  FileIcon,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateTemplateForm from '@/components/documents/CreateTemplateForm';
import DocumentUpload from '@/components/documents/DocumentUpload';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'template';
  size: string;
  uploadDate: string;
  category: string;
  patient?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  fields: string[];
  category: string;
  createdDate: string;
  lastModified: string;
}

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Mock data para documentos
  const documents: Document[] = [
    {
      id: '1',
      name: 'Exame_João_Silva.pdf',
      type: 'pdf',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      category: 'Exames',
      patient: 'João Silva'
    },
    {
      id: '2',
      name: 'Receita_Maria_Santos.pdf',
      type: 'pdf',
      size: '150 KB',
      uploadDate: '2024-01-14',
      category: 'Receitas',
      patient: 'Maria Santos'
    },
    {
      id: '3',
      name: 'Relatório_Cardiologia.doc',
      type: 'doc',
      size: '1.8 MB',
      uploadDate: '2024-01-13',
      category: 'Relatórios',
      patient: 'Pedro Costa'
    }
  ];

  // Mock data para templates
  const templates: Template[] = [
    {
      id: '1',
      name: 'Anamnese Geral',
      description: 'Template padrão para anamnese geral de pacientes adultos',
      fields: ['Queixa Principal', 'História da Doença Atual', 'Antecedentes Pessoais', 'Antecedentes Familiares'],
      category: 'Anamnese',
      createdDate: '2024-01-10',
      lastModified: '2024-01-12'
    },
    {
      id: '2',
      name: 'Anamnese Pediátrica',
      description: 'Template específico para consultas pediátricas',
      fields: ['Queixa Principal', 'História Perinatal', 'Desenvolvimento', 'Vacinação'],
      category: 'Anamnese',
      createdDate: '2024-01-08',
      lastModified: '2024-01-10'
    }
  ];

  const categories = ['all', 'Exames', 'Receitas', 'Relatórios', 'Templates'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.patient?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'doc':
        return <FileIcon className="w-8 h-8 text-blue-500" />;
      case 'image':
        return <FileIcon className="w-8 h-8 text-green-500" />;
      case 'template':
        return <FileText className="w-8 h-8 text-purple-500" />;
      default:
        return <FileIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documentos</h1>
          <p className="text-muted-foreground">Gerencie documentos e templates de anamnese</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Upload Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload de Documento</DialogTitle>
              </DialogHeader>
              <DocumentUpload onClose={() => setIsUploadOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Criar Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Template de Anamnese</DialogTitle>
              </DialogHeader>
              <CreateTemplateForm onClose={() => setIsCreateTemplateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar documentos ou pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Todos' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Documentos ({documents.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {/* Documents Grid */}
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum documento encontrado</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm ? 'Tente ajustar os filtros de busca' : 'Faça upload do primeiro documento'}
                </p>
                <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Upload Documento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      {getFileIcon(doc.type)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Download className="w-4 h-4" />
                            Baixar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2 truncate" title={doc.name}>
                      {doc.name}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{doc.size}</span>
                        <span>{new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {doc.category}
                        </Badge>
                        {doc.patient && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            {doc.patient}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {/* Templates Grid */}
          {templates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum template criado</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Crie seu primeiro template de anamnese
                </p>
                <Button onClick={() => setIsCreateTemplateOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Criar Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Download className="w-4 h-4" />
                            Exportar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {template.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Campos ({template.fields.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {template.fields.slice(0, 3).map((field, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                          {template.fields.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.fields.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(template.lastModified).toLocaleDateString('pt-BR')}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documents;