'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import defensoriaData from '@/lib/data/defensoria.json'

type UF = keyof typeof defensoriaData

const CHECKLIST = [
  'Reúna RG, CPF e comprovante de residência (originais + cópias).',
  'Junte as provas: prints, fotos, áudios, testemunhas, BO se houver.',
  'Leve os documentos gerados pela Clara impressos ou em PDF.',
  'Vá à Defensoria Pública ou Vara de Família no horário de atendimento.',
  'Protocole e anote o número do processo + próxima data.',
]

export default function ChecklistPage() {
  const [estado, setEstado] = useState<UF>('SP')
  const dados = defensoriaData[estado]

  return (
    <div className="min-h-screen bg-clara-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="bg-clara-900 text-white border-0">
          <CardContent className="p-6">
            <p className="font-bold">Em risco agora? Ligue 180 (Central da Mulher) ou 190 (emergência).</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist para protocolar</CardTitle>
            <CardDescription>O passo a passo para levar seus documentos à Defensoria.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal ml-5 space-y-1.5 text-sm">
              {CHECKLIST.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereços da Defensoria</CardTitle>
            <CardDescription>Escolha seu estado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {(Object.keys(defensoriaData) as UF[]).map((uf) => (
                <Button key={uf} variant={uf === estado ? 'default' : 'outline'} onClick={() => setEstado(uf)}>
                  {uf}
                </Button>
              ))}
            </div>
            <div>
              <h3 className="font-semibold mb-1">Endereços em {estado}</h3>
              <ul className="list-disc ml-5 text-sm space-y-1">
                {dados.enderecos.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm">Telefones: {dados.telefones.join(', ')}</p>
              <p className="text-sm text-muted-foreground">{dados.horarios}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Confirme o endereço da sua comarca no site da Defensoria do seu estado antes de ir.
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Link href="/triagem">
            <Button variant="outline">Fazer triagem</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Meus casos</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
