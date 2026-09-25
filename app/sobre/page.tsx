import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Sobre a Clara — Seus Direitos, Claros',
  description: 'O que é a Clara, para quem ela existe e como funciona a navegadora de direitos da mulher.',
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-clara-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">Sobre a Clara</h1>
        <Card>
          <CardHeader><CardTitle>O que é</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-neutral-800 leading-relaxed">
            <p>
              A Clara é uma navegadora de direitos da mulher: uma plataforma que traduz histórias
              contadas com palavras simples em <strong>triagem jurídica, documentos-base e passo a passo</strong> para
              protocolar na Defensoria Pública ou com advogada.
            </p>
            <p>
              Nascemos de um problema visível: milhões de mulheres têm direitos (pensão, guarda, medida
              protetiva, estabilidade) e não conseguem exercê-los por falta de informação, dinheiro para
              advogado ou medo do sistema. A Clara existe para encurtar esse caminho.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>O que a Clara não é</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-neutral-800 leading-relaxed">
            <p>
              A Clara <strong>não é escritório de advocacia</strong> e não substitui a orientação jurídica
              individual. Os documentos gerados são <strong>bases para revisão</strong> da Defensoria Pública
              ou de advogada. Em situação de risco, a Clara não substitui o atendimento emergencial:
              ligue <strong>180</strong> ou <strong>190</strong>.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Como funciona</CardTitle></CardHeader>
          <CardContent>
            <ol className="list-decimal ml-5 space-y-1.5">
              <li>Você conta sua história na <Link href="/triagem" className="text-clara-700 underline">triagem gratuita</Link>, por texto ou voz.</li>
              <li>A Clara identifica seu tipo de caso e gera os documentos-base em PDF.</li>
              <li>Você leva tudo pronto à Defensoria com o <Link href="/checklist" className="text-clara-700 underline">checklist</Link>.</li>
            </ol>
            <div className="mt-4"><Link href="/triagem"><Button>Começar agora</Button></Link></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
