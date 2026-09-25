import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Política de Privacidade | Clara',
  description: 'Como a Clara coleta, usa e protege seus dados pessoais (LGPD).',
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-clara-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground text-center">Última atualização: setembro de 2026</p>
        {[
          { t: '1. Quais dados coletamos', d: 'Conta: nome, e-mail e senha (armazenada com hash). Casos: relato, tipo de caso e documentos gerados — apenas quando você salva um caso logada. Navegação: dados anônimos de uso para melhorar o serviço.' },
          { t: '2. Para que usamos', d: 'Prestar o serviço (triagem, documentos, acompanhamento de casos), cumprir obrigações legais e melhorar a plataforma. Nunca vendemos seus dados.' },
          { t: '3. Isolamento por usuária', d: 'Cada conta acessa apenas os próprios casos e documentos, com controle de acesso por login e políticas de segurança no banco de dados.' },
          { t: '4. Compartilhamento', d: 'Compartilhamos dados apenas com provedores de infraestrutura necessários à operação (hospedagem e banco de dados) e quando exigido por lei.' },
          { t: '5. Seus direitos (LGPD)', d: 'Você pode pedir confirmação, acesso, correção, anonimização ou eliminação dos seus dados pelo e-mail oi@clara.direito.br.' },
          { t: '6. Segurança', d: 'Usamos conexões criptografadas (HTTPS), senhas com hash e controle de acesso. Nenhum sistema é 100% imune a incidentes; em caso de vazamento relevante, avisaremos as afetadas e a ANPD.' },
          { t: '7. Contato', d: 'Dúvidas sobre privacidade: oi@clara.direito.br.' },
        ].map((s) => (
          <Card key={s.t}>
            <CardHeader><CardTitle className="text-lg">{s.t}</CardTitle></CardHeader>
            <CardContent><p className="text-neutral-800 leading-relaxed">{s.d}</p></CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
