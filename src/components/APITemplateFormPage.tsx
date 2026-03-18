import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  AlertCircle,
  Play,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Globe,
  Bot,
  Info,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { mockAgents } from '../data/mockAgents';
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

interface TestResponse {
  status: number;
  statusText: string;
  time: number;
  headers: Record<string, string>;
  body: string;
}

const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;

function extractVariables(url: string, params: QueryParam[], hdrs: Header[], bodyStr: string): string[] {
  const all = [url, bodyStr, ...params.map(p => `${p.key} ${p.value}`), ...hdrs.map(h => `${h.key} ${h.value}`)].join(' ');
  const found = new Set<string>();
  let match: RegExpExecArray | null;
  const regex = new RegExp(VARIABLE_REGEX.source, 'g');
  while ((match = regex.exec(all)) !== null) {
    found.add(match[1].trim());
  }
  return Array.from(found);
}

function resolveTemplate(template: string, values: Record<string, string>): string {
  return template.replace(VARIABLE_REGEX, (_, varName) => values[varName.trim()] ?? `{{${varName.trim()}}}`);
}

function generateMockResponse(method: HTTPMethod, resolvedUrl: string, resolvedBody: string): TestResponse {
  const time = Math.floor(Math.random() * 500) + 150;
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Request-Id': crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    'Date': new Date().toUTCString(),
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  };

  switch (method) {
    case 'GET':
      return {
        status: 200,
        statusText: 'OK',
        time,
        headers: { ...baseHeaders, 'X-Total-Count': '42' },
        body: JSON.stringify({
          success: true,
          data: {
            id: 1,
            name: 'Exemplo de Registro',
            email: 'exemplo@woopi.ai',
            status: 'active',
            createdAt: new Date().toISOString(),
          },
          meta: { page: 1, perPage: 10, total: 42 },
        }, null, 2),
      };
    case 'POST': {
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(resolvedBody); } catch { /* empty */ }
      return {
        status: 201,
        statusText: 'Created',
        time,
        headers: { ...baseHeaders, 'Location': `${resolvedUrl}/1` },
        body: JSON.stringify({
          success: true,
          data: { id: Math.floor(Math.random() * 9000) + 1000, ...parsed, createdAt: new Date().toISOString() },
          message: 'Recurso criado com sucesso',
        }, null, 2),
      };
    }
    case 'PUT':
    case 'PATCH': {
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(resolvedBody); } catch { /* empty */ }
      return {
        status: 200,
        statusText: 'OK',
        time,
        headers: baseHeaders,
        body: JSON.stringify({
          success: true,
          data: { id: 1, ...parsed, updatedAt: new Date().toISOString() },
          message: 'Recurso atualizado com sucesso',
        }, null, 2),
      };
    }
    case 'DELETE':
      return {
        status: 204,
        statusText: 'No Content',
        time,
        headers: { 'Date': baseHeaders['Date'], 'X-Request-Id': baseHeaders['X-Request-Id'] },
        body: '',
      };
    default:
      return { status: 200, statusText: 'OK', time, headers: baseHeaders, body: '{}' };
  }
}

// Returns true if there's an unclosed {{ before the cursor
function hasOpenBrace(value: string, cursorPos?: number): boolean {
  const text = cursorPos !== undefined ? value.slice(0, cursorPos) : value;
  const lastOpen = text.lastIndexOf('{{');
  if (lastOpen === -1) return false;
  return !text.slice(lastOpen + 2).includes('}}');
}

