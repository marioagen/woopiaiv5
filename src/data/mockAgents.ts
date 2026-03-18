export interface AgentMock {
  id: string;
  name: string;
  outputKey: string;
  description: string;
  mockOutput: string;
}

export function generateOutputKey(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\[.*?\]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') + '_out'
  );
}

export const mockAgents: AgentMock[] = [
  {
    id: '1',
    name: 'Análise de Documentos Jurídicos',
    outputKey: 'analise_de_documentos_juridicos_out',
    description: 'Extrai informações estruturadas de documentos jurídicos',
    mockOutput: JSON.stringify(
      {
        tipo_documento: 'Contrato de Prestação de Serviços',
        partes: ['Empresa Alpha Ltda.', 'Consultoria Beta S.A.'],
        clausulas_principais: ['Prazo de vigência: 12 meses', 'Multa rescisória: 20%'],
        valor_contrato: 'R$ 84.000,00',
        data_assinatura: '2024-03-01',
      },
      null,
      2
    ),
  },
  {
    id: '2',
    name: 'Análise de Contratos',
    outputKey: 'analise_de_contratos_out',
    description: 'Análise detalhada de riscos e obrigações contratuais',
    mockOutput: JSON.stringify(
      {
        riscos_identificados: [
          'Cláusula de exclusividade ampla',
          'SLA sem penalidade definida',
        ],
        obrigacoes: {
          contratante: ['Pagamento em 30 dias'],
          contratado: ['Entrega em 15 dias úteis'],
        },
        renovacao_automatica: true,
        prazo_notificacao_rescisao_dias: 60,
      },
      null,
      2
    ),
  },
  {
    id: '3',
    name: 'Resumo Executivo',
    outputKey: 'resumo_executivo_out',
    description: 'Gera resumos executivos concisos de documentos extensos',
    mockOutput: JSON.stringify(
      {
        resumo:
          'Contrato de TI entre Alpha e Beta com vigência de 12 meses e valor de R$ 84k.',
        pontos_criticos: [
          'Renovação automática em 30 dias',
          'Cláusula de confidencialidade perpétua',
        ],
        decisoes_necessarias: ['Aprovação jurídico', 'Assinatura diretor financeiro'],
        prazo_limite: '2024-03-15',
      },
      null,
      2
    ),
  },
  {
    id: '4',
    name: 'Verificação de Conformidade',
    outputKey: 'verificacao_de_conformidade_out',
    description: 'Verifica conformidade com normas regulatórias e políticas internas',
    mockOutput: JSON.stringify(
      {
        status_conformidade: 'APROVADO_COM_RESSALVAS',
        normas_verificadas: ['LGPD', 'ISO 27001', 'SOX'],
        pendencias: ['Atualizar política de retenção de dados'],
        score_conformidade: 87,
      },
      null,
      2
    ),
  },
  {
    id: '6',
    name: 'Extração de Dados Fiscais',
    outputKey: 'extracao_de_dados_fiscais_out',
    description: 'Extrai dados fiscais de notas fiscais e documentos contábeis',
    mockOutput: JSON.stringify(
      {
        cnpj_emitente: '12.345.678/0001-90',
        numero_nf: 'NF-e 001234',
        valor_total: 'R$ 15.750,00',
        impostos: {
          ICMS: 'R$ 2.677,50',
          PIS: 'R$ 102,38',
          COFINS: 'R$ 472,50',
        },
        data_emissao: '2024-02-28',
      },
      null,
      2
    ),
  },
];
