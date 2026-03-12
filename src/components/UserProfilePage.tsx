import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Save, User, Mail, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';

export function UserProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado inicial com dados simulados do usuário
  const [formData, setFormData] = useState({
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro específico quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Perfil atualizado com sucesso!');
      
      // Limpar campos de senha após sucesso
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
    } catch (error) {
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div>
          <h1>Minha Conta</h1>
          <p className="text-muted-foreground">
            Atualize suas informações pessoais e configurações de segurança
          </p>
        </div>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações do Perfil
          </CardTitle>
          <CardDescription>
            Mantenha suas informações atualizadas para melhor experiência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite seu nome completo"
                className={`border border-woopi-ai-border ${errors.name ? 'border-destructive' : ''}`}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Digite seu email"
                className={`border border-woopi-ai-border ${errors.email ? 'border-destructive' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Separator para seção de senha */}
            <div className="border-t pt-6">
              <h3 className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4" />
                Alterar Senha
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Deixe em branco se não quiser alterar a senha
              </p>

              {/* Nova Senha */}
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Digite sua nova senha (mínimo 6 caracteres)"
                  className={`border border-woopi-ai-border ${errors.password ? 'border-destructive' : ''}`}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2 px-[0px] py-[11px] px-[0px] py-[20px]">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirme sua nova senha"
                  className={`border border-woopi-ai-border ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2 order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 order-1 sm:order-2 sm:ml-auto woopi-ai-button-primary"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}