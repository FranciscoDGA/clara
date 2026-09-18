import type { TriagemResult, TipoCaso, Urgencia } from '../types'
import { TIPO_CASO_CATEGORIAS } from '../constants'

// Classificador leve por regras + keywords (roda em Edge, ~0 tokens).
// Versão 2 pode trocar por DistilBERT ONNX sem mudar a interface.

interface Regra {
  tipo: TipoCaso
  keywords: string[]
  urgenciaBase: Urgencia
  docs: string[]
  passos: string[]
}

const REGRAS: Regra[] = [
  {
    tipo: 'medida_protetiva_urgente',
    keywords: ['ameaçou', 'ameaca', 'morte', 'bateu', 'agrediu', 'agressão', 'violência', 'violencia', 'medo', 'persegue', 'stalk', 'maria da penha', 'protetiva'],
    urgenciaBase: 'critica',
    docs: ['medida_protetiva', 'boletim_ocorrencia_guia'],
    passos: [
      'Ligue 180 (Central de Atendimento à Mulher) ou 190 em risco imediato',
      'Vá à Delegacia da Mulher mais próxima com documento e relate os fatos',
      'Peça medida protetiva de urgência (afastamento, proibição de contato)',
      'Guarde provas: prints, fotos, áudios, testemunhas',
    ],
  },
  {
    tipo: 'pensao_alimenticia_inicial',
    keywords: ['pensão', 'pensao', 'alimento', 'filho', 'não paga', 'nao paga', 'sustento', 'guarda', 'paga pouco'],
    urgenciaBase: 'alta',
    docs: ['peticao_alimentos', 'alimentos_provisorios', 'gratuidade'],
    passos: [
      'Junte certidões de nascimento dos filhos + comprovante de endereço',
      'Liste gastos mensais das crianças (escola, saúde, alimentação)',
      'Tentamos acordo? Se não, protocolamos ação de alimentos',
      'Peça alimentos provisórios (valor rápido até decisão final)',
    ],
  },
  {
    tipo: 'divorcio_consensual',
    keywords: ['divórcio', 'divorcio', 'separar', 'concordam', 'acordo', 'amigável', 'amigavel', 'partilha'],
    urgenciaBase: 'normal',
    docs: ['peticao_divorcio_consensual', 'partilha_bens', 'gratuidade'],
    passos: [
      'Confirmem acordo sobre filhos, bens e pensão',
      'Juntem certidão de casamento + docs dos bens',
      'Assinem petição conjunta (pode ser na Defensoria, sem advogado particular)',
    ],
  },
  {
    tipo: 'divorcio_litigioso',
    keywords: ['divórcio', 'divorcio', 'não concorda', 'nao concorda', 'briga', 'litígio', 'litigio', 'saiu de casa'],
    urgenciaBase: 'alta',
    docs: ['peticao_divorcio_litigioso', 'alimentos_provisorios', 'gratuidade'],
    passos: [
      'Registre a data da separação de fato',
      'Liste bens comuns e dívidas',
      'Protocole ação + peça alimentos provisórios e regulamentação de visitas',
    ],
  },
  {
    tipo: 'guarda_compartilhada',
    keywords: ['guarda compartilhada', 'guarda', 'visita', 'ver meu filho', 'não deixa ver', 'regulamentar'],
    urgenciaBase: 'alta',
    docs: ['regulamentacao_visitas', 'guarda_compartilhada', 'gratuidade'],
    passos: [
      'Documente impedimentos de visita (mensagens, testemunhas)',
      'Peça regulamentação de visitas + guarda compartilhada como regra',
      'Se há risco à criança, peça guarda unilateral provisória',
    ],
  },
  {
    tipo: 'assedio_sexual',
    keywords: ['assédio sexual', 'assedio sexual', 'chefe', 'toque', 'cantada', 'trabalho', 'demitida', 'chantagem'],
    urgenciaBase: 'alta',
    docs: ['denuncia_assedio', 'rescisao_indireta_guia'],
    passos: [
      'Guarde TODAS as provas (prints, e-mails, testemunhas)',
      'Denuncie no canal interno + MPT (Ministério Público do Trabalho)',
      'Você pode pedir rescisão indireta (sair com todos os direitos)',
    ],
  },
  {
    tipo: 'assedio_moral',
    keywords: ['assédio moral', 'assedio moral', 'humilha', 'grita', 'perseguição no trabalho', 'pressão'],
    urgenciaBase: 'normal',
    docs: ['denuncia_assedio', 'rescisao_indireta_guia'],
    passos: [
      'Registre datas, fatos e testemunhas',
      'Denuncie no canal interno e no sindicato',
      'Avalie rescisão indireta com advogada trabalhista',
    ],
  },
  {
    tipo: 'licenca_maternidade_negada',
    keywords: ['licença maternidade', 'licenca maternidade', 'grávida', 'gravida', 'gestante', 'demitiram grávida', 'estabilidade'],
    urgenciaBase: 'alta',
    docs: ['reclamatoria_trabalhista', 'estabilidade_gestante'],
    passos: [
      'Gestante tem estabilidade: não pode ser demitida (da confirmação até 5 meses após parto)',
      'Guarde exame, ultrassom, carteira de trabalho',
      'Entre com reclamatória pedindo reintegração ou indenização',
    ],
  },
  {
    tipo: 'nome_sujo_indevido',
    keywords: ['spc', 'serasa', 'nome sujo', 'dívida que não fiz', 'cobrança indevida', 'negativação'],
    urgenciaBase: 'normal',
    docs: ['declaratoria_inexistencia_debito', 'dano_moral_guia'],
    passos: [
      'Pegue extrato no Serasa/SPC e guarde o comprovante da negativação',
      'Contestação administrativa + ação declaratória com pedido de liminar',
      'Cabe dano moral (jurisprudência: R$ 5k–15k)',
    ],
  },
  {
    tipo: 'inventario',
    keywords: ['inventário', 'inventario', 'falecido', 'herança', 'heranca', 'partilha herança', 'pai morreu', 'mãe morreu'],
    urgenciaBase: 'normal',
    docs: ['inventario_inicial', 'nomeacao_inventariante'],
    passos: [
      'Junte certidão de óbito + docs de herdeiros + docs dos bens',
      'Prazo: abrir em 60 dias (multa após)',
      'Se todos concordam: inventário em cartório (mais rápido e barato)',
    ],
  },
]

