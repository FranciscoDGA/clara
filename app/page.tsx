'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PLANO_LABELS } from '@/lib/constants'
import {
  Scale, MessageCircle, FileText, ShieldCheck, Clock, Sparkles,
  Check, ChevronDown, Star, HeartHandshake, Gavel, Baby,
} from 'lucide-react'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
const WA_LINK = WHATSAPP
  ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá, Clara! Preciso de ajuda com um caso.')}`
  : ''

const PASSOS = [
  { icon: <MessageCircle className="text-clara-600" />, t: '1. Você conta', d: 'Descreva com suas palavras, por texto ou áudio. Sem juridiquês, sem julgamento.' },
  { icon: <FileText className="text-clara-600" />, t: '2. Clara gera', d: 'Petição inicial, alimentos provisórios, medida protetiva, gratuidade — prontos em PDF.' },
  { icon: <ShieldCheck className="text-clara-600" />, t: '3. Você protocola', d: 'Checklist + endereços da Defensoria/Vara para levar tudo pronto e não voltar pra casa de mãos vazias.' },
]

const DIFERENCIAIS = [
  { t: 'Sem advogado para começar', d: 'Você não precisa pagar consulta nem conhecer ninguém da área. A Clara traduz sua história em peças jurídicas.' },
  { t: 'Minutos, não meses', d: 'Triagem gratuita na hora e documentos gerados no mesmo dia. O sistema anda devagar — você não precisa.' },
  { t: 'Grátis para começar', d: '1 caso ativo e 2 documentos por mês sem cartão. Só pague se precisar de mais.' },
  { t: 'Feita para mulheres', d: 'Linguagem simples, acolhimento e foco nos casos que mais atingem mulheres: família, violência e trabalho.' },
]

const PERSONAS = [
  { icon: <HeartHandshake className="text-clara-600" />, t: 'Em divórcio', d: 'Separou ou quer separar e não sabe por onde começar: bens, filhos, pensão.' },
  { icon: <Baby className="text-clara-600" />, t: 'Mãe sem pensão', d: 'Ele não paga ou paga pouco. Descubra quanto pedir e gere a ação de alimentos.' },
  { icon: <ShieldCheck className="text-clara-600" />, t: 'Em situação de violência', d: 'Medo, ameaça ou agressão. Plano de saída + pedido de medida protetiva.' },
  { icon: <Gavel className="text-clara-600" />, t: 'Problemas no trabalho', d: 'Assédio, demissão na gravidez, direitos negados. Saiba o que a lei garante.' },
]

const PLANOS: Array<{ id: keyof typeof PLANO_LABELS; preco: string; destaque?: string }> = [
  { id: 'gratuito', preco: 'R$ 0' },
  { id: 'clara_plus', preco: 'R$ 29,90/mês', destaque: 'Mais popular' },
  { id: 'clara_pro', preco: 'R$ 79,90/mês' },
]

const FAQ = [
  { q: 'Preciso de advogado para usar a Clara?', a: 'Não para começar. A Clara gera documentos-base e o passo a passo. Para protocolar, você leva tudo à Defensoria Pública (gratuita) ou a uma advogada, que revisa e assina com você.' },
  { q: 'Os documentos valem no fórum?', a: 'São peças-base no formato usado na prática (fundamentação + pedidos). Elas precisam de revisão da Defensoria/advogada antes do protocolo — por isso cada documento sai com checklist do que falta preencher.' },
  { q: 'É grátis mesmo?', a: 'Sim: triagem ilimitada, 1 caso ativo e 2 documentos por mês, sem cartão. Os planos pagos liberam casos e documentos ilimitados.' },
  { q: 'Meus dados estão seguros?', a: 'Cada usuária só acessa os próprios casos (isolamento por login + políticas de segurança no banco). Nunca compartilhamos seu relato.' },
  { q: 'Estou em risco agora. O que faço?', a: 'Ligue 180 (Central da Mulher) ou 190 (emergência) antes de qualquer documento. Depois a Clara ajuda com o plano de saída e a medida protetiva.' },
  { q: 'Serve para o meu estado?', a: 'As ações seguem lei federal (válida no Brasil todo). A página de checklist traz endereços da Defensoria de SP e RJ — e cresce para outros estados.' },
]

// NOTA: depoimentos ilustrativos — trocar por casos reais autorizados assim que houver.
const DEPOIMENTOS = [
  { nome: 'M., São Paulo', caso: 'Pensão alimentícia', texto: 'Ele estava há 5 meses sem pagar. Em uma noite gerei a petição e na semana seguinte já tinha protocolo na Defensoria.' },
  { nome: 'R., Rio de Janeiro', caso: 'Medida protetiva', texto: 'Eu não sabia nem o que pedir. A Clara me deu as palavras e o documento. Foi o empurrão que faltava.' },
  { nome: 'J., Belo Horizonte', caso: 'Divórcio consensual', texto: 'Conseguimos entrar em acordo e a partilha saiu pronta. Economizamos meses de briga e dinheiro.' },
]

