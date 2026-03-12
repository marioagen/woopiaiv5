import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Download,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface QueryParam {
  id: string;
  key: string;
  value: string;
}

interface Header {
  id: string;
  key: string;
  value: string;
  secret: boolean;
}

interface APITemplate {
  id?: number;
  name: string;
  method: HTTPMethod;
  url: string;
  queryParams: QueryParam[];
  headers: Header[];
  body: string;
}

export function APITemplateFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  // Form state
  const [templateName, setTemplateName] = useState('');
  const [method, setMethod] = useState<HTTPMethod>('GET');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [body, setBody] = useState('');
  const [bodyError, setBodyError] = useState('');

  // UI state
  const [showImportCurlDialog, setShowImportCurlDialog] = useState(false);
  const [curlCommand, setCurlCommand] = useState('');
  const [activeTab, setActiveTab] = useState('query-params');

  // External consult state
  const [enableExternalConsult, setEnableExternalConsult] = useState(false);
  const [externalConsultDescription, setExternalConsultDescription] = useState('');

  // Load template if editing
  useEffect(() => {
    if (isEditing) {
      // TODO: Load template from storage
      // Mock data for now
      setTemplateName('Get User Details');
      setMethod('GET');
      setEndpointUrl('https://api.example.com/v1/users/{{userId}}');
      setQueryParams([
        { id: '1', key: 'include', value: 'profile' }
      ]);
      setHeaders([
        { id: '1', key: 'Authorization', value: 'Bearer {{token}}', secret: true },
        { id: '2', key: 'Content-Type', value: 'application/json', secret: false }
      ]);
      setBody('{\n  "key": "{{variable}}"\n}');
    }
  }, [isEditing, id]);

  // Validate JSON body in real-time
  useEffect(() => {
    if (!body.trim()) {
      setBodyError('');
      return;
    }

    try {
      // Replace variables with dummy values for validation
      const testBody = body.replace(/\{\{[^}]+\}\}/g, '"__VARIABLE__"');
      JSON.parse(testBody);
      setBodyError('');
    } catch (error) {
      setBodyError('Invalid JSON format');
    }
  }, [body]);

  // Query Parameters
  const addQueryParam = () => {
    setQueryParams([
      ...queryParams,
      { id: Date.now().toString(), key: '', value: '' }
    ]);
  };

  const updateQueryParam = (id: string, field: 'key' | 'value', value: string) => {
    setQueryParams(queryParams.map(param =>
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const removeQueryParam = (id: string) => {
    setQueryParams(queryParams.filter(param => param.id !== id));
  };

  // Headers
  const addHeader = () => {
    setHeaders([
      ...headers,
      { id: Date.now().toString(), key: '', value: '', secret: false }
    ]);
  };

  const updateHeader = (id: string, field: 'key' | 'value' | 'secret', value: string | boolean) => {
    setHeaders(headers.map(header =>
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter(header => header.id !== id));
  };

  const toggleHeaderSecret = (id: string) => {
    setHeaders(headers.map(header =>
      header.id === id ? { ...header, secret: !header.secret } : header
    ));
  };

  // Parse cURL command
  const parseCurlCommand = (curl: string) => {
    try {
      // Extract method
      const methodMatch = curl.match(/-X\s+(GET|POST|PUT|DELETE|PATCH)/i);
      if (methodMatch) {
        setMethod(methodMatch[1].toUpperCase() as HTTPMethod);
      }

      // Extract URL
      const urlMatch = curl.match(/curl\s+['"]?([^\s'"]+)['"]?/);
      if (urlMatch) {
        setEndpointUrl(urlMatch[1]);
      }

      // Extract headers
      const headerMatches = curl.matchAll(/-H\s+['"]([^:]+):\s*([^'"]+)['"]/g);
      const newHeaders: Header[] = [];
      for (const match of headerMatches) {
        newHeaders.push({
          id: Date.now().toString() + Math.random(),
          key: match[1].trim(),
          value: match[2].trim(),
          secret: match[1].toLowerCase().includes('authorization') || match[1].toLowerCase().includes('token')
        });
      }
      setHeaders(newHeaders);

      // Extract body
      const bodyMatch = curl.match(/(?:-d|--data|--data-raw)\s+['"](.+?)['"]/s);
      if (bodyMatch) {
        const bodyContent = bodyMatch[1];
        try {
          // Try to parse as JSON and format it
          const parsed = JSON.parse(bodyContent);
          setBody(JSON.stringify(parsed, null, 2));
        } catch {
          // If not valid JSON, show error
          toast.error('O body do cURL não é um JSON válido');
        }
      }

      setShowImportCurlDialog(false);
      setCurlCommand('');
      toast.success('cURL importado com sucesso!');
    } catch (error) {
      toast.error('Erro ao processar comando cURL');
    }
  };

  const handleSave = () => {
    // Validations
    if (!templateName.trim()) {
      toast.error('Nome do template é obrigatório');
      return;
    }

    if (!endpointUrl.trim()) {
      toast.error('URL da requisição é obrigatória');
      return;
    }

    if (bodyError) {
      toast.error('Corrija os erros no JSON antes de salvar');
      return;
    }

    const template: APITemplate = {
      id: isEditing ? parseInt(id!) : Date.now(),
      name: templateName,
      method,
      url: endpointUrl,
      queryParams: queryParams.filter(p => p.key.trim()),
      headers: headers.filter(h => h.key.trim()),
      body: body.trim()
    };

    // TODO: Save to storage
    console.log('Saving template:', template);
    
    toast.success(isEditing ? 'Template atualizado com sucesso!' : 'Template criado com sucesso!');
    navigate('/templates/api');
  };

  const handleCancel = () => {
    navigate('/templates/api');
  };

  return (
    <div className="min-h-screen bg-woopi-ai-light-gray">
      {/* Header */}
      <div className="bg-card border-b border-woopi-ai-border dark:bg-[#292f4c]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="p-2 text-woopi-ai-gray hover:text-woopi-ai-dark-gray dark:hover:bg-[#2d3354]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-woopi-ai-dark-gray">
                  {isEditing ? 'Edit Template' : 'Create Template'}
                </h1>
                <p className="text-sm text-woopi-ai-gray">
                  Configure your API request blueprint.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowImportCurlDialog(true)}
                className="border-woopi-ai-border text-woopi-ai-dark-gray hover:bg-woopi-ai-light-gray dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
              >
                <Download className="w-4 h-4 mr-2" />
                Import cURL
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-woopi-ai-border text-woopi-ai-dark-gray hover:bg-woopi-ai-light-gray dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="woopi-ai-button-primary"
              >
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Request Details */}
          <div className="space-y-6">
            <Card className="woopi-ai-card">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-woopi-ai-dark-gray mb-4">
                  Request Details
                </h2>

                {/* Template Name */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="template-name" className="text-woopi-ai-dark-gray">Template Name</Label>
                  <Input
                    id="template-name"
                    placeholder="e.g. User OCR Processing"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="border-woopi-ai-border bg-background text-foreground dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                  />
                </div>

                {/* External AI Consult */}
                <div className="mb-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      id="enable-external-consult"
                      type="checkbox"
                      checked={enableExternalConsult}
                      onChange={(e) => {
                        setEnableExternalConsult(e.target.checked);
                        if (!e.target.checked) setExternalConsultDescription('');
                      }}
                      className="w-4 h-4 rounded border-woopi-ai-border text-[#0073ea] accent-[#0073ea] cursor-pointer"
                    />
                    <Label
                      htmlFor="enable-external-consult"
                      className="text-woopi-ai-dark-gray cursor-pointer select-none"
                    >
                      Habilitar consulta externa da IA
                    </Label>
                  </div>

                  {enableExternalConsult && (
                    <div className="space-y-1 pl-6">
                      <Label htmlFor="external-consult-desc" className="text-woopi-ai-dark-gray text-sm">
                        Descrição
                      </Label>
                      <Textarea
                        id="external-consult-desc"
                        rows={4}
                        maxLength={500}
                        placeholder="Descreva como a IA deve consultar esta API externamente..."
                        value={externalConsultDescription}
                        onChange={(e) => setExternalConsultDescription(e.target.value)}
                        className="resize-none border-woopi-ai-border bg-background text-foreground dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                      />
                      <p className={`text-xs text-right ${externalConsultDescription.length >= 500 ? 'text-red-500 dark:text-red-400' : 'text-woopi-ai-gray'}`}>
                        {externalConsultDescription.length}/500
                      </p>
                    </div>
                  )}
                </div>

                {/* Method and URL */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="method" className="text-woopi-ai-dark-gray">Method</Label>
                    <Select value={method} onValueChange={(value) => setMethod(value as HTTPMethod)}>
                      <SelectTrigger id="method" className="border-woopi-ai-border dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[#292f4c] dark:border-[#393e5c]">
                        <SelectItem value="GET" className="dark:text-[#d5d8e0] dark:focus:bg-[#2d3354]">GET</SelectItem>
                        <SelectItem value="POST" className="dark:text-[#d5d8e0] dark:focus:bg-[#2d3354]">POST</SelectItem>
                        <SelectItem value="PUT" className="dark:text-[#d5d8e0] dark:focus:bg-[#2d3354]">PUT</SelectItem>
                        <SelectItem value="PATCH" className="dark:text-[#d5d8e0] dark:focus:bg-[#2d3354]">PATCH</SelectItem>
                        <SelectItem value="DELETE" className="dark:text-[#d5d8e0] dark:focus:bg-[#2d3354]">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor="endpoint-url" className="text-woopi-ai-dark-gray">Endpoint URL</Label>
                    <Input
                      id="endpoint-url"
                      placeholder="https://api.example.com/v1/resource"
                      value={endpointUrl}
                      onChange={(e) => setEndpointUrl(e.target.value)}
                      className="border-woopi-ai-border font-mono text-sm dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                    />
                  </div>
                </div>

                {/* Tabs for Query Params and Headers */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 dark:bg-[#2d3354]">
                    <TabsTrigger value="query-params" className="dark:data-[state=active]:bg-[#393e5c] dark:text-[#9196b0] dark:data-[state=active]:text-[#d5d8e0]">Query Params</TabsTrigger>
                    <TabsTrigger value="headers" className="dark:data-[state=active]:bg-[#393e5c] dark:text-[#9196b0] dark:data-[state=active]:text-[#d5d8e0]">Headers</TabsTrigger>
                  </TabsList>

                  {/* Query Parameters Tab */}
                  <TabsContent value="query-params" className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-woopi-ai-dark-gray">Query Parameters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addQueryParam}
                        className="text-woopi-ai-blue hover:text-woopi-ai-blue/80 dark:hover:bg-[#2d3354]"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Param
                      </Button>
                    </div>

                    {queryParams.length === 0 ? (
                      <div className="text-center py-8 text-sm text-woopi-ai-gray border border-dashed border-woopi-ai-border rounded-lg dark:border-[#393e5c]">
                        No query parameters. Add one or type in the URL.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {queryParams.map((param) => (
                          <div key={param.id} className="flex items-center gap-2">
                            <Input
                              placeholder="Key"
                              value={param.key}
                              onChange={(e) => updateQueryParam(param.id, 'key', e.target.value)}
                              className="flex-1 border-woopi-ai-border dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                            />
                            <Input
                              placeholder="Value"
                              value={param.value}
                              onChange={(e) => updateQueryParam(param.id, 'value', e.target.value)}
                              className="flex-1 border-woopi-ai-border dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQueryParam(param.id)}
                              className="p-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Headers Tab */}
                  <TabsContent value="headers" className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-woopi-ai-dark-gray">Headers</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addHeader}
                        className="text-woopi-ai-blue hover:text-woopi-ai-blue/80 dark:hover:bg-[#2d3354]"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Header
                      </Button>
                    </div>

                    {headers.length === 0 ? (
                      <div className="text-center py-8 text-sm text-woopi-ai-gray border border-dashed border-woopi-ai-border rounded-lg dark:border-[#393e5c]">
                        No headers added yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {headers.map((header) => (
                          <div key={header.id} className="flex items-center gap-2">
                            <Input
                              placeholder="Header Name"
                              value={header.key}
                              onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                              className="flex-1 border-woopi-ai-border dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                            />
                            <Input
                              placeholder="Value"
                              type={header.secret ? 'password' : 'text'}
                              value={header.value}
                              onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                              className="flex-1 border-woopi-ai-border dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleHeaderSecret(header.id)}
                              className="p-2 dark:hover:bg-[#2d3354]"
                              title={header.secret ? 'Show value' : 'Hide value (secret)'}
                            >
                              {header.secret ? (
                                <EyeOff className="w-4 h-4 text-woopi-ai-gray" />
                              ) : (
                                <Eye className="w-4 h-4 text-woopi-ai-gray" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHeader(header.id)}
                              className="p-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Request Body */}
          <div>
            <Card className="woopi-ai-card h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-woopi-ai-dark-gray">
                      Request Body
                    </h2>
                    <p className="text-xs text-woopi-ai-gray mt-1">
                      Supports {'{{'} variables {'}}'}
                    </p>
                  </div>
                  {bodyError && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Invalid JSON
                    </Badge>
                  )}
                </div>

                <div className="flex-1 relative">
                  <Textarea
                    placeholder='{\n  "key": "{{variable}}"\n}'
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className={`font-mono text-sm h-full min-h-[400px] resize-none dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d] ${
                      bodyError
                        ? 'border-red-500 focus:border-red-500 dark:border-red-700'
                        : 'border-woopi-ai-border dark:border-[#393e5c]'
                    }`}
                  />
                  {bodyError && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {bodyError}
                    </p>
                  )}
                </div>

                {/* Info about variables */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-700/50">
                  <p className="text-xs text-blue-900 dark:text-blue-300">
                    <strong>💡 Tip:</strong> Use variables like{' '}
                    <code className="bg-blue-100 px-1 py-0.5 rounded dark:bg-blue-900/40 dark:text-blue-200">{'{{ocr}}'}</code>{' '}
                    or{' '}
                    <code className="bg-blue-100 px-1 py-0.5 rounded dark:bg-blue-900/40 dark:text-blue-200">{'{{prompt}}'}</code>{' '}
                    that will be replaced at execution time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Import cURL Dialog */}
      <Dialog open={showImportCurlDialog} onOpenChange={setShowImportCurlDialog}>
        <DialogContent className="max-w-2xl dark:bg-[#292f4c] dark:border-[#393e5c]">
          <DialogHeader>
            <DialogTitle className="dark:text-[#d5d8e0]">Import cURL Command</DialogTitle>
            <DialogDescription className="dark:text-[#9196b0]">
              Paste your cURL command below and we'll extract the method, URL, headers, and body automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="curl -X POST https://api.example.com/v1/users \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer token' \
  -d '{&quot;name&quot;: &quot;John&quot;}'"
              value={curlCommand}
              onChange={(e) => setCurlCommand(e.target.value)}
              className="font-mono text-sm min-h-[200px] border-woopi-ai-border dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowImportCurlDialog(false);
                setCurlCommand('');
              }}
              className="dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#2d3354]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => parseCurlCommand(curlCommand)}
              disabled={!curlCommand.trim()}
              className="woopi-ai-button-primary"
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}