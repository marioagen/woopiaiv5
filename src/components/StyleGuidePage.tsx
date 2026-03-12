import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  Settings, 
  User, 
  Home, 
  FileText, 
  Calendar, 
  Bell, 
  Menu,
  Check,
  X,
  ChevronDown,
  Star,
  Heart,
  Mail,
  Phone,
  AlertCircle,
  MoreHorizontal,
  Paperclip,
  MessageCircle,
  Image as ImageIcon,
  Users,
  ChartBar,
  LogIn
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

export function StyleGuidePage() {
  const [switchValue, setSwitchValue] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [sliderValue, setSliderValue] = useState([50]);
  const [tenantModalOpen, setTenantModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [isLoadingTenant, setIsLoadingTenant] = useState(false);

  // Tenants data
  const tenants = [
    { id: '1', name: 'Organização Principal', email: 'admin@organizacao.com.br' },
    { id: '2', name: 'Filial São Paulo', email: 'sp@filiais.com.br' },
    { id: '3', name: 'Filial Rio de Janeiro', email: 'rj@filiais.com.br' },
    { id: '4', name: 'Filial Minas Gerais', email: 'mg@filiais.com.br' },
    { id: '5', name: 'Filial Bahia', email: 'ba@filiais.com.br' },
    { id: '6', name: 'Filial Paraná', email: 'pr@filiais.com.br' },
  ];

  const handleTenantSelect = (value: string) => {
    setSelectedTenant(value);
    setTenantModalOpen(false);
    setIsLoadingTenant(true);
    
    // Simula loading temporário
    setTimeout(() => {
      setIsLoadingTenant(false);
    }, 2000);
  };

  // Kanban sample data
  const kanbanColumns = [
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
      tasks: [
        {
          id: 1,
          title: 'Research FAQ page UX',
          label: 'UX',
          labelColor: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
          attachments: 4,
          comments: 12,
          assignees: [
            { name: 'João Silva', avatar: null, initials: 'JS' },
            { name: 'Maria Santos', avatar: null, initials: 'MS' }
          ]
        },
        {
          id: 2,
          title: 'Review Javascript code',
          label: 'Code Review',
          labelColor: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
          attachments: 2,
          comments: 8,
          assignees: [
            { name: 'Pedro Costa', avatar: null, initials: 'PC' },
            { name: 'Ana Maria', avatar: null, initials: 'AM' }
          ]
        }
      ]
    },
    {
      id: 'in-review',
      title: 'In Review',
      color: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
      tasks: [
        {
          id: 3,
          title: 'Review completed Apps',
          label: 'Info',
          labelColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
          attachments: 8,
          comments: 17,
          assignees: [
            { name: 'Carlos Silva', avatar: null, initials: 'CS' },
            { name: 'Fernanda Lima', avatar: null, initials: 'FL' }
          ]
        },
        {
          id: 4,
          title: 'Find new images for pages',
          label: 'Images',
          labelColor: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400',
          attachments: 10,
          comments: 18,
          hasImage: true,
          assignees: [
            { name: 'Roberto Mendes', avatar: null, initials: 'RM' },
            { name: 'Juliana Ferreira', avatar: null, initials: 'JF' },
            { name: 'Lucas Barbosa', avatar: null, initials: 'LB' },
            { name: 'Patrícia Alves', avatar: null, initials: 'PA' }
          ]
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
      tasks: [
        {
          id: 5,
          title: 'Forms & Tables section',
          label: 'App',
          labelColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400',
          attachments: 1,
          comments: 4,
          assignees: [
            { name: 'Ricardo Gomes', avatar: null, initials: 'RG' },
            { name: 'Camila Torres', avatar: null, initials: 'CT' },
            { name: 'Diego Rocha', avatar: null, initials: 'DR' }
          ]
        },
        {
          id: 6,
          title: 'Completed Charts & Maps',
          label: 'Charts & Maps',
          labelColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400',
          attachments: 6,
          comments: 21,
          assignees: [
            { name: 'Sophia Martins', avatar: null, initials: 'SM' }
          ]
        }
      ]
    }
  ];

  const KanbanCard = ({ task }: { task: any }) => (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow duration-200 bg-card border border-woopi-ai-border">
      <CardContent className="p-3 lg:p-4">
        <div className="space-y-3">
          {/* Label */}
          <Badge className={`${task.labelColor} text-xs font-medium`}>
            {task.label}
          </Badge>
          
          {/* Task Title */}
          <h4 className="font-medium woopi-ai-text-primary text-sm leading-relaxed">
            {task.title}
          </h4>
          
          {/* Sample Image for specific tasks */}
          {task.hasImage && (
            <div className="w-full h-24 lg:h-32 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-600 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
            </div>
          )}
          
          {/* Bottom Row: Attachments, Comments, Assignees */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Attachments */}
              <div className="flex items-center space-x-1 woopi-ai-text-secondary">
                <Paperclip className="w-3 h-3" />
                <span className="text-xs">{task.attachments}</span>
              </div>
              
              {/* Comments */}
              <div className="flex items-center space-x-1 woopi-ai-text-secondary">
                <MessageCircle className="w-3 h-3" />
                <span className="text-xs">{task.comments}</span>
              </div>
            </div>
            
            {/* Assignees */}
            <div className="flex -space-x-1">
              {task.assignees.slice(0, 3).map((assignee: any, index: number) => (
                <Avatar key={index} className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-card">
                  <AvatarFallback className="bg-woopi-ai-blue text-white text-xs">
                    {assignee.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 3 && (
                <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-woopi-ai-gray text-white text-xs flex items-center justify-center border-2 border-card">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const KanbanColumn = ({ column }: { column: any }) => (
    <div className={`rounded-lg border-2 border-dashed ${column.color} p-3 lg:p-4 min-h-80 lg:min-h-96`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium woopi-ai-text-primary text-sm lg:text-base">{column.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Edit Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Tasks */}
      <div className="space-y-3">
        {column.tasks.map((task: any) => (
          <KanbanCard key={task.id} task={task} />
        ))}
        
        {/* Add New Item Button */}
        <Button
          variant="ghost"
          className="w-full justify-start text-woopi-ai-gray hover:text-woopi-ai-dark-gray hover:bg-woopi-ai-light-gray/50 border-2 border-dashed border-transparent hover:border-woopi-ai-border text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl lg:text-3xl font-bold woopi-ai-text-primary">Design Style Guide</h1>
            <p className="woopi-ai-text-secondary text-sm lg:text-base">Guia completo dos componentes e estilos do sistema</p>
          </div>

          {/* Typography Section */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Tipografia</CardTitle>
              <CardDescription>Hierarquia e estilos de texto do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6">
              {/* Font Family Information */}
              <div className="space-y-4 p-4 bg-woopi-ai-light-gray/30 rounded-lg">
                <h4 className="font-medium woopi-ai-text-primary">Família de Fontes</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium woopi-ai-text-primary">"Segoe UI", Tahoma, Geneva, Verdana, sans-serif</p>
                    <p className="text-xs woopi-ai-text-secondary mt-1">Font stack padrão para todo o sistema - definida no body do CSS global</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm woopi-ai-text-secondary">
                    <span><strong>Primária:</strong> Segoe UI</span>
                    <span><strong>Fallback 1:</strong> Tahoma</span>
                    <span><strong>Fallback 2:</strong> Geneva</span>
                    <span><strong>Fallback 3:</strong> Verdana</span>
                    <span><strong>Genérica:</strong> sans-serif</span>
                  </div>
                  <div className="p-3 bg-card rounded border border-woopi-ai-border">
                    <p className="text-sm woopi-ai-text-primary">
                      <strong>Exemplo de texto:</strong> Este é um exemplo de como o texto aparece com a font stack configurada no sistema.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Typography Examples */}
              <div className="space-y-4">
                <h4 className="font-medium woopi-ai-text-primary">Hierarquia de Títulos</h4>
                
                <div>
                  <h1 className="text-xl lg:text-2xl xl:text-3xl">Título Principal (H1)</h1>
                  <p className="text-xs woopi-ai-text-secondary mt-1">32px, font-weight: 500, woopi-ai-dark-gray</p>
                </div>
                
                <div>
                  <h2 className="text-lg lg:text-xl xl:text-2xl">Título Secundário (H2)</h2>
                  <p className="text-xs woopi-ai-text-secondary mt-1">24px, font-weight: 500, woopi-ai-dark-gray</p>
                </div>
                
                <div>
                  <h3 className="text-base lg:text-lg xl:text-xl">Título Terciário (H3)</h3>
                  <p className="text-xs woopi-ai-text-secondary mt-1">20px, font-weight: 500, woopi-ai-dark-gray</p>
                </div>
                
                <div>
                  <h4 className="text-sm lg:text-base">Título Quaternário (H4)</h4>
                  <p className="text-xs woopi-ai-text-secondary mt-1">16px, font-weight: 500, woopi-ai-dark-gray</p>
                </div>
                
                <Separator />
                
                <h4 className="font-medium woopi-ai-text-primary">Texto Comum</h4>
                
                <div>
                  <p className="text-sm">Texto de parágrafo regular usado para descrições e conteúdo geral do sistema.</p>
                  <p className="text-xs woopi-ai-text-secondary mt-1">14px, font-weight: 400, woopi-ai-gray</p>
                </div>
                
                <div>
                  <Label>Label de formulário</Label>
                  <p className="text-xs woopi-ai-text-secondary mt-1">14px, font-weight: 500, woopi-ai-dark-gray</p>
                </div>
                
                <div>
                  <Input placeholder="Texto de input" className="max-w-xs border-border bg-input-background" />
                  <p className="text-xs woopi-ai-text-secondary mt-1">14px, font-weight: 400, woopi-ai-dark-gray</p>
                </div>
                
                <div>
                  <p className="text-xs woopi-ai-text-secondary">Texto de legenda e informações auxiliares</p>
                  <p className="text-xs woopi-ai-text-secondary mt-1">12px, font-weight: 400, woopi-ai-gray</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors Section */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Cores do Sistema</CardTitle>
              <CardDescription>Paleta de cores baseada no Woopi-AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                <div className="space-y-2">
                  <div className="w-full h-12 lg:h-16 bg-woopi-ai-blue rounded-lg border"></div>
                  <p className="text-sm font-medium">Woopi-AI Blue</p>
                  <p className="text-xs woopi-ai-text-secondary">#0073ea</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-12 lg:h-16 bg-woopi-ai-light-blue rounded-lg border"></div>
                  <p className="text-sm font-medium">Light Blue</p>
                  <p className="text-xs woopi-ai-text-secondary">#e1e9f8</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-12 lg:h-16 bg-woopi-ai-dark-blue rounded-lg border"></div>
                  <p className="text-sm font-medium">Dark Blue</p>
                  <p className="text-xs woopi-ai-text-secondary">#0060c7</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-12 lg:h-16 bg-woopi-ai-success rounded-lg border"></div>
                  <p className="text-sm font-medium">Success</p>
                  <p className="text-xs woopi-ai-text-secondary">#00d2d2</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-12 lg:h-16 bg-woopi-ai-warning rounded-lg border"></div>
                  <p className="text-sm font-medium">Warning</p>
                  <p className="text-xs woopi-ai-text-secondary">#ffcb00</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-12 lg:h-16 bg-woopi-ai-orange rounded-lg border"></div>
                  <p className="text-sm font-medium">Orange</p>
                  <p className="text-xs woopi-ai-text-secondary">#fd7e14</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-12 lg:h-16 bg-woopi-ai-error rounded-lg border"></div>
                  <p className="text-sm font-medium">Error</p>
                  <p className="text-xs woopi-ai-text-secondary">#d83a52</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-12 lg:h-16 bg-woopi-ai-dark-gray rounded-lg border"></div>
                  <p className="text-sm font-medium">Dark Gray</p>
                  <p className="text-xs woopi-ai-text-secondary">#323338</p>
                </div>
                
                <div className="space-y-2">
                  <div className="w-full h-12 lg:h-16 bg-woopi-ai-gray rounded-lg border"></div>
                  <p className="text-sm font-medium">Gray</p>
                  <p className="text-xs woopi-ai-text-secondary">#676879</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Dark Mode Palette */}
              <div className="space-y-5">
                <div>
                  <h4 className="font-medium woopi-ai-text-primary">Paleta Dark Mode</h4>
                  <p className="text-xs woopi-ai-text-secondary mt-1">Cores fixas usadas exclusivamente no modo escuro (Monday.com-inspired)</p>
                </div>

                {/* Backgrounds */}
                <div className="space-y-2">
                  <p className="text-xs font-medium woopi-ai-text-secondary uppercase tracking-wider">Fundos</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border" style={{ backgroundColor: '#1f2132' }}></div>
                      <p className="text-sm font-medium">Page Background</p>
                      <p className="text-xs woopi-ai-text-secondary">#1f2132</p>
                      <p className="text-[10px] woopi-ai-text-secondary font-mono">dark:bg-[#1f2132]</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border" style={{ backgroundColor: '#1a1b2e' }}></div>
                      <p className="text-sm font-medium">Sidebar</p>
                      <p className="text-xs woopi-ai-text-secondary">#1a1b2e</p>
                      <p className="text-[10px] woopi-ai-text-secondary font-mono">dark:bg-[#1a1b2e]</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border" style={{ backgroundColor: '#292f4c' }}></div>
                      <p className="text-sm font-medium">Cards / Painéis</p>
                      <p className="text-xs woopi-ai-text-secondary">#292f4c</p>
                      <p className="text-[10px] woopi-ai-text-secondary font-mono">dark:bg-[#292f4c]</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border" style={{ backgroundColor: '#2d3354' }}></div>
                      <p className="text-sm font-medium">Muted / Secondary</p>
                      <p className="text-xs woopi-ai-text-secondary">#2d3354</p>
                      <p className="text-[10px] woopi-ai-text-secondary font-mono">dark:bg-[#2d3354]</p>
                    </div>
                  </div>
                </div>

                {/* Borders & Interactions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium woopi-ai-text-secondary uppercase tracking-wider">Bordas & Interações</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border" style={{ backgroundColor: '#393e5c' }}></div>
                      <p className="text-sm font-medium">Border / Hover</p>
                      <p className="text-xs woopi-ai-text-secondary">#393e5c</p>
                      <p className="text-[10px] woopi-ai-text-secondary font-mono">dark:border-[#393e5c]</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border overflow-hidden flex">
                        <div className="flex-1" style={{ backgroundColor: '#292f4c' }}></div>
                        <div className="flex-1" style={{ backgroundColor: '#2d3354' }}></div>
                        <div className="flex-1" style={{ backgroundColor: '#393e5c' }}></div>
                      </div>
                      <p className="text-sm font-medium">Hover States</p>
                      <p className="text-xs woopi-ai-text-secondary">#2d3354 → #393e5c</p>
                      <p className="text-[10px] woopi-ai-text-secondary font-mono">dark:hover:bg-[#2d3354]</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border overflow-hidden" style={{ backgroundColor: '#1e2a4a' }}>
                        <div className="w-full h-full opacity-30" style={{ backgroundColor: '#3b82f6' }}></div>
                      </div>
                      <p className="text-sm font-medium">Selected Item</p>
                      <p className="text-xs woopi-ai-text-secondary">blue-900/20</p>
                      <p className="text-[10px] woopi-ai-text-secondary font-mono">dark:bg-blue-900/20</p>
                    </div>
                  </div>
                </div>

                {/* Text Colors */}
                <div className="space-y-2">
                  <p className="text-xs font-medium woopi-ai-text-secondary uppercase tracking-wider">Textos</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border flex items-center justify-center" style={{ backgroundColor: '#1f2132' }}>
                        <span className="text-sm font-medium" style={{ color: '#e2e4ea' }}>Aa</span>
                      </div>
                      <p className="text-sm font-medium">Heading</p>
                      <p className="text-xs woopi-ai-text-secondary">#e2e4ea</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border flex items-center justify-center" style={{ backgroundColor: '#1f2132' }}>
                        <span className="text-sm font-medium" style={{ color: '#d5d8e0' }}>Aa</span>
                      </div>
                      <p className="text-sm font-medium">Primary</p>
                      <p className="text-xs woopi-ai-text-secondary">#d5d8e0</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border flex items-center justify-center" style={{ backgroundColor: '#1f2132' }}>
                        <span className="text-sm font-medium" style={{ color: '#b0b4c8' }}>Aa</span>
                      </div>
                      <p className="text-sm font-medium">Secondary</p>
                      <p className="text-xs woopi-ai-text-secondary">#b0b4c8</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border flex items-center justify-center" style={{ backgroundColor: '#1f2132' }}>
                        <span className="text-sm font-medium" style={{ color: '#9196b0' }}>Aa</span>
                      </div>
                      <p className="text-sm font-medium">Muted</p>
                      <p className="text-xs woopi-ai-text-secondary">#9196b0</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-12 lg:h-16 rounded-lg border border-woopi-ai-border flex items-center justify-center" style={{ backgroundColor: '#1f2132' }}>
                        <span className="text-sm font-medium" style={{ color: '#7a7f9d' }}>Aa</span>
                      </div>
                      <p className="text-sm font-medium">Disabled</p>
                      <p className="text-xs woopi-ai-text-secondary">#7a7f9d</p>
                    </div>
                  </div>
                </div>

                {/* Badge Pattern */}
                <div className="space-y-3">
                  <p className="text-xs font-medium woopi-ai-text-secondary uppercase tracking-wider">Padrão de Badges (dark mode)</p>
                  <p className="text-[11px] woopi-ai-text-secondary">Fundo: <code className="px-1.5 py-0.5 bg-woopi-ai-light-gray rounded text-woopi-ai-dark-gray font-mono">dark:bg-&#123;cor&#125;-900/40</code> &nbsp; Texto: <code className="px-1.5 py-0.5 bg-woopi-ai-light-gray rounded text-woopi-ai-dark-gray font-mono">dark:text-&#123;cor&#125;-300</code></p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(30, 58, 138, 0.4)', color: '#93c5fd' }}>Blue</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(20, 83, 45, 0.4)', color: '#86efac' }}>Green</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(6, 78, 59, 0.4)', color: '#6ee7b7' }}>Emerald</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(127, 29, 29, 0.4)', color: '#fca5a5' }}>Red</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(124, 45, 18, 0.4)', color: '#fdba74' }}>Orange</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(88, 28, 135, 0.4)', color: '#d8b4fe' }}>Purple</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(120, 53, 15, 0.4)', color: '#fcd34d' }}>Amber</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(22, 78, 99, 0.4)', color: '#67e8f9' }}>Cyan</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(55, 65, 81, 0.4)', color: '#d1d5db' }}>Gray</span>
                  </div>
                </div>

                {/* Quick Mapping Reference Table */}
                <div className="space-y-2">
                  <p className="text-xs font-medium woopi-ai-text-secondary uppercase tracking-wider">Mapeamento Rápido: Light → Dark</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-woopi-ai-border">
                          <th className="text-left py-2 pr-4 font-medium woopi-ai-text-secondary">Light Mode</th>
                          <th className="text-left py-2 pr-4 font-medium woopi-ai-text-secondary">Dark Mode</th>
                          <th className="text-left py-2 font-medium woopi-ai-text-secondary">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-woopi-ai-border/50">
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">bg-white</code></td>
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">dark:bg-[#292f4c]</code></td>
                          <td className="py-2"><div className="flex items-center gap-1.5"><div className="w-6 h-6 rounded border border-woopi-ai-border bg-white"></div><span className="woopi-ai-text-secondary text-[10px]">→</span><div className="w-6 h-6 rounded border border-woopi-ai-border" style={{ backgroundColor: '#292f4c' }}></div></div></td>
                        </tr>
                        <tr className="border-b border-woopi-ai-border/50">
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">bg-gray-50</code></td>
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">dark:bg-[#1f2132]</code></td>
                          <td className="py-2"><div className="flex items-center gap-1.5"><div className="w-6 h-6 rounded border border-woopi-ai-border bg-gray-50"></div><span className="woopi-ai-text-secondary text-[10px]">→</span><div className="w-6 h-6 rounded border border-woopi-ai-border" style={{ backgroundColor: '#1f2132' }}></div></div></td>
                        </tr>
                        <tr className="border-b border-woopi-ai-border/50">
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">bg-gray-100</code></td>
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">dark:bg-[#2d3354]</code></td>
                          <td className="py-2"><div className="flex items-center gap-1.5"><div className="w-6 h-6 rounded border border-woopi-ai-border bg-gray-100"></div><span className="woopi-ai-text-secondary text-[10px]">→</span><div className="w-6 h-6 rounded border border-woopi-ai-border" style={{ backgroundColor: '#2d3354' }}></div></div></td>
                        </tr>
                        <tr className="border-b border-woopi-ai-border/50">
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">border-gray-200</code></td>
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">dark:border-[#393e5c]</code></td>
                          <td className="py-2"><div className="flex items-center gap-1.5"><div className="w-6 h-6 rounded border-2 border-gray-200"></div><span className="woopi-ai-text-secondary text-[10px]">→</span><div className="w-6 h-6 rounded" style={{ border: '2px solid #393e5c' }}></div></div></td>
                        </tr>
                        <tr className="border-b border-woopi-ai-border/50">
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">hover:bg-gray-50</code></td>
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">dark:hover:bg-[#2d3354]</code></td>
                          <td className="py-2"><div className="flex items-center gap-1.5"><div className="w-6 h-6 rounded border border-woopi-ai-border bg-gray-50"></div><span className="woopi-ai-text-secondary text-[10px]">→</span><div className="w-6 h-6 rounded border border-woopi-ai-border" style={{ backgroundColor: '#2d3354' }}></div></div></td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">hover:bg-gray-100</code></td>
                          <td className="py-2 pr-4"><code className="text-[11px] font-mono">dark:hover:bg-[#393e5c]</code></td>
                          <td className="py-2"><div className="flex items-center gap-1.5"><div className="w-6 h-6 rounded border border-woopi-ai-border bg-gray-100"></div><span className="woopi-ai-text-secondary text-[10px]">→</span><div className="w-6 h-6 rounded border border-woopi-ai-border" style={{ backgroundColor: '#393e5c' }}></div></div></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buttons Section */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Botões</CardTitle>
              <CardDescription>Variações de botões disponíveis no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Button className="woopi-ai-button-primary w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Botão Primário
                  </Button>
                  <p className="text-xs woopi-ai-text-secondary">woopi-ai-button-primary</p>
                </div>
                
                <div className="space-y-2">
                  <Button className="woopi-ai-button-orange w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Botão Orange
                  </Button>
                  <p className="text-xs woopi-ai-text-secondary">woopi-ai-button-orange</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Botão Outline
                  </Button>
                  <p className="text-xs woopi-ai-text-secondary">variant="outline"</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Botão Ghost
                  </Button>
                  <p className="text-xs woopi-ai-text-secondary">variant="ghost"</p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Botão Destrutivo
                  </Button>
                  <p className="text-xs woopi-ai-text-secondary">variant="destructive"</p>
                </div>
                
                <div className="space-y-2 flex flex-col items-start">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="woopi-ai-button-primary">
                      <Download className="w-4 h-4 mr-1" />
                      Pequeno
                    </Button>
                    <Button size="lg" className="woopi-ai-button-primary">
                      <Settings className="w-4 h-4 mr-2" />
                      Grande
                    </Button>
                  </div>
                  <p className="text-xs woopi-ai-text-secondary">size="sm" e size="lg"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards Section */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Cards e Containers</CardTitle>
              <CardDescription>Diferentes tipos de cards usados no sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6">
              {/* Basic Card */}
              <div className="space-y-2">
                <p className="font-medium">Card Básico</p>
                <Card className="woopi-ai-card">
                  <CardContent className="pt-6">
                    <p>Conteúdo do card básico sem header</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Card with Header */}
              <div className="space-y-2">
                <p className="font-medium">Card com Header</p>
                <Card className="woopi-ai-card">
                  <CardHeader>
                    <CardTitle>Título do Card</CardTitle>
                    <CardDescription>Descrição opcional do card</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Conteúdo principal do card com header e descrição</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Dashboard Cards */}
              <div className="space-y-2">
                <p className="font-medium">Cards de Dashboard</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  <Card className="woopi-ai-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl lg:text-2xl font-bold woopi-ai-text-primary">1,234</p>
                          <p className="text-sm woopi-ai-text-secondary">Total de Documentos</p>
                        </div>
                        <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-woopi-ai-blue" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="woopi-ai-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl lg:text-2xl font-bold woopi-ai-text-primary">567</p>
                          <p className="text-sm woopi-ai-text-secondary">Usuários Ativos</p>
                        </div>
                        <User className="w-6 h-6 lg:w-8 lg:h-8 text-woopi-ai-success" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="woopi-ai-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl lg:text-2xl font-bold woopi-ai-text-primary">89</p>
                          <p className="text-sm woopi-ai-text-secondary">Tarefas Pendentes</p>
                        </div>
                        <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-woopi-ai-orange" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kanban Board Section */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Kanban Board</CardTitle>
              <CardDescription>Quadro Kanban para gestão de projetos e tarefas estilo CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 lg:space-y-6">
                {/* Kanban Header Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                      <Input
                        placeholder="Buscar tarefas..."
                        className="pl-10 w-full sm:w-64 border-border bg-input-background focus:border-woopi-ai-blue"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full sm:w-40 border-border bg-input-background">
                        <SelectValue placeholder="Filtrar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as tarefas</SelectItem>
                        <SelectItem value="assigned">Atribuídas a mim</SelectItem>
                        <SelectItem value="priority">Alta prioridade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Users className="w-4 h-4 mr-2" />
                      Gerenciar equipe
                    </Button>
                    <Button className="woopi-ai-button-primary" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova tarefa
                    </Button>
                  </div>
                </div>
                
                {/* Kanban Board */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-6 min-h-80 lg:min-h-96">
                  {kanbanColumns.map((column) => (
                    <KanbanColumn key={column.id} column={column} />
                  ))}
                </div>
                
                {/* Kanban Features */}
                <div className="space-y-4">
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2 lg:mb-3">Recursos do Kanban</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      <div className="space-y-2 p-3 bg-woopi-ai-light-gray/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <ChartBar className="w-4 h-4 text-woopi-ai-blue" />
                          <span className="text-sm font-medium">Drag & Drop</span>
                        </div>
                        <p className="text-xs woopi-ai-text-secondary">Arrastar cards entre colunas</p>
                      </div>
                      
                      <div className="space-y-2 p-3 bg-woopi-ai-light-gray/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-woopi-ai-success" />
                          <span className="text-sm font-medium">Colaboração</span>
                        </div>
                        <p className="text-xs woopi-ai-text-secondary">Múltiplos usuários por tarefa</p>
                      </div>
                      
                      <div className="space-y-2 p-3 bg-woopi-ai-light-gray/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-woopi-ai-orange" />
                          <span className="text-sm font-medium">Comentários</span>
                        </div>
                        <p className="text-xs woopi-ai-text-secondary">Discussões em tempo real</p>
                      </div>
                      
                      <div className="space-y-2 p-3 bg-woopi-ai-light-gray/50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="w-4 h-4 text-woopi-ai-purple" />
                          <span className="text-sm font-medium">Anexos</span>
                        </div>
                        <p className="text-xs woopi-ai-text-secondary">Arquivos e documentos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Elementos de Formulário</CardTitle>
              <CardDescription>Inputs, checkboxes, radio buttons e outros controles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6">
              {/* Text Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Normal Inputs */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Estados Normais</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="input-normal">Input de Texto</Label>
                      <Input 
                        id="input-normal" 
                        placeholder="Digite algo..." 
                        className="border-border bg-input-background focus:border-woopi-ai-blue"
                      />
                      <p className="text-xs woopi-ai-text-secondary">Borda cinza clara padrão</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="search-normal">Input com Ícone</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                        <Input 
                          id="search-normal" 
                          placeholder="Buscar..." 
                          className="pl-10 border-border bg-input-background focus:border-woopi-ai-blue" 
                        />
                      </div>
                      <p className="text-xs woopi-ai-text-secondary">Com ícone interno</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="textarea-normal">Textarea</Label>
                      <Textarea 
                        id="textarea-normal" 
                        placeholder="Digite uma mensagem longa..." 
                        className="border-border bg-input-background focus:border-woopi-ai-blue" 
                        rows={3}
                      />
                      <p className="text-xs woopi-ai-text-secondary">Área de texto expansível</p>
                    </div>
                  </div>
                  
                  {/* Error States */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Estados de Erro</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="input-error">Input com Erro</Label>
                      <Input 
                        id="input-error" 
                        placeholder="Digite algo..." 
                        className="border-red-500 focus:border-red-500"
                      />
                      <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        Este campo é obrigatório
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="search-error">Input com Ícone - Erro</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500 dark:text-red-400" />
                        <Input 
                          id="search-error" 
                          placeholder="Buscar..." 
                          className="pl-10 border-red-500 focus:border-red-500" 
                        />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        Formato inválido
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="textarea-error">Textarea com Erro</Label>
                      <Textarea 
                        id="textarea-error" 
                        placeholder="Digite uma mensagem..." 
                        className="border-red-500 focus:border-red-500" 
                        rows={3}
                      />
                      <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        Mensagem muito curta (mínimo 10 caracteres)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Other Form Controls */}
              <div className="space-y-6">
                <Separator />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Checkboxes and Radio */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Checkboxes e Radio Buttons</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="checkbox-1" />
                        <Label htmlFor="checkbox-1">Opção 1</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="checkbox-2" checked />
                        <Label htmlFor="checkbox-2">Opção 2 (marcada)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="checkbox-3" disabled />
                        <Label htmlFor="checkbox-3">Opção 3 (desabilitada)</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option1" id="radio-1" />
                          <Label htmlFor="radio-1">Opção 1</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option2" id="radio-2" />
                          <Label htmlFor="radio-2">Opção 2</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option3" id="radio-3" disabled />
                          <Label htmlFor="radio-3">Opção 3 (desabilitada)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  {/* Switches and Selects */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Switches e Selects</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="switch-1" 
                          checked={switchValue} 
                          onCheckedChange={setSwitchValue} 
                        />
                        <Label htmlFor="switch-1">Habilitar notificações</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="switch-2" disabled />
                        <Label htmlFor="switch-2">Switch desabilitado</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Select Dropdown</Label>
                      <Select defaultValue="option1">
                        <SelectTrigger className="border-border bg-input-background">
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Opção 1</SelectItem>
                          <SelectItem value="option2">Opção 2</SelectItem>
                          <SelectItem value="option3">Opção 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Slider</Label>
                      <Slider 
                        value={sliderValue} 
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs woopi-ai-text-secondary">Valor: {sliderValue[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Badges e Status</CardTitle>
              <CardDescription>Diferentes tipos de badges para status e categorias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Badge className="woopi-ai-badge-primary">Primário</Badge>
                  <p className="text-xs woopi-ai-text-secondary">woopi-ai-badge-primary</p>
                </div>
                
                <div className="space-y-2">
                  <Badge className="woopi-ai-badge-success">Sucesso</Badge>
                  <p className="text-xs woopi-ai-text-secondary">woopi-ai-badge-success</p>
                </div>
                
                <div className="space-y-2">
                  <Badge className="woopi-ai-badge-warning">Aviso</Badge>
                  <p className="text-xs woopi-ai-text-secondary">woopi-ai-badge-warning</p>
                </div>
                
                <div className="space-y-2">
                  <Badge className="woopi-ai-badge-orange">Orange</Badge>
                  <p className="text-xs woopi-ai-text-secondary">woopi-ai-badge-orange</p>
                </div>
                
                <div className="space-y-2">
                  <Badge className="woopi-ai-badge-error">Erro</Badge>
                  <p className="text-xs woopi-ai-text-secondary">woopi-ai-badge-error</p>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline">Outline</Badge>
                  <p className="text-xs woopi-ai-text-secondary">variant="outline"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Icons Section */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Ícones</CardTitle>
              <CardDescription>Biblioteca de ícones Lucide React usados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                {[
                  { icon: <Home className="w-6 h-6" />, name: 'Home' },
                  { icon: <User className="w-6 h-6" />, name: 'User' },
                  { icon: <FileText className="w-6 h-6" />, name: 'FileText' },
                  { icon: <Settings className="w-6 h-6" />, name: 'Settings' },
                  { icon: <Search className="w-6 h-6" />, name: 'Search' },
                  { icon: <Plus className="w-6 h-6" />, name: 'Plus' },
                  { icon: <Edit className="w-6 h-6" />, name: 'Edit' },
                  { icon: <Trash2 className="w-6 h-6" />, name: 'Trash2' },
                  { icon: <Download className="w-6 h-6" />, name: 'Download' },
                  { icon: <Eye className="w-6 h-6" />, name: 'Eye' },
                  { icon: <Calendar className="w-6 h-6" />, name: 'Calendar' },
                  { icon: <Bell className="w-6 h-6" />, name: 'Bell' },
                  { icon: <Mail className="w-6 h-6" />, name: 'Mail' },
                  { icon: <Phone className="w-6 h-6" />, name: 'Phone' },
                  { icon: <Star className="w-6 h-6" />, name: 'Star' },
                  { icon: <Heart className="w-6 h-6" />, name: 'Heart' },
                  { icon: <Check className="w-6 h-6" />, name: 'Check' },
                  { icon: <X className="w-6 h-6" />, name: 'X' },
                  { icon: <AlertCircle className="w-6 h-6" />, name: 'AlertCircle' },
                  { icon: <MoreHorizontal className="w-6 h-6" />, name: 'MoreHorizontal' },
                  { icon: <LogIn className="w-6 h-6" />, name: 'LogIn' }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-woopi-ai-light-gray/50 transition-colors">
                    <div className="text-woopi-ai-gray">
                      {item.icon}
                    </div>
                    <p className="text-xs woopi-ai-text-secondary text-center">{item.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tables Section */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Tabelas</CardTitle>
              <CardDescription>Exemplos de tabelas responsivas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox />
                        </TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>João Silva</TableCell>
                        <TableCell>joao@exemplo.com</TableCell>
                        <TableCell>
                          <Badge className="woopi-ai-badge-success">Ativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>Maria Santos</TableCell>
                        <TableCell>maria@exemplo.com</TableCell>
                        <TableCell>
                          <Badge className="woopi-ai-badge-warning">Pendente</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>Pedro Costa</TableCell>
                        <TableCell>pedro@exemplo.com</TableCell>
                        <TableCell>
                          <Badge className="woopi-ai-badge-error">Inativo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress and Loading */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Progress e Loading</CardTitle>
              <CardDescription>Indicadores de progresso e carregamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Upload Progress</p>
                      <p className="text-sm woopi-ai-text-secondary">75%</p>
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Task Completion</p>
                      <p className="text-sm woopi-ai-text-secondary">45%</p>
                    </div>
                    <Progress value={45} className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Storage Used</p>
                      <p className="text-sm woopi-ai-text-secondary">90%</p>
                    </div>
                    <Progress value={90} className="w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tenant Selector Demo */}
          <Card className="woopi-ai-card">
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Seleção de Tenant</CardTitle>
              <CardDescription>Modal de seleção de tenant com validação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm woopi-ai-text-secondary">
                  Clique no botão abaixo para abrir o modal de seleção de tenant. Após selecionar, 
                  o modal fecha automaticamente e um indicador de loading aparece temporariamente no botão.
                </p>
                
                <Dialog open={tenantModalOpen} onOpenChange={setTenantModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="woopi-ai-button-primary"
                      disabled={isLoadingTenant}
                    >
                      {isLoadingTenant ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Carregando...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Simular Tenant
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Selecione o tenant</DialogTitle>
                      <DialogDescription>
                        Escolha o tenant para prosseguir
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="tenant-select">Tenant</Label>
                        <Select 
                          value={selectedTenant} 
                          onValueChange={handleTenantSelect}
                        >
                          <SelectTrigger id="tenant-select" className="border-border bg-input-background">
                            <SelectValue placeholder="Selecione um tenant..." />
                          </SelectTrigger>
                          <SelectContent>
                            {tenants.map((tenant) => (
                              <SelectItem key={tenant.id} value={tenant.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{tenant.name}</span>
                                  <span className="text-xs woopi-ai-text-secondary">{tenant.email}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedTenant && (
                        <div className="p-3 bg-woopi-ai-light-blue rounded-lg">
                          <p className="text-sm woopi-ai-text-primary">
                            <strong>Selecionado:</strong> {tenants.find(t => t.id === selectedTenant)?.name}
                          </p>
                          <p className="text-xs woopi-ai-text-secondary mt-1">
                            {tenants.find(t => t.id === selectedTenant)?.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                {selectedTenant && !isLoadingTenant && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-300">
                          Tenant selecionado com sucesso!
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                          {tenants.find(t => t.id === selectedTenant)?.name} - {tenants.find(t => t.id === selectedTenant)?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}