const RECURSOS = [
  { t: 'Checklist + endereços da Defensoria', d: 'O que levar, onde ir e o que pedir na hora de protocolar.', href: '/checklist' },
  { t: 'Triagem gratuita do seu caso', d: 'Descubra seu tipo de ação, urgência e documentos em minutos.', href: '/triagem' },
  { t: 'Medida protetiva: quando pedir', d: 'Em risco? Faça a triagem urgente e gere o pedido na hora.', href: '/triagem?urgente=1' },
]

export default function Home() {
  const [faqAberto, setFaqAberto] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-clara-50 via-white to-white">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-clara-600 text-white"><Scale size={20} /></span>
            Clara
          </Link>
          <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#como-funciona" className="hover:text-clara-700">Como funciona</a>
            <a href="#para-quem" className="hover:text-clara-700">Para quem é</a>
            <a href="#planos" className="hover:text-clara-700">Planos</a>
            <Link href="/blog" className="hover:text-clara-700">Blog</Link>
            <a href="#faq" className="hover:text-clara-700">Dúvidas</a>
          </nav>
          <nav className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost">Entrar</Button></Link>
            <Link href="/cadastro"><Button>Começar grátis</Button></Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        {/* HERO */}
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
            {WA_LINK && (
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline"><MessageCircle size={18} /> Falar no WhatsApp</Button>
              </a>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Grátis para começar • Sem advogado para começar • Leve à Defensoria para protocolar</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-clara-600" /> Triagem na hora</span>
            <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-clara-600" /> Documentos em PDF</span>
            <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-clara-600" /> Sem juridiquês</span>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="pb-16 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Como funciona</h2>
          <p className="text-center text-muted-foreground mt-2 mb-8">Do relato ao protocolo em 3 passos.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {PASSOS.map((c) => (
              <Card key={c.t}><CardHeader><CardTitle className="flex items-center gap-2">{c.icon}{c.t}</CardTitle></CardHeader>
              <CardContent><CardDescription className="text-base">{c.d}</CardDescription></CardContent></Card>
            ))}
          </div>
        </section>

        {/* POR QUE A CLARA */}
        <section className="pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Por que a Clara?</h2>
          <p className="text-center text-muted-foreground mt-2 mb-8">O caminho tradicional é caro, lento e confuso. A Clara é o atalho.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {DIFERENCIAIS.map((d) => (
              <Card key={d.t}>
                <CardContent className="p-5 flex gap-3">
                  <span className="grid place-items-center w-8 h-8 rounded-full bg-clara-50 shrink-0"><Check size={18} className="text-clara-600" /></span>
                  <div><p className="font-semibold">{d.t}</p><p className="text-sm text-muted-foreground mt-1">{d.d}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PARA QUEM */}
        <section id="para-quem" className="pb-16 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Para quem é a Clara?</h2>
          <p className="text-center text-muted-foreground mt-2 mb-8">Se você vive uma destas situações, comece pela triagem gratuita.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERSONAS.map((p) => (
              <Card key={p.t}><CardHeader><CardTitle className="flex items-center gap-2 text-base">{p.icon}{p.t}</CardTitle></CardHeader>
              <CardContent><CardDescription>{p.d}</CardDescription></CardContent></Card>
            ))}
          </div>
          <div className="text-center mt-8"><Link href="/triagem"><Button size="lg">Descobrir meu caso</Button></Link></div>
        </section>

        {/* PLANOS */}
        <section id="planos" className="pb-16 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Planos</h2>
          <p className="text-center text-muted-foreground mt-2 mb-8">Comece grátis. Evolua só se precisar.</p>
          <div className="grid md:grid-cols-3 gap-4 items-stretch">
            {PLANOS.map((p) => (
              <Card key={p.id} className={p.destaque ? 'border-clara-600 border-2 relative' : ''}>
                {p.destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-clara-600 text-white text-xs font-semibold px-3 py-1">{p.destaque}</span>
                )}
                <CardHeader>
                  <CardTitle>{PLANO_LABELS[p.id].label}</CardTitle>
                  <p className="text-3xl font-extrabold mt-1">{p.preco}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    {PLANO_LABELS[p.id].features.map((f) => (
                      <li key={f} className="flex items-start gap-2"><Check size={16} className="text-clara-600 shrink-0 mt-0.5" />{f}</li>
                    ))}
                  </ul>
                  <Link href={p.id === 'gratuito' ? '/triagem' : '/cadastro'}>
                    <Button className="w-full" variant={p.destaque ? 'default' : 'outline'}>
                      {p.id === 'gratuito' ? 'Começar grátis' : `Assinar ${PLANO_LABELS[p.id].label}`}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section className="pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Quem já usou</h2>
          <p className="text-center text-muted-foreground mt-2 mb-8">Histórias de quem transformou medo em protocolo.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {DEPOIMENTOS.map((d) => (
              <Card key={d.nome}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-sm">“{d.texto}”</p>
                  <p className="text-xs text-muted-foreground"><b>{d.nome}</b> • {d.caso}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="pb-16 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Dúvidas frequentes</h2>
          <p className="text-center text-muted-foreground mt-2 mb-8">As respostas diretas que você precisa antes de começar.</p>
          <div className="mx-auto max-w-3xl space-y-2">
            {FAQ.map((f, i) => (
              <Card key={f.q}>
                <button
                  className="w-full flex items-center justify-between gap-3 p-4 text-left font-semibold"
                  onClick={() => setFaqAberto(faqAberto === i ? null : i)}
                  aria-expanded={faqAberto === i}
                >
                  {f.q}
                  <ChevronDown size={18} className={`shrink-0 transition-transform ${faqAberto === i ? 'rotate-180' : ''}`} />
                </button>
                {faqAberto === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>}
              </Card>
            ))}
          </div>
        </section>

        {/* RECURSOS */}
        <section className="pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Recursos gratuitos</h2>
          <p className="text-center text-muted-foreground mt-2 mb-8">Comece por aqui, sem conta e sem custo.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {RECURSOS.map((r) => (
              <Link key={r.t} href={r.href}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="text-clara-600" />{r.t}</CardTitle></CardHeader>
                  <CardContent><CardDescription>{r.d}</CardDescription></CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* EM RISCO */}
        <section className="pb-16">
          <Card className="bg-clara-900 text-white border-0">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Em risco agora?</h2>
                <p className="mt-2 text-white/80">Ligue <b>180</b> (Central da Mulher) ou <b>190</b> (emergência). A Clara ajuda com o plano de saída e a medida protetiva depois.</p>
              </div>
              <Link href="/triagem?urgente=1" className="shrink-0"><Button size="lg" variant="secondary"><Clock size={18} /> Pedir medida protetiva</Button></Link>
            </CardContent>
          </Card>
        </section>

        {/* CTA FINAL */}
        <section className="pb-20 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">Pronta para clarear <span className="text-clara-600">seus direitos</span>?</h2>
          <p className="mt-3 text-muted-foreground">A triagem é gratuita e leva poucos minutos.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/triagem"><Button size="lg">Fazer triagem gratuita</Button></Link>
            {WA_LINK && (
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline"><MessageCircle size={18} /> Falar no WhatsApp</Button>
              </a>
            )}
          </div>
          <p className="mt-6 text-xs text-muted-foreground max-w-3xl mx-auto">
            Aviso legal: a Clara gera documentos-base para levar à Defensoria Pública ou advogada. Não substitui orientação jurídica individual nem atendimento emergencial.
          </p>
        </section>
      </main>

      <footer className="border-t py-10">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-4 text-sm">
          <div>
            <p className="flex items-center gap-2 font-bold text-base"><span className="grid place-items-center w-7 h-7 rounded-lg bg-clara-600 text-white"><Scale size={16} /></span>Clara</p>
            <p className="mt-2 text-muted-foreground">Seus direitos, claros. Navegadora de direitos da mulher.</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Produto</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link href="/triagem" className="hover:text-clara-700">Triagem gratuita</Link></li>
              <li><a href="#planos" className="hover:text-clara-700">Planos</a></li>
              <li><Link href="/checklist" className="hover:text-clara-700">Checklist e Defensoria</Link></li>
              <li><Link href="/blog" className="hover:text-clara-700">Blog</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Conta</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link href="/login" className="hover:text-clara-700">Entrar</Link></li>
              <li><Link href="/cadastro" className="hover:text-clara-700">Criar conta</Link></li>
              <li><Link href="/dashboard" className="hover:text-clara-700">Meus casos</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Ajuda</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><a href="#faq" className="hover:text-clara-700">Dúvidas frequentes</a></li>
              {WA_LINK && <li><a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-clara-700">WhatsApp</a></li>}
              <li><Link href="/sobre" className="hover:text-clara-700">Sobre</Link></li>
              <li><Link href="/contato" className="hover:text-clara-700">Contato</Link></li>
              <li><Link href="/privacidade" className="hover:text-clara-700">Privacidade (LGPD)</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">Clara © 2026 • Feito para mulheres • <Link href="/privacidade" className="underline hover:text-clara-700">Privacidade (LGPD)</Link> • <Link href="/termos-de-uso" className="underline hover:text-clara-700">Termos de Uso</Link></p>
      </footer>

      {/* WhatsApp flutuante — só aparece quando o número oficial está configurado */}
      {WA_LINK && (
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed bottom-5 right-5 z-20 grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
        >
          <MessageCircle size={26} />
        </a>
      )}
    </div>
  )
}