const RISCO_CRITICO = ['morte', 'matar', 'faca', 'arma', 'bateu', 'sangue', 'ontem me bateu', 'ameaçou de morte', 'subtração', 'levou meu filho', 'sumiu com']
const RISCO_ALTO = ['medida protetiva', 'boletim', 'não paga há meses', 'despejo', 'demitida grávida']

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function triar(relato: string): TriagemResult {
  const texto = norm(relato)
  let melhor: Regra | null = null
  let melhorScore = 0

  for (const regra of REGRAS) {
    let score = 0
    for (const kw of regra.keywords) {
      if (texto.includes(norm(kw))) score += kw.length > 6 ? 2 : 1
    }
    if (score > melhorScore) {
      melhorScore = score
      melhor = regra
    }
  }

  if (!melhor || melhorScore === 0) {
    return {
      tipo_caso: 'fora_escopo',
      categoria: 'outro',
      urgencia: 'baixa',
      confianca: 0.3,
      dados_extraidos: extrairDados(relato),
      proximos_passos: [
        'Conte com mais detalhes: o que aconteceu, quando, quem está envolvido',
        'Se for urgente (risco de vida), ligue 180 ou 190 agora',
      ],
      documentos_sugeridos: [],
      tokens_estimados: Math.ceil(relato.length / 4),
    }
  }

  let urgencia: Urgencia = melhor.urgenciaBase
  if (RISCO_CRITICO.some((k) => texto.includes(norm(k)))) urgencia = 'critica'
  else if (RISCO_ALTO.some((k) => texto.includes(norm(k))) && urgencia !== 'critica') urgencia = 'alta'

  const confianca = Math.min(0.55 + melhorScore * 0.08, 0.95)

  return {
    tipo_caso: melhor.tipo,
    categoria: TIPO_CASO_CATEGORIAS[melhor.tipo] ?? 'família',
    urgencia,
    confianca: Math.round(confianca * 100) / 100,
    dados_extraidos: extrairDados(relato),
    proximos_passos: melhor.passos,
    documentos_sugeridos: melhor.docs,
    tokens_estimados: Math.ceil(relato.length / 4),
  }
}

export function extrairDados(relato: string): Record<string, unknown> {
  const dados: Record<string, unknown> = {}
  const cpf = relato.match(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/)
  if (cpf) dados.cpf_mencionado = true
  const filhos = relato.match(/(\d+)\s*filhos?/i)
  if (filhos) dados.qtd_filhos_mencionada = parseInt(filhos[1], 10)
  const valor = relato.match(/R\$\s?([\d.,]+)/)
  if (valor) dados.valor_mencionado = valor[1]
  const cidades = relato.match(/(São Paulo|Rio de Janeiro|Belo Horizonte|Salvador|Fortaleza|Recife|Porto Alegre|Curitiba|Goiânia|Brasília|Manaus|Belém)/i)
  if (cidades) dados.cidade_mencionada = cidades[1]
  return dados
}
