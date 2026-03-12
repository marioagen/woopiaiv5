import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { DocumentTypesPage } from './DocumentTypesPage';
import { QuestionsPage } from './QuestionsPage';
import { QuestionnairesPage } from './QuestionnairesPage';

export function QuestionnairesUnifiedPage() {
  const [activeTab, setActiveTab] = useState('questionarios');

  return (
    <div className="relative h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl md:text-2xl font-bold woopi-ai-text-primary">Questionários</h1>
            <p className="woopi-ai-text-secondary text-sm md:text-base">
              Gerencie questionários, perguntas e tipos de documentos do sistema
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="questionarios">Questionários</TabsTrigger>
              <TabsTrigger value="perguntas">Perguntas</TabsTrigger>
              <TabsTrigger value="tipos">Tipos</TabsTrigger>
            </TabsList>

            <TabsContent value="questionarios" className="mt-0">
              <QuestionnairesPage />
            </TabsContent>

            <TabsContent value="perguntas" className="mt-0">
              <QuestionsPage />
            </TabsContent>

            <TabsContent value="tipos" className="mt-0">
              <DocumentTypesPage />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}