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
  MoreVertical,
  RotateCcw,
  AlertTriangle,
  X
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
import { useNavbar } from '@/contexts/NavbarContext';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'template';
  size: string;
  uploadDate: string;
  category: string;
  patient?: string;
  content?: string; // Para PDFs/documentos de texto
  url?: string; // URL do arquivo
  isDeleted?: boolean;
  deletedDate?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  category: string;
  createdDate: string;
  lastModified: string;
  isDeleted?: boolean;
  deletedDate?: string;
}

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date';
  required: boolean;
  options?: string[];
}

const Documents = () => {
  const { isCollapsed } = useNavbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');
  
  // Estados para funcionalidades
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Document | Template | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Inicializar dados mock
  React.useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Exame_João_Silva.pdf',
        type: 'pdf',
        size: '2.3 MB',
        uploadDate: '2024-01-15',
        category: 'Exames',
        patient: 'João Silva',
        content: 'Resultado do exame cardiológico de João Silva. ECG normal, pressão arterial dentro dos parâmetros normais.',
        url: '/mock/exame_joao.pdf'
      },
      {
        id: '2',
        name: 'Receita_Maria_Santos.pdf',
        type: 'pdf',
        size: '150 KB',
        uploadDate: '2024-01-14',
        category: 'Receitas',
        patient: 'Maria Santos',
        content: 'Prescrição médica para Maria Santos: Losartana 50mg, 1 comprimido ao dia.',
        url: '/mock/receita_maria.pdf'
      },
      {
        id: '3',
        name: 'Relatório_Cardiologia.doc',
        type: 'doc',
        size: '1.8 MB',
        uploadDate: '2024-01-13',
        category: 'Relatórios',
        patient: 'Pedro Costa',
        content: 'Relatório de consulta cardiológica de Pedro Costa. Paciente apresenta...',
        url: '/mock/relatorio_pedro.doc'
      }
    ];

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

    setDocuments(mockDocuments);
    setTemplates(mockTemplates);
  }, []);

  // Mock data para documentos - removido daqui pois agora está no useEffect

  const categories = ['all', 'Exames', 'Receitas', 'Relatórios', 'Templates'];

  // Funcionalidades
  const handleView = (item: Document | Template) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item: Document | Template) => {
    if ('patient' in item) {
      setEditingDocument(item);
      setEditingTemplate(null);
    } else {
      setEditingTemplate(item as Template);
      setEditingDocument(null);
    }
    setIsEditModalOpen(true);
  };

  const handleDownload = (doc: Document) => {
    // Simular download
    const link = document.createElement('a');
    link.href = doc.url || '#';
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Toast de sucesso (você pode adicionar toast aqui)
    console.log(`Download iniciado: ${doc.name}`);
  };

  const handleDelete = (item: Document | Template) => {
    const now = new Date().toISOString();
    
    if ('patient' in item) {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === item.id 
            ? { ...doc, isDeleted: true, deletedDate: now }
            : doc
        )
      );
    } else {
      setTemplates(prev => 
        prev.map(template => 
          template.id === item.id 
            ? { ...template, isDeleted: true, deletedDate: now }
            : template
        )
      );
    }
  };

  const handleRestore = (item: Document | Template) => {
    if ('patient' in item) {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === item.id 
            ? { ...doc, isDeleted: false, deletedDate: undefined }
            : doc
        )
      );
    } else {
      setTemplates(prev => 
        prev.map(template => 
          template.id === item.id 
            ? { ...template, isDeleted: false, deletedDate: undefined }
            : template
        )
      );
    }
  };

  const handlePermanentDelete = (item: Document | Template) => {
    if ('patient' in item) {
      setDocuments(prev => prev.filter(doc => doc.id !== item.id));
    } else {
      setTemplates(prev => prev.filter(template => template.id !== item.id));
    }
  };

  const handleUpload = (files: File[]) => {
    files.forEach(file => {
      const newDoc: Document = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc' : 'image',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        category: 'Outros',
        url: URL.createObjectURL(file)
      };
      
      setDocuments(prev => [...prev, newDoc]);
    });
    setIsUploadOpen(false);
  };

  // Filtros
  const activeDocuments = documents.filter(doc => !doc.isDeleted);
  const activeTemplates = templates.filter(template => !template.isDeleted);
  const deletedItems = [...documents, ...templates].filter(item => item.isDeleted);

  // Limpar itens da lixeira após 30 dias
  React.useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const itemsToDelete = deletedItems.filter(item => 
      item.deletedDate && new Date(item.deletedDate) < thirtyDaysAgo
    );
    
    itemsToDelete.forEach(item => handlePermanentDelete(item));
  }, [deletedItems]);

  const filteredDocuments = activeDocuments.filter(doc => {
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
  };  return (
    <div className={`min-h-screen bg-background pt-16 lg:pt-2 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
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
              <DocumentUpload onClose={() => setIsUploadOpen(false)} onUpload={handleUpload} />
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

          <Dialog open={isTrashOpen} onOpenChange={setIsTrashOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Lixeira ({deletedItems.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Lixeira - Itens excluídos
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Itens são excluídos permanentemente após 30 dias
                </p>
              </DialogHeader>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {deletedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Trash2 className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nenhum item na lixeira</p>
                  </div>
                ) : (
                  deletedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon('patient' in item ? item.type : 'template')}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Excluído em {item.deletedDate ? new Date(item.deletedDate).toLocaleDateString('pt-BR') : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(item)}
                          className="gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restaurar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePermanentDelete(item)}
                          className="gap-1"
                        >
                          <X className="w-3 h-3" />
                          Excluir Permanentemente
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="relative">
          <TabsList className="grid w-full grid-cols-2 relative bg-muted p-1 h-auto">
            {/* Animated background slider */}
            <div 
              className={`absolute top-1 bottom-1 bg-background rounded-md shadow-sm transition-all duration-300 ease-in-out z-0 ${
                activeTab === 'documents' 
                  ? 'left-1 w-[calc(50%-4px)]' 
                  : 'left-[50%] w-[calc(50%-4px)]'
              }`}
            />
            
            <TabsTrigger 
              value="documents"
              className={`flex items-center gap-2 relative z-10 transition-all duration-300 ${
                activeTab === 'documents' 
                  ? 'text-foreground shadow-none bg-transparent' 
                  : 'text-muted-foreground bg-transparent hover:text-foreground'
              }`}
            >
              <FileText className={`w-4 h-4 transition-transform duration-300 ${
                activeTab === 'documents' ? 'scale-110' : 'scale-100'
              }`} />
              <span className="font-medium">Documentos ({activeDocuments.length})</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="templates"
              className={`flex items-center gap-2 relative z-10 transition-all duration-300 ${
                activeTab === 'templates' 
                  ? 'text-foreground shadow-none bg-transparent' 
                  : 'text-muted-foreground bg-transparent hover:text-foreground'
              }`}
            >
              <FileText className={`w-4 h-4 transition-transform duration-300 ${
                activeTab === 'templates' ? 'scale-110' : 'scale-100'
              }`} />
              <span className="font-medium">Templates ({activeTemplates.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

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
                          <DropdownMenuItem className="gap-2" onClick={() => handleView(doc)}>
                            <Eye className="w-4 h-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleDownload(doc)}>
                            <Download className="w-4 h-4" />
                            Baixar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleEdit(doc)}>
                            <Edit className="w-4 h-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(doc)}>
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
          {activeTemplates.length === 0 ? (
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
              {activeTemplates.map((template) => (
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
                          <DropdownMenuItem className="gap-2" onClick={() => handleView(template)}>
                            <Eye className="w-4 h-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleEdit(template)}>
                            <Edit className="w-4 h-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Download className="w-4 h-4" />
                            Exportar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(template)}>
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
                              {field.label}
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
            </div>          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              {'patient' in selectedItem ? (
                // Visualização de documento
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Tipo:</strong> {selectedItem.type.toUpperCase()}</div>
                    <div><strong>Tamanho:</strong> {selectedItem.size}</div>
                    <div><strong>Data de Upload:</strong> {new Date(selectedItem.uploadDate).toLocaleDateString('pt-BR')}</div>
                    <div><strong>Categoria:</strong> {selectedItem.category}</div>
                    {selectedItem.patient && <div><strong>Paciente:</strong> {selectedItem.patient}</div>}
                  </div>
                  {selectedItem.content && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Conteúdo:</h4>
                      <p className="text-sm whitespace-pre-wrap">{selectedItem.content}</p>
                    </div>
                  )}
                </div>
              ) : (
                // Visualização de template
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Categoria:</strong> {selectedItem.category}</div>
                    <div><strong>Campos:</strong> {(selectedItem as Template).fields.length}</div>
                    <div><strong>Criado em:</strong> {new Date((selectedItem as Template).createdDate).toLocaleDateString('pt-BR')}</div>
                    <div><strong>Modificado em:</strong> {new Date((selectedItem as Template).lastModified).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{(selectedItem as Template).description}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Campos do Template:</h4>
                    <div className="space-y-2">
                      {(selectedItem as Template).fields.map((field, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                          <div>
                            <span className="font-medium">{field.label}</span>
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {field.type === 'textarea' ? 'Texto longo' : 
                             field.type === 'text' ? 'Texto' :
                             field.type === 'select' ? 'Seleção' :
                             field.type === 'checkbox' ? 'Checkbox' :
                             field.type === 'date' ? 'Data' : field.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar {editingDocument ? 'Documento' : 'Template'}
            </DialogTitle>
          </DialogHeader>
          {editingDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Documento</label>
                  <Input 
                    value={editingDocument.name}
                    onChange={(e) => setEditingDocument({...editingDocument, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <Input 
                    value={editingDocument.category}
                    onChange={(e) => setEditingDocument({...editingDocument, category: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Paciente</label>
                <Input 
                  value={editingDocument.patient || ''}
                  onChange={(e) => setEditingDocument({...editingDocument, patient: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => {
                    setDocuments(prev => 
                      prev.map(doc => 
                        doc.id === editingDocument.id ? editingDocument : doc
                      )
                    );
                    setEditingDocument(null);
                    setIsEditModalOpen(false);
                  }}
                >
                  Salvar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingDocument(null);
                    setIsEditModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
          {editingTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Template</label>
                  <Input 
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <Input 
                    value={editingTemplate.category}
                    onChange={(e) => setEditingTemplate({...editingTemplate, category: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <Input 
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({...editingTemplate, description: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => {
                    setTemplates(prev => 
                      prev.map(template => 
                        template.id === editingTemplate.id 
                          ? {...editingTemplate, lastModified: new Date().toISOString().split('T')[0]} 
                          : template
                      )
                    );
                    setEditingTemplate(null);
                    setIsEditModalOpen(false);
                  }}
                >
                  Salvar
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingTemplate(null);
                    setIsEditModalOpen(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default Documents;