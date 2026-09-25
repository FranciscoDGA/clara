import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Contato | Clara',
  description: 'Fale com a equipe da Clara: suporte, dúvidas e parcerias.',
}

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-clara-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">Contato</h1>
        <Card>
          <CardHeader><CardTitle>Suporte e dúvidas</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-neutral-800 leading-relaxed">
            <p><strong>E-mail:</strong> oi@clara.direito.br</p>
            <p>
              <strong>WhatsApp:</strong> +{WHATSAPP} — para dúvidas sobre a plataforma.
              Em situação de risco, ligue <strong>180</strong> ou <strong>190</strong> (a Clara não é canal de emergência).
            </p>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">
              <Button>Chamar no WhatsApp</Button>
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Parcerias</CardTitle></CardHeader>
          <CardContent>
            <p className="text-neutral-800 leading-relaxed">
              Defensorias, ONGs, coletivos e advogadas parceiras: escreva para oi@clara.direito.br
              com o assunto “Parceria”.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