// Replaces the trailing {{ (before cursor) with {{outputKey}}
function insertAgentVariable(
  value: string,
  outputKey: string,
  cursorPos?: number
): string {
  const boundary = cursorPos !== undefined ? cursorPos : value.length;
  const before = value.slice(0, boundary);
  const after = cursorPos !== undefined ? value.slice(cursorPos) : '';
  const lastOpen = before.lastIndexOf('{{');
  if (lastOpen === -1) return value + `{{${outputKey}}}`;
  return before.slice(0, lastOpen) + `{{${outputKey}}}` + after;
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

  // Test panel state
  const [rightColumnTab, setRightColumnTab] = useState('body');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Autocomplete dropdown state
  const [acDropdown, setAcDropdown] = useState<{
    open: boolean;
    top: number;
    left: number;
    width: number;
    onSelect: (outputKey: string) => void;
  }>({ open: false, top: 0, left: 0, width: 0, onSelect: () => {} });
  const acDropdownRef = useRef<HTMLDivElement>(null);

  const detectedVariables = useMemo(
    () => extractVariables(endpointUrl, queryParams, headers, body),
    [endpointUrl, queryParams, headers, body]
  );

  const resolvedUrl = useMemo(() => {
    let resolved = resolveTemplate(endpointUrl, variableValues);
    const resolvedParams = queryParams
      .filter(p => p.key.trim())
      .map(p => `${encodeURIComponent(resolveTemplate(p.key, variableValues))}=${encodeURIComponent(resolveTemplate(p.value, variableValues))}`)
      .join('&');
    if (resolvedParams) resolved += (resolved.includes('?') ? '&' : '?') + resolvedParams;
    return resolved;
  }, [endpointUrl, queryParams, variableValues]);

  const updateVariableValue = useCallback((varName: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [varName]: value }));
  }, []);

  // Auto-populate agent output variables with mock values when detected
  useEffect(() => {
    setVariableValues(prev => {
      const updated = { ...prev };
      detectedVariables.forEach(varName => {
        const agent = mockAgents.find(a => a.outputKey === varName);
        if (agent && !(varName in prev)) {
          updated[varName] = agent.mockOutput;
        }
      });
      return updated;
    });
  }, [detectedVariables]);

  // Helper to open the autocomplete dropdown for any input/textarea
  const openAcDropdown = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      currentValue: string,
      onSelect: (outputKey: string) => void
    ) => {
      const cursorPos = e.target.selectionStart ?? currentValue.length;
      if (hasOpenBrace(currentValue, cursorPos)) {
        const rect = e.target.getBoundingClientRect();
        setAcDropdown({
          open: true,
          top: rect.bottom + 4,
          left: rect.left,
          width: Math.max(rect.width, 280),
          onSelect,
        });
      } else {
        setAcDropdown(prev => ({ ...prev, open: false }));
      }
    },
    []
  );

  const closeAcDropdown = useCallback(() => {
    setAcDropdown(prev => ({ ...prev, open: false }));
  }, []);

  const handleTestAPI = useCallback(async () => {
    if (!endpointUrl.trim()) {
      toast.error('Preencha a URL antes de testar');
      return;
    }
    setIsTesting(true);
    setTestResponse(null);

    const delay = Math.floor(Math.random() * 500) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    const resolvedBody = resolveTemplate(body, variableValues);
    const response = generateMockResponse(method, resolvedUrl, resolvedBody);
    setTestResponse(response);
    setIsTesting(false);
    toast.success(`Simulação concluída — ${response.status} ${response.statusText}`);
  }, [endpointUrl, body, variableValues, method, resolvedUrl]);

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
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="endpoint-url" className="text-woopi-ai-dark-gray">Endpoint URL</Label>
                      <span
                        title='Digite {{ para inserir o output de um agente'
                        className="text-woopi-ai-gray hover:text-woopi-ai-blue transition-colors cursor-help"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <Input
                      id="endpoint-url"
                      placeholder="https://api.example.com/v1/resource"
                      value={endpointUrl}
                      onChange={(e) => {
                        setEndpointUrl(e.target.value);
                        openAcDropdown(e, e.target.value, (outputKey) => {
                          setEndpointUrl(prev =>
                            insertAgentVariable(prev, outputKey)
                          );
                          closeAcDropdown();
                        });
                      }}
                      onBlur={() => setTimeout(closeAcDropdown, 150)}
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
                              onBlur={() => setTimeout(closeAcDropdown, 150)}
                              className="flex-1 border-woopi-ai-border dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                            />
                            <Input
                              placeholder="Value"
                              value={param.value}
                              onChange={(e) => {
                                updateQueryParam(param.id, 'value', e.target.value);
                                openAcDropdown(e, e.target.value, (outputKey) => {
                                  updateQueryParam(
                                    param.id,
                                    'value',
                                    insertAgentVariable(param.value, outputKey)
                                  );
                                  closeAcDropdown();
                                });
                              }}
                              onBlur={() => setTimeout(closeAcDropdown, 150)}
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
                              onBlur={() => setTimeout(closeAcDropdown, 150)}
                              className="flex-1 border-woopi-ai-border dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                            />
                            <Input
                              placeholder="Value"
                              type={header.secret ? 'password' : 'text'}
                              value={header.value}
                              onChange={(e) => {
                                updateHeader(header.id, 'value', e.target.value);
                                if (!header.secret) {
                                  openAcDropdown(e, e.target.value, (outputKey) => {
                                    updateHeader(
                                      header.id,
                                      'value',
                                      insertAgentVariable(header.value, outputKey)
                                    );
                                    closeAcDropdown();
                                  });
                                }
                              }}
                              onBlur={() => setTimeout(closeAcDropdown, 150)}
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

          {/* Right Column - Body & Test */}
          <div>
            <Card className="woopi-ai-card h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <Tabs value={rightColumnTab} onValueChange={setRightColumnTab} className="flex flex-col h-full">
                  <TabsList className="grid w-full grid-cols-2 dark:bg-[#2d3354] mb-4">
                    <TabsTrigger value="body" className="dark:data-[state=active]:bg-[#393e5c] dark:text-[#9196b0] dark:data-[state=active]:text-[#d5d8e0]">
                      Body
                    </TabsTrigger>
                    <TabsTrigger value="test" className="dark:data-[state=active]:bg-[#393e5c] dark:text-[#9196b0] dark:data-[state=active]:text-[#d5d8e0]">
                      <Play className="w-3.5 h-3.5 mr-1.5" />
                      Teste
                    </TabsTrigger>
                  </TabsList>

                  {/* Body Tab */}
                  <TabsContent value="body" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
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
                        onChange={(e) => {
                          setBody(e.target.value);
                          openAcDropdown(e, e.target.value, (outputKey) => {
                            const cursorPos = e.target.selectionStart ?? e.target.value.length;
                            setBody(prev => insertAgentVariable(prev, outputKey, cursorPos));
                            closeAcDropdown();
                          });
                        }}
                        onBlur={() => setTimeout(closeAcDropdown, 150)}
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

                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-700/50">
                      <p className="text-xs text-blue-900 dark:text-blue-300">
                        <strong>Dica:</strong> Use <code className="bg-blue-100 px-1 py-0.5 rounded dark:bg-blue-900/40 dark:text-blue-200">{'{{variavel}}'}</code>{' '}
                        para dados dinâmicos. Digite{' '}
                        <code className="bg-blue-100 px-1 py-0.5 rounded dark:bg-blue-900/40 dark:text-blue-200">{'{{' }</code>{' '}
                        para inserir o output de um agente.
                      </p>
                    </div>
                  </TabsContent>

                  {/* Test Tab */}
                  <TabsContent value="test" className="flex-1 flex flex-col mt-0 overflow-y-auto data-[state=inactive]:hidden">
                    {/* Variables Section */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-woopi-ai-dark-gray mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-woopi-ai-blue" />
                        Variáveis Detectadas
                      </h3>

                      {detectedVariables.length === 0 ? (
                        <div className="text-center py-6 text-sm text-woopi-ai-gray border border-dashed border-woopi-ai-border rounded-lg dark:border-[#393e5c]">
                          Nenhuma variável <code className="text-xs bg-woopi-ai-light-gray px-1 py-0.5 rounded dark:bg-[#2d3354]">{'{{'} {'}}'}</code> detectada no template.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {detectedVariables.map((varName) => {
                            const agent = mockAgents.find(a => a.outputKey === varName);
                            if (agent) {
                              return (
                                <div
                                  key={varName}
                                  className="rounded-lg border border-blue-200 dark:border-blue-700/40 bg-blue-50 dark:bg-blue-900/15 p-3 space-y-2"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <Bot className="w-3.5 h-3.5 text-woopi-ai-blue flex-shrink-0" />
                                    <code className="text-xs font-mono text-woopi-ai-blue font-semibold">
                                      {`{{${varName}}}`}
                                    </code>
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0 h-4 ml-auto border-blue-300 dark:border-blue-600 text-woopi-ai-blue"
                                    >
                                      Output de Agente
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-woopi-ai-gray">{agent.name}</p>
                                  <pre className="text-[10px] font-mono leading-relaxed p-2 rounded bg-white dark:bg-[#1e2035] border border-blue-100 dark:border-blue-800/50 text-woopi-ai-dark-gray max-h-[80px] overflow-auto whitespace-pre-wrap">
                                    {agent.mockOutput}
                                  </pre>
                                </div>
                              );
                            }
                            return (
                              <div key={varName} className="flex items-center gap-2">
                                <Label className="text-xs font-mono text-woopi-ai-gray whitespace-nowrap min-w-[100px] text-right">
                                  {`{{${varName}}}`}
                                </Label>
                                <Input
                                  placeholder={`Valor para ${varName}`}
                                  value={variableValues[varName] ?? ''}
                                  onChange={(e) => updateVariableValue(varName, e.target.value)}
                                  className="flex-1 text-sm border-woopi-ai-border dark:border-[#393e5c] dark:bg-[#2d3354] dark:text-[#d5d8e0] dark:placeholder:text-[#7a7f9d]"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Resolved URL Preview */}
                    {endpointUrl.trim() && (
                      <div className="mb-4 p-3 rounded-lg bg-woopi-ai-light-gray border border-woopi-ai-border dark:bg-[#2d3354] dark:border-[#393e5c]">
                        <p className="text-xs text-woopi-ai-gray mb-1 font-medium">URL Resolvida</p>
                        <p className="text-xs font-mono text-woopi-ai-dark-gray break-all leading-relaxed">
                          <Badge variant="outline" className="mr-2 text-[10px] px-1.5 py-0 font-bold border-woopi-ai-border dark:border-[#393e5c]">
                            {method}
                          </Badge>
                          {resolvedUrl}
                        </p>
                      </div>
                    )}

                    {/* Execute Button */}
                    <Button
                      onClick={handleTestAPI}
                      disabled={isTesting || !endpointUrl.trim()}
                      className="woopi-ai-button-primary w-full mb-4"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Simulando...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Simular Requisição
                        </>
                      )}
                    </Button>

                    {/* Response Area */}
                    {testResponse && (
                      <div className="flex-1 space-y-3">
                        {/* Status Bar */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-woopi-ai-light-gray border border-woopi-ai-border dark:bg-[#2d3354] dark:border-[#393e5c]">
                          <Badge className={`text-xs font-bold px-2 py-0.5 ${
                            testResponse.status < 300
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700/50'
                              : testResponse.status < 400
                              ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50'
                              : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50'
                          }`}>
                            {testResponse.status < 300 ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {testResponse.status} {testResponse.statusText}
                          </Badge>
                          <span className="text-xs text-woopi-ai-gray flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {testResponse.time}ms
                          </span>
                        </div>

                        {/* Response Headers */}
                        <details className="group">
                          <summary className="text-xs font-medium text-woopi-ai-gray cursor-pointer hover:text-woopi-ai-dark-gray select-none">
                            Response Headers ({Object.keys(testResponse.headers).length})
                          </summary>
                          <div className="mt-2 p-2 rounded bg-woopi-ai-light-gray border border-woopi-ai-border text-xs font-mono space-y-1 dark:bg-[#2d3354] dark:border-[#393e5c]">
                            {Object.entries(testResponse.headers).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="text-woopi-ai-blue font-medium">{key}:</span>
                                <span className="text-woopi-ai-dark-gray break-all">{value}</span>
                              </div>
                            ))}
                          </div>
                        </details>

                        {/* Response Body */}
                        {testResponse.body ? (
                          <div>
                            <p className="text-xs font-medium text-woopi-ai-gray mb-2">Response Body</p>
                            <pre className="p-3 rounded-lg bg-[#1e1e2e] text-[#cdd6f4] text-xs font-mono overflow-auto max-h-[300px] border border-[#313244] leading-relaxed">
                              {testResponse.body}
                            </pre>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-sm text-woopi-ai-gray">
                            Sem body na resposta (204 No Content)
                          </div>
                        )}
                      </div>
                    )}

                    {/* Empty state when no test has been run */}
                    {!testResponse && !isTesting && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <div className="w-12 h-12 rounded-full bg-woopi-ai-light-gray flex items-center justify-center mb-3 dark:bg-[#2d3354]">
                          <Play className="w-5 h-5 text-woopi-ai-gray" />
                        </div>
                        <p className="text-sm text-woopi-ai-gray mb-1">Nenhum teste executado</p>
                        <p className="text-xs text-woopi-ai-gray/70">
                          Preencha as variáveis e clique em "Simular Requisição"
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Agent Output Autocomplete Dropdown */}
      {acDropdown.open && (
        <div
          ref={acDropdownRef}
          style={{
            position: 'fixed',
            top: acDropdown.top,
            left: acDropdown.left,
            width: acDropdown.width,
            zIndex: 9999,
          }}
          className="bg-card border border-woopi-ai-border dark:border-[#393e5c] rounded-lg shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-woopi-ai-border dark:border-[#393e5c] bg-blue-50 dark:bg-blue-900/20">
            <Bot className="w-3.5 h-3.5 text-woopi-ai-blue flex-shrink-0" />
            <span className="text-xs font-semibold text-woopi-ai-dark-gray dark:text-[#d5d8e0]">
              Outputs de Agentes
            </span>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {mockAgents.map(agent => (
              <button
                key={agent.id}
                type="button"
                className="w-full text-left px-3 py-2.5 hover:bg-woopi-ai-light-blue dark:hover:bg-blue-900/20 transition-colors border-b border-woopi-ai-border/50 dark:border-[#393e5c]/50 last:border-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  acDropdown.onSelect(agent.outputKey);
                }}
              >
                <div className="text-sm font-medium text-woopi-ai-dark-gray dark:text-[#d5d8e0] leading-tight">
                  {agent.name}
                </div>
                <div className="text-xs font-mono text-woopi-ai-blue mt-0.5">
                  {`{{${agent.outputKey}}}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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