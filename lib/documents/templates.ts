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

  boletim_ocorrencia_guia: {
    tipo: 'boletim_ocorrencia_guia',
    titulo: 'Boletim de Ocorrência — Guia',
    gerar: (dados) => {
      const f: string[] = []
      const nome = val(dados, 'nome_completo', 'nome completo da vítima', f)
      const cpf = val(dados, 'cpf', 'CPF da vítima', f)
      const fatos = val(dados, 'descricao_fatos', 'descrição dos fatos (quando, onde, como)', f)
      const markdown = `BOLETIM DE OCORRÊNCIA — GUIA (leve à Delegacia da Mulher)

Declarante: ${nome} — CPF: ${cpf}

FATOS:
${fatos}

PRÓXIMOS PASSOS:
1. Vá à Delegacia da Mulher mais próxima com RG/CPF + este guia + provas (prints, fotos, testemunhas).
2. Relate os fatos com data, hora e local. Peça o número do BO.
3. Se houver risco, peça MEDIDA PROTETIVA na mesma ida (Lei 11.340/06).
4. Guarde a cópia do BO para anexar ao pedido de medida protetiva.

🚨 Em risco agora? Ligue 180 ou 190.

⚠️ Documento gerado pela Clara como BASE. Não substitui orientação jurídica individual.`
      return { markdown, faltantes: f }
    },
  },

  partilha_bens: {
    tipo: 'partilha_bens',
    titulo: 'Plano de Partilha de Bens',
    gerar: (dados) => {
      const f: string[] = []
      const c1 = val(dados, 'conjuge_1', 'nome do cônjuge 1', f)
      const c2 = val(dados, 'conjuge_2', 'nome do cônjuge 2', f)
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const markdown = `PLANO DE PARTILHA DE BENS — COMARCA DE ${comarca}

${c1} e ${c2} acordam a partilha:

1. Imóveis: [PREENCHER: endereço, matrícula, valor, quem fica / venda e divisão];
2. Veículos: [PREENCHER: placa, modelo, valor, quem fica];
3. Contas e dívidas: [PREENCHER: saldos, empréstimos, cartão];
4. Regime de bens: [PREENCHER: comunhão parcial / universal / separação].

Regra geral (comunhão parcial, art. 1.658 CC): divide-se o adquirido a título oneroso na constância da união.

Assinaturas: ______________________  ______________________

⚠️ Leve à Defensoria/advogada para revisão antes de homologar.`
      return { markdown, faltantes: f }
    },
  },

  peticao_divorcio_litigioso: {
    tipo: 'peticao_divorcio_litigioso',
    titulo: 'Divórcio Litigioso — Petição Inicial',
    gerar: (dados) => {
      const f: string[] = []
      const nome = val(dados, 'nome_completo', 'nome completo da autora', f)
      const cpf = val(dados, 'cpf', 'CPF da autora', f)
      const endereco = val(dados, 'endereco_completo', 'endereço completo', f)
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const reu = val(dados, 'nome_reu', 'nome completo do réu', f)
      const markdown = `PODER JUDICIÁRIO — COMARCA DE ${comarca}

${nome}, CPF nº ${cpf}, residente em ${endereco}, vem propor

AÇÃO DE DIVÓRCIO LITIGIOSO em face de ${reu},

I — DOS FATOS
1. Separação de fato em: [PREENCHER: data].
2. Filhos: [PREENCHER: nomes e nascimentos, se houver].
3. Bens comuns: [PREENCHER: lista].
4. O réu não concorda com os termos, exigindo decisão judicial.

II — PEDIDOS
a) Decretação do divórcio;
b) Guarda + regulamentação de visitas;
c) Alimentos provisórios;
d) Partilha de bens;
e) Gratuidade da justiça (art. 98, CPC).

${comarca}, ${new Date().toLocaleDateString('pt-BR')}.

⚠️ Documento gerado pela Clara como BASE. Leve à Defensoria Pública ou advogada para revisão.`
      return { markdown, faltantes: f }
    },
  },

  guarda_compartilhada: {
    tipo: 'guarda_compartilhada',
    titulo: 'Pedido de Guarda Compartilhada',
    gerar: (dados) => {
      const f: string[] = []
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const markdown = `PEDIDO DE GUARDA COMPARTILHADA — COMARCA DE ${comarca}

Requer guarda compartilhada (regra, art. 1.583 CC — melhor interesse da criança):

1. Residência base: [PREENCHER: endereço];
2. Decisões conjuntas (escola, saúde, viagens);
3. Visitas conforme plano anexo (finais de semana alternados, férias divididas);
4. Alimentos: [PREENCHER: valor mensal pretendido].

Exceção (guarda unilateral) só com prova robusta de risco.

⚠️ Leve à Defensoria/advogada para revisão.`
      return { markdown, faltantes: f }
    },
  },

  denuncia_assedio: {
    tipo: 'denuncia_assedio',
    titulo: 'Denúncia de Assédio (Moral/Sexual) — Guia',
    gerar: (dados) => {
      const f: string[] = []
      const nome = val(dados, 'nome_completo', 'nome completo da denunciante', f)
      const fatos = val(dados, 'descricao_fatos', 'descrição dos fatos (datas, locais, testemunhas)', f)
      const markdown = `DENÚNCIA DE ASSÉDIO — GUIA

Denunciante: ${nome}

FATOS:
${fatos}

ONDE DENUNCIAR:
1. Canal interno da empresa (ouvidoria/RH) — protocole por escrito;
2. Sindicato da categoria;
3. MPT — Ministério Público do Trabalho (denúncia online);
4. Se assédio sexual com contato/chantagem: Delegacia + BO.

PROVAS: guarde prints, e-mails, áudios, testemunhas, avaliações. Não apague nada.

⚠️ Assédio sexual no trabalho pode gerar rescisão indireta (saída com todos os direitos) + dano moral. Procure advogada trabalhista/Defensoria.

Documento-base gerado pela Clara. Não substitui orientação jurídica individual.`
      return { markdown, faltantes: f }
    },
  },

  rescisao_indireta_guia: {
    tipo: 'rescisao_indireta_guia',
    titulo: 'Rescisão Indireta — Guia (CLT art. 483)',
    gerar: (dados) => {
      const f: string[] = []
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const markdown = `RESCISÃO INDIRETA — GUIA (CLT art. 483) — ${comarca}

Cabe quando o empregador comete falta grave: assédio, exigência de serviços além do contrato, perigo, descumprimento salarial, etc.

PASSOS:
1. Registre tudo (datas, fatos, testemunhas, provas);
2. Notifique a empresa por escrito (e-mail/AR);
3. Entre com reclamatória pedindo: rescisão indireta + verbas (aviso, 13º, férias + 1/3, FGTS + 40%, seguro-desemprego) + dano moral se houver.

⚠️ Não peça demissão antes de falar com advogada — você pode perder direitos. Leve este guia à Defensoria Trabalhista/sindicato.`
      return { markdown, faltantes: f }
    },
  },

  reclamatoria_trabalhista: {
    tipo: 'reclamatoria_trabalhista',
    titulo: 'Reclamatória Trabalhista — Base',
    gerar: (dados) => {
      const f: string[] = []
      const nome = val(dados, 'nome_completo', 'nome completo da reclamante', f)
      const cpf = val(dados, 'cpf', 'CPF da reclamante', f)
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const fatos = val(dados, 'descricao_fatos', 'descrição dos fatos', f)
      const markdown = `RECLAMATÓRIA TRABALHISTA — ${comarca}

Reclamante: ${nome}, CPF ${cpf}.

FATOS:
${fatos}

PEDIDOS:
a) Verbas rescisórias devidas;
b) Reintegração ou indenização (se gestante — estabilidade até 5 meses após o parto);
c) Horas extras / diferenças, se houver;
d) Dano moral, se cabível;
e) Gratuidade da justiça.

⚠️ Base gerada pela Clara. Leve à Defensoria/sindicato/advogada trabalhista com CTPS, contracheques e provas.`
      return { markdown, faltantes: f }
    },
  },

  estabilidade_gestante: {
    tipo: 'estabilidade_gestante',
    titulo: 'Estabilidade da Gestante — Guia',
    gerar: (dados) => {
      const f: string[] = []
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const markdown = `ESTABILIDADE DA GESTANTE — GUIA — ${comarca}

Gestante não pode ser demitida da confirmação da gravidez até 5 meses após o parto (ADCT art. 10, II, b).

SE FOI DEMITIDA:
1. Guarde exame, ultrassom, aviso-prévio, TRCT;
2. Peça reintegração OU indenização do período (salários + direitos);
3. Prazo: entre com reclamatória o quanto antes.

⚠️ Leve à Defensoria/sindicato com urgência. Base gerada pela Clara.`
      return { markdown, faltantes: f }
    },
  },

  declaratoria_inexistencia_debito: {
    tipo: 'declaratoria_inexistencia_debito',
    titulo: 'Declaratória de Inexistência de Débito c/c Liminar',
    gerar: (dados) => {
      const f: string[] = []
      const nome = val(dados, 'nome_completo', 'nome completo da autora', f)
      const cpf = val(dados, 'cpf', 'CPF da autora', f)
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const markdown = `AÇÃO DECLARATÓRIA DE INEXISTÊNCIA DE DÉBITO c/c INDENIZAÇÃO — ${comarca}

Autora: ${nome}, CPF ${cpf}.

FATOS: negativação indevida (SPC/Serasa) por dívida que não reconhece. [PREENCHER: empresa, valor, data da negativação].

PEDIDOS:
a) Liminar para exclusão imediata do nome dos cadastros;
b) Declaração de inexistência do débito;
c) Dano moral (jurisprudência: R$ 5k–15k em casos típicos);
d) Gratuidade da justiça.

Anexos: extrato Serasa/SPC + comprovante da negativação + RG/CPF + comprovante de endereço.

⚠️ Base gerada pela Clara. Leve à Defensoria/Juizado Especial Cível.`
      return { markdown, faltantes: f }
    },
  },

  dano_moral_guia: {
    tipo: 'dano_moral_guia',
    titulo: 'Dano Moral — Guia Prático',
    gerar: () => ({
      markdown: `DANO MORAL — GUIA PRÁTICO

QUANDO CABE: negativação indevida, assédio, cobrança vexatória, vazamento de dados, etc.

O QUE JUNTAR:
1. Prova do fato (BO, prints, extratos, testemunhas);
2. Prova do abalo (não precisa quantificar — o dano é presumido em negativação indevida);
3. Documentos pessoais + comprovante de endereço.

VALORES (referência jurisprudencial, variam por caso):
- Nome sujo indevido: R$ 5k–15k;
- Assédio comprovado: conforme gravidade e porte da empresa.

⚠️ Juizado Especial Cível aceita causas até 40 salários-mínimos sem advogado (até 20 sem advogado). Base gerada pela Clara.`,
      faltantes: [],
    }),
  },

  inventario_inicial: {
    tipo: 'inventario_inicial',
    titulo: 'Inventário — Petição Inicial (Base)',
    gerar: (dados) => {
      const f: string[] = []
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const markdown = `INVENTÁRIO — PETIÇÃO INICIAL (BASE) — ${comarca}

Falecido(a): [PREENCHER: nome, data do óbito, certidão];
Herdeiros: [PREENCHER: nomes, CPFs, parentesco];
Bens: [PREENCHER: imóveis (matrícula), veículos (placa), contas];
Dívidas: [PREENCHER, se houver].

PRAZO: abrir em 60 dias do óbito (multa ITCMD após).

Se TODOS concordam e não há menores: faça em CARTÓRIO (mais rápido e barato).
Se há briga ou menor: judicial, com nomeação de inventariante.

⚠️ Base gerada pela Clara. Leve à Defensoria/advogada com certidão de óbito + docs de herdeiros e bens.`
      return { markdown, faltantes: f }
    },
  },

  nomeacao_inventariante: {
    tipo: 'nomeacao_inventariante',
    titulo: 'Nomeação de Inventariante — Pedido',
    gerar: (dados) => {
      const f: string[] = []
      const nome = val(dados, 'nome_completo', 'nome do(a) requerente', f)
      const comarca = val(dados, 'comarca', 'comarca (cidade/UF)', f)
      const markdown = `PEDIDO DE NOMEAÇÃO DE INVENTARIANTE — ${comarca}

Requerente: ${nome}.

Requer nomeação como inventariante (art. 617 CPC — ordem: cônjuge, herdeiro, legatário, testamenteiro), com poderes para representar o espólio, levantar valores e administrar bens até a partilha.

Declara compromisso de bem exercer o encargo.

Assinatura: ______________________

⚠️ Base gerada pela Clara. Leve à Defensoria/advogada.`
      return { markdown, faltantes: f }
    },
  },
}

export function gerarDocumento(tipo: string, dados: Record<string, unknown>) {
  const t = TEMPLATES[tipo]
  if (!t) throw new Error(`Template desconhecido: ${tipo}`)
  return { titulo: t.titulo, ...t.gerar(dados) }
}
