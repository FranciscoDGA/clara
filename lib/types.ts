export type TipoCaso =
  | 'divorcio_consensual' | 'divorcio_litigioso'
  | 'pensao_alimenticia_inicial' | 'pensao_revisional' | 'pensao_executor'
  | 'alimentos_provisorios' | 'alimentos_gravidicos'
  | 'guarda_unilateral' | 'guarda_compartilhada' | 'guarda_alteracao'
  | 'regulamentacao_visitas' | 'alienacao_parental'
  | 'reconhecimento_uniao_estavel' | 'dissolucao_uniao_estavel'
  | 'partilha_bens' | 'inventario'
  | 'medida_protetiva_urgente' | 'medida_protetiva_renovacao'
  | 'assedio_moral' | 'assedio_sexual' | 'licenca_maternidade_negada' | 'estabilidade_gestante'
  | 'nome_sujo_indevido' | 'cobranca_indevida'
  | 'fora_escopo'

export type Urgencia = 'critica' | 'alta' | 'normal' | 'baixa'

export interface TriagemResult {
  tipo_caso: TipoCaso
  categoria: string
  urgencia: Urgencia
  confianca: number
  dados_extraidos: Record<string, unknown>
  proximos_passos: string[]
  documentos_sugeridos: string[]
  tokens_estimados: number
}

export interface Perfil {
  id: string
  nome: string | null
  whatsapp: string | null
  estado: string | null
  renda_faixa: string
  tem_filhos: boolean
  plano: 'gratuito' | 'clara_plus' | 'clara_pro'
}

export interface Caso {
  id: string
  usuario_id: string
  tipo_caso: string
  categoria: string
  status: string
  urgencia: string
  relato_original: string | null
  dados_extraidos: Record<string, unknown>
  prazo_proximo: string | null
  criado_em: string
  atualizado_em: string
}

export interface Documento {
  id: string
  caso_id: string
  tipo: string
  titulo: string
  conteudo_markdown: string
  variaveis_faltantes: string[]
  status: string
  gerado_em: string
}
