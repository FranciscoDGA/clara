import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Termos de Uso | Clara',
  description: 'Regras de uso da plataforma Clara: conta, planos, documentos-base e responsabilidades.',
}

const SECOES = [
  {
    t: '1. O que é a Clara',
    d: 'A Clara é uma plataforma de informação e organização jurídica: triagem do seu caso, geração de documentos-base e passo a passo para protocolar na Defensoria Pública ou com advogada. A Clara não é escritório de advocacia e não presta consultoria jurídica individual.',
  },
  {
    t: '2. Conta e acesso',
    d: 'Para salvar casos e gerar documentos você precisa de conta (e-mail e senha). Você é responsável por manter sua senha em sigilo e pelos dados informados. Contas usadas para fraude ou violação destes termos podem ser suspensas.',
  },
  {
    t: '3. Documentos-base e aviso legal',
    d: 'Os documentos gerados são modelos iniciais que exigem revisão da Defensoria Pública ou de advogada antes do protocolo. A Clara não garante deferimento de pedidos nem resultados em processos. Em situação de risco, ligue 180 (Central da Mulher) ou 190 (emergência): a plataforma não é canal de atendimento emergencial.',
  },
  {
    t: '4. Planos e limites',
    d: 'Plano gratuito: 1 caso ativo e 2 documentos por mês, sem cartão. Planos pagos (Clara+ e Clara Pro) ampliam esses limites conforme anunciado na página de planos. Podemos ajustar limites e preços com aviso prévio.',
  },
  {
    t: '5. Uso aceitável',
    d: 'É proibido: inserir dados falsos de terceiros, usar a plataforma para gerar peças com finalidade ilícita, tentar acessar dados de outras usuárias, copiar ou revender o serviço sem autorização.',
  },
  {
    t: '6. Privacidade e LGPD',
    d: 'O tratamento de dados pessoais segue nossa Política de Privacidade. Cada conta acessa apenas os próprios casos e documentos.',
  },
  {
    t: '7. Alterações e contato',
    d: 'Podemos atualizar estes termos; a versão vigente estará sempre nesta página. Dúvidas: oi@clara.direito.br.',
  },
]

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-clara-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground text-center">Última atualização: setembro de 2026</p>
        {SECOES.map((s) => (
          <Card key={s.t}>
            <CardHeader><CardTitle className="text-lg">{s.t}</CardTitle></CardHeader>
            <CardContent><p className="text-neutral-800 leading-relaxed">{s.d}</p></CardContent>
          </Card>
        ))}
        <p className="text-center text-sm text-muted-foreground">
          Veja também: <Link href="/privacidade" className="text-clara-700 underline">Privacidade (LGPD)</Link> •{' '}
          <Link href="/sobre" className="text-clara-700 underline">Sobre</Link> •{' '}
          <Link href="/contato" className="text-clara-700 underline">Contato</Link>
        </p>
      </div>
    </div>
  )
}
