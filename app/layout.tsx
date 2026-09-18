import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'Clara — Seus Direitos, Claros',
  description: 'Navegadora de direitos da mulher. Divórcio, pensão, guarda, medida protetiva — documentos jurídicos em minutos, sem advogado.',
  keywords: ['direitos da mulher', 'divórcio', 'pensão alimentícia', 'guarda', 'medida protetiva', 'jurídico'],
  authors: [{ name: 'Clara Direitos da Mulher' }],
  openGraph: {
    title: 'Clara — Seus Direitos, Claros',
    description: 'Documentos jurídicos personalizados para mulheres em minutos. WhatsApp, gratuito, seguro.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}