'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea, Label, Badge } from '@/components/ui/inputs'
import { TIPO_CASO_LABELS, URGENCIA_LABELS } from '@/lib/constants'
import type { TriagemResult } from '@/lib/types'

// Web Speech API (Chrome/Edge): transcrição gratuita no navegador, sem servidor.
// Tipos mínimos porque o lib.dom do TS não inclui webkitSpeechRecognition.
interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string; isFinal: boolean }>> }) => void) | null
  onend: (() => void) | null
  onerror: ((ev: { error: string }) => void) | null
  start: () => void
  stop: () => void
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
}

export default function TriagemPage() {
  const router = useRouter()
  const [relato, setRelato] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<TriagemResult | null>(null)
  const [erro, setErro] = useState('')
  const [gravando, setGravando] = useState(false)
  const recogRef = useRef<SpeechRecognitionLike | null>(null)
  const baseRef = useRef('')

  function alternarGravacao() {
    if (gravando) {
      recogRef.current?.stop()
      return
    }
    const Ctor = typeof window !== 'undefined'
      ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
      : undefined
    if (!Ctor) {
      setErro('Seu navegador não suporta ditado por voz. Use o Chrome ou digite sua história.')
      return
    }
    setErro('')
    baseRef.current = relato ? relato.replace(/\s+$/, '') + ' ' : ''
    const recog = new Ctor()
    recog.lang = 'pt-BR'
    recog.interimResults = false
    recog.continuous = true
    recog.onresult = (ev) => {
      let final = ''
      for (let i = 0; i < ev.results.length; i++) {
        const alt = ev.results[i][0]
        if (alt?.isFinal) final += alt.transcript + ' '
      }
      if (final) setRelato(baseRef.current + final.trim())
    }
    recog.onerror = (ev) => {
      if (ev.error === 'not-allowed') setErro('Permita o microfone no navegador para ditar.')
      else if (ev.error !== 'aborted') setErro('Falha no ditado. Tente de novo ou digite.')
      setGravando(false)
    }
    recog.onend = () => setGravando(false)
    recogRef.current = recog
    try {
      recog.start()
      setGravando(true)
    } catch {
      setErro('Não foi possível iniciar o microfone.')
    }
  }

  async function analisar() {
    if (relato.trim().length < 20) { setErro('Conte um pouco mais (mín. 20 caracteres).'); return }
    setErro(''); setLoading(true); setResultado(null)
    try {
      const res = await fetch('/api/triagem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relato }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Falha na triagem')
      setResultado(data)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado')
    } finally { setLoading(false) }
  }

  async function salvarCaso() {
    if (!resultado) return
    setLoading(true)
    try {
      const res = await fetch('/api/casos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relato, triagem: resultado }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Faça login para salvar o caso')
      router.push(`/casos/${data.id}`)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao salvar')
      setLoading(false)
    }
  }

  const urg = resultado ? URGENCIA_LABELS[resultado.urgencia] : null

  return (
    <div className="min-h-screen bg-clara-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Triagem gratuita</CardTitle>
            <CardDescription>Descreva com suas palavras. Ex: “Me separei há 3 meses, ele não paga pensão dos 2 filhos, tenho medo de ficar sem nada”.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="relato">Sua história</Label>
              <Textarea id="relato" value={relato} onChange={(e) => setRelato(e.target.value)} placeholder="Digite ou dite com o microfone: o que aconteceu? Quando? Há filhos? Há risco?" rows={6} />
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
            <div className="flex flex-wrap gap-2">
              <Button onClick={analisar} disabled={loading || gravando}>{loading ? 'Analisando...' : 'Analisar meu caso'}</Button>
              <Button
                variant={gravando ? 'destructive' : 'outline'}
                onClick={alternarGravacao}
                disabled={loading}
              >
                {gravando ? (<><Square size={16} /> Parar</>) : (<><Mic size={16} /> Ditar por voz</>)}
              </Button>
              <Button variant="outline" onClick={() => { recogRef.current?.stop(); setRelato(''); setResultado(null) }}>Limpar</Button>
            </div>
            {gravando && <p className="text-sm text-clara-600 animate-pulse">🎤 Ouvindo... fale normalmente e clique em Parar.</p>}
          </CardContent>
        </Card>

        {resultado && (
          <Card className="animate-in">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{TIPO_CASO_LABELS[resultado.tipo_caso] ?? resultado.tipo_caso}</CardTitle>
                {urg && <Badge className={urg.color}>{urg.icon} {urg.label}</Badge>}
                <Badge>Confiança {Math.round(resultado.confianca * 100)}%</Badge>
              </div>
              <CardDescription>Categoria: {resultado.categoria}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <h3 className="font-semibold mb-2">Passo a passo</h3>
                <ol className="list-decimal ml-5 space-y-1.5 text-sm">
                  {resultado.proximos_passos.map((p) => <li key={p}>{p}</li>)}
                </ol>
              </div>
              {resultado.documentos_sugeridos.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Documentos que a Clara gera</h3>
                  <div className="flex flex-wrap gap-2">
                    {resultado.documentos_sugeridos.map((d) => <Badge key={d} className="bg-clara-50 text-clara-700 border-clara-200">📄 {d}</Badge>)}
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={salvarCaso} disabled={loading}>Salvar caso e gerar documentos</Button>
                <Link href="/checklist"><Button variant="outline">Ver checklist e endereços</Button></Link>
                <p className="text-xs text-muted-foreground self-center">Precisa de login — leva 30 segundos.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
