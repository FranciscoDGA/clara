'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scale, MessageCircle, FileText, ShieldCheck, Clock, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-clara-50 via-white to-white">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-600 text-white"><Scale size={20} /></span>
            Clara
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost">Entrar</Button></Link>
            <Link href="/cadastro"><Button>Começar grátis</Button></Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <section className="py-16 md:py-24 text-center animate-in">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-sm text-clara-700 shadow-sm mb-6">
            <Sparkles size={16} /> Navegadora de direitos da mulher
          </div>
          <h1 className="text-balance text-4xl md:text-6xl font-extrabold tracking-tight">
            Seus direitos, <span className="text-clara-600">claros</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Divórcio, pensão, guarda, medida protetiva. Conte sua história no WhatsApp ou aqui —
            a Clara entende, gera os documentos e te diz o passo a passo exato.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/triagem"><Button size="lg">Fazer triagem gratuita</Button></Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'}?text=${encodeURIComponent('Olá, Clara! Preciso de ajuda com um caso.')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline"><MessageCircle size={18} /> Falar no WhatsApp</Button>
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Grátis para começar • Sem advogado para começar • Leve à Defensoria para protocolar</p>
        </section>

        <section className="grid md:grid-cols-3 gap-4 pb-16">
          {[
            { icon: <MessageCircle className="text-clara-600" />, t: '1. Você conta', d: 'Descreva com suas palavras, por texto ou áudio. Sem juridiquês.' },
            { icon: <FileText className="text-clara-600" />, t: '2. Clara gera', d: 'Petição inicial, alimentos provisórios, medida protetiva, gratuidade — prontos em PDF.' },
            { icon: <ShieldCheck className="text-clara-600" />, t: '3. Você protocola', d: 'Checklist + endereços da Defensoria/Vara + alertas de prazo até o fim.' },
          ].map((c) => (
            <Card key={c.t}><CardHeader><CardTitle className="flex items-center gap-2">{c.icon}{c.t}</CardTitle></CardHeader>
            <CardContent><CardDescription className="text-base">{c.d}</CardDescription></CardContent></Card>
          ))}
        </section>

        <section className="pb-20">
          <Card className="bg-clara-900 text-white border-0">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Em risco agora?</h2>
                <p className="mt-2 text-white/80">Ligue <b>180</b> (Central da Mulher) ou <b>190</b> (emergência). A Clara ajuda com o plano de saída e a medida protetiva depois.</p>
              </div>
              <Link href="/triagem?urgente=1"><Button size="lg" variant="secondary" className="shrink-0"><Clock size={18} /> Pedir medida protetiva</Button></Link>
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-xs text-muted-foreground max-w-3xl mx-auto">
            Aviso legal: a Clara gera documentos-base para levar à Defensoria Pública ou advogada. Não substitui orientação jurídica individual nem atendimento emergencial.
          </p>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Clara © 2026 • Feito para mulheres • LGPD • Suporte: oi@clara.direito.br
      </footer>
    </div>
  )
}
