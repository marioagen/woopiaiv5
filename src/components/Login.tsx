import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Lock, ShieldUser, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

import woopiLogoLight from 'figma:asset/d0e110e88aea65bfb09073174b18b4e3597f0769.png';
import woopiLogoDark from 'figma:asset/4a827bcd6fba2a68b95dda353e5dbc1a88ba0e45.png';
import { useDarkMode } from '../hooks/useDarkMode';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isDark, toggleDark } = useDarkMode();

  // Component initialization - no automatic localStorage clearing

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI Testing mode - always allow login without validation
    onLogin();
  };

  const handleQuickLogin = () => {
    // Quick login for UI testing - direciona para a página de workflow
    navigate('/workflow');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-woopi-ai-light-blue to-white dark:from-[#1a1b2e] dark:to-[#1f2132] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={isDark ? woopiLogoDark : woopiLogoLight}
              alt="WOOPI AI" 
              style={{ height: '58px' }}
              className="object-contain"
            />
          </div>
        </div>

        {/* Quick Access for UI Testing */}
        <div className="mb-6">
          <Button 
            onClick={handleQuickLogin}
            className="w-full woopi-ai-button-primary mb-4"
          >
            🚀 Acesso Rápido (Modo UI Testing)
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 woopi-ai-text-secondary">
                Ou use o formulário tradicional
              </span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="woopi-ai-card shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              Acesse sua conta para gerenciar documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com (opcional para UI testing)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-woopi-ai-border"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 woopi-ai-text-secondary" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha (opcional para UI testing)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-woopi-ai-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 woopi-ai-text-secondary hover:text-woopi-ai-dark-gray"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full woopi-ai-button-primary">
                Entrar
              </Button>

              {/* SSO Options */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 woopi-ai-text-secondary">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleQuickLogin}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M1 1h10v10H1z"/>
                    <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                    <path fill="#7fba00" d="M1 13h10v10H1z"/>
                    <path fill="#ffb900" d="M13 13h10v10H13z"/>
                  </svg>
                  Login com Microsoft
                </Button>
              </div>

              {/* MFA Notice */}
              <div className="bg-woopi-ai-light-blue p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ShieldUser className="w-4 h-4 text-woopi-ai-blue" />
                  <span className="text-sm woopi-ai-text-primary">
                    Modo UI Testing - Login sem validação habilitado
                  </span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Dark Mode Toggle - bottom right corner */}
      <button
        onClick={toggleDark}
        title={isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border transition-all duration-300 cursor-pointer select-none
          bg-white/90 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900
          dark:bg-[#292f4c]/90 dark:border-[#393e5c] dark:text-[#d5d8e0] dark:hover:bg-[#393e5c]"
      >
        <span className="relative w-5 h-5 flex items-center justify-center">
          <Sun
            className={`w-4 h-4 absolute transition-all duration-300 ${
              isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <Moon
            className={`w-4 h-4 absolute transition-all duration-300 ${
              isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
            }`}
          />
        </span>
        <span className="text-xs font-medium">
          {isDark ? 'Modo Claro' : 'Modo Escuro'}
        </span>
      </button>
    </div>
  );
}