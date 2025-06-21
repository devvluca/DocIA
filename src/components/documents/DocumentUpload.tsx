import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentUploadProps {
  onClose: () => void;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [category, setCategory] = useState('');
  const [patient, setPatient] = useState('');
  const [description, setDescription] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    const newFiles: UploadFile[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const simulateUpload = (fileIndex: number) => {
    setSelectedFiles(prev => prev.map((file, index) => 
      index === fileIndex ? { ...file, status: 'uploading' } : file
    ));

    // Simular progresso do upload
    const interval = setInterval(() => {
      setSelectedFiles(prev => prev.map((file, index) => {
        if (index === fileIndex) {
          const newProgress = Math.min(file.progress + 10, 100);
          return {
            ...file,
            progress: newProgress,
            status: newProgress === 100 ? 'success' : 'uploading'
          };
        }
        return file;
      }));
    }, 200);

    // Limpar intervalo quando completar
    setTimeout(() => {
      clearInterval(interval);
    }, 2000);
  };

  const handleUpload = () => {
    if (!category) {
      alert('Por favor, selecione uma categoria para o documento.');
      return;
    }

    selectedFiles.forEach((_, index) => {
      if (selectedFiles[index].status === 'pending') {
        simulateUpload(index);
      }
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (file.type.includes('image')) {
      return <FileText className="w-8 h-8 text-green-500" />;
    } else {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }
  };

  const allFilesUploaded = selectedFiles.length > 0 && selectedFiles.every(file => file.status === 'success');

  return (
    <div className="space-y-6">
      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Arraste e solte arquivos aqui
        </h3>
        <p className="text-muted-foreground mb-4">
          ou clique para selecionar arquivos
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        <Button asChild variant="outline">
          <label htmlFor="file-upload" className="cursor-pointer">
            Selecionar Arquivos
          </label>
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Suporta: PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada)
        </p>
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Arquivos Selecionados</h4>
          {selectedFiles.map((uploadFile, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              {getFileIcon(uploadFile.file)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{uploadFile.file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(uploadFile.file.size)}
                </p>
                {uploadFile.status === 'uploading' && (
                  <Progress value={uploadFile.progress} className="w-full mt-2" />
                )}
                {uploadFile.status === 'error' && uploadFile.error && (
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadFile.error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="flex items-center gap-2">
                {uploadFile.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {uploadFile.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={uploadFile.status === 'uploading'}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Exames">Exames</SelectItem>
              <SelectItem value="Receitas">Receitas</SelectItem>
              <SelectItem value="Relatórios">Relatórios</SelectItem>
              <SelectItem value="Laudos">Laudos</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="patient">Paciente</Label>
          <Input
            id="patient"
            placeholder="Nome do paciente (opcional)"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Adicione uma descrição para o documento (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || !category}
        >
          {allFilesUploaded ? 'Concluído' : 'Fazer Upload'}
        </Button>
      </div>

      {allFilesUploaded && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Todos os arquivos foram enviados com sucesso!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default DocumentUpload;