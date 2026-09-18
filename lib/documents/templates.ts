export interface TemplateDoc {
  tipo: string
  titulo: string
  gerar: (dados: Record<string, unknown>) => { markdown: string; faltantes: string[] }
}

function val(dados: Record<string, unknown>, chave: string, rotulo: string, faltantes: string[]): string {
  const v = dados[chave]
  if (v === undefined || v === null || v === '') {
    faltantes.push(rotulo)
    return `[PREENCHER: ${rotulo}]`
  }
  return String(v)
}

export const TEMPLATES: Record<string, TemplateDoc> = {
  peticao_alimentos: {
    tipo: 'peticao_alimentos',
    titulo: 'Ação de Alimentos — Petição Inicial',
    gerar: (dados) => {
      const f: string[] = []
      const nome = val(dados, 'nome_completo', 'nome completo da autora', f)
      const cpf = val(dados, 'cpf', 'CPF da autora', f)
      const endereco = val(dados, 'endereco_completo', 'endereço completo', f)
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const reu = val(dados, 'nome_reu', 'nome completo do réu (pai)', f)
      const filhos = (dados.filhos as Array<{ nome: string; data_nasc: string }>) ?? []
      if (filhos.length === 0) f.push('dados dos filhos (nome + data de nascimento)')
      const rendaReu = val(dados, 'renda_reu', 'renda mensal presumida do réu', f)

      const filhosTxt = filhos.length
        ? filhos.map((x) => `   - ${x.nome}, nascido(a) em ${x.data_nasc};`).join('\n')
        : '   - [PREENCHER: nome e nascimento de cada filho];'

      const markdown = `PODER JUDICIÁRIO — COMARCA DE ${comarca}

${nome}, brasileira, portadora do CPF nº ${cpf}, residente em ${endereco}, vem propor

AÇÃO DE ALIMENTOS em face de ${reu},

I — DOS FATOS
1. Da relação nasceram:
${filhosTxt}
2. O réu não contribui regularmente para o sustento dos filhos.
3. A autora arca sozinha com moradia, alimentação, escola, saúde e transporte.
4. Renda presumida do réu: ${rendaReu}.

II — DO DIREITO
Art. 1.694 do CC e Lei 5.478/68. Presentes necessidade (crianças) e possibilidade (réu com renda).

III — PEDIDOS
a) Citação do réu;
b) ALIMENTOS PROVISÓRIOS em 30% dos rendimentos do réu;
c) Gratuidade da justiça (art. 98, CPC);
d) Produção de provas.

${comarca}, ${new Date().toLocaleDateString('pt-BR')}.

⚠️ Documento gerado pela Clara como BASE. Leve à Defensoria Pública ou advogada para revisão antes de protocolar. Não substitui orientação jurídica individual.`

      return { markdown, faltantes: f }
    },
  },

  alimentos_provisorios: {
    tipo: 'alimentos_provisorios',
    titulo: 'Pedido de Alimentos Provisórios (Liminar)',
    gerar: (dados) => {
      const f: string[] = []
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const valor = val(dados, 'valor_pretendido', 'valor mensal pretendido', f)
      const markdown = `PEDIDO DE ALIMENTOS PROVISÓRIOS (art. 4º, Lei 5.478/68) — COMARCA DE ${comarca}

Requer fixação liminar de R$ ${valor}/mês, por presentes fumus boni iuris (parentesco + necessidade) e periculum in mora (crianças sem sustento).

⚠️ Leve à Defensoria/advogada para revisão.`
      return { markdown, faltantes: f }
    },
  },

  medida_protetiva: {
    tipo: 'medida_protetiva',
    titulo: 'Pedido de Medida Protetiva de Urgência (Lei Maria da Penha)',
    gerar: (dados) => {
      const f: string[] = []
      const nome = val(dados, 'nome_completo', 'nome completo da vítima', f)
      const agressor = val(dados, 'nome_agressor', 'nome do agressor', f)
      const fatos = val(dados, 'descricao_fatos', 'descrição dos fatos (quando, onde, como)', f)
      const markdown = `PEDIDO DE MEDIDA PROTETIVA DE URGÊNCIA — Lei 11.340/06

Vítima: ${nome}
Agressor: ${agressor}

FATOS:
${fatos}

MEDIDAS REQUERIDAS (art. 22):
( ) Afastamento do lar
( ) Proibição de aproximação (mínimo 200m)
( ) Proibição de contato por qualquer meio
( ) Suspensão de visitas
( ) Alimentos provisórios

🚨 EM RISCO AGORA? Ligue 180 ou 190. Vá à Delegacia da Mulher com este documento + provas (prints, fotos, testemunhas).`
      return { markdown, faltantes: f }
    },
  },

  peticao_divorcio_consensual: {
    tipo: 'peticao_divorcio_consensual',
    titulo: 'Divórcio Consensual — Petição Conjunta',
    gerar: (dados) => {
      const f: string[] = []
      const c1 = val(dados, 'conjuge_1', 'nome do cônjuge 1', f)
      const c2 = val(dados, 'conjuge_2', 'nome do cônjuge 2', f)
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const markdown = `DIVÓRCIO CONSENSUAL — COMARCA DE ${comarca}

${c1} e ${c2}, de comum acordo, requerem a decretação do divórcio, com:
1. Partilha conforme plano anexo;
2. Guarda e visitas conforme plano anexo;
3. Pensão conforme plano anexo;
4. Gratuidade da justiça.

Assinaturas: ______________________  ______________________

⚠️ Leve à Defensoria para homologação.`
      return { markdown, faltantes: f }
    },
  },

  regulamentacao_visitas: {
    tipo: 'regulamentacao_visitas',
    titulo: 'Regulamentação de Visitas + Guarda',
    gerar: (dados) => {
      const f: string[] = []
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const markdown = `REGULAMENTAÇÃO DE VISITAS — COMARCA DE ${comarca}

Requer guarda compartilhada (regra, art. 1.583 CC) e regulamentação de visitas:
- Finais de semana alternados;
- Férias escolares divididas;
- Busca e entrega em local neutro.

Se há impedimento atual, juntar provas (prints/testemunhas).

⚠️ Leve à Defensoria/advogada para revisão.`
      return { markdown, faltantes: f }
    },
  },

  gratuidade: {
    tipo: 'gratuidade',
    titulo: 'Pedido de Gratuidade da Justiça',
    gerar: () => ({
      markdown: `PEDIDO DE GRATUIDADE (art. 98, CPC)

Declaro hipossuficiência econômica e requeiro os benefícios da justiça gratuita (isenção de custas, emolumentos e honorários sucumbenciais).

Anexos sugeridos: comprovante de renda / CadÚnico / declaração de próprio punho.

Data e assinatura: ______________________`,
      faltantes: [],
    }),
  },
}

export function gerarDocumento(tipo: string, dados: Record<string, unknown>) {
  const t = TEMPLATES[tipo]
  if (!t) throw new Error(`Template desconhecido: ${tipo}`)
  return { titulo: t.titulo, ...t.gerar(dados) }
}
