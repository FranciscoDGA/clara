import { Baby, ShieldAlert, Briefcase, CreditCard, Scale } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Post } from '@/lib/blog/types'

// Capa própria por categoria (SVG/CSS, sem fotos externas):
// visual profissional sem risco de licença/atribuição.
const ESTILOS: Record<Post['categoria'], { grad: string; Icon: typeof Scale }> = {
  'Família': { grad: 'from-rose-500 via-pink-500 to-clara-600', Icon: Baby },
  'Violência': { grad: 'from-red-700 via-rose-700 to-clara-900', Icon: ShieldAlert },
  'Trabalho': { grad: 'from-indigo-600 via-violet-600 to-clara-700', Icon: Briefcase },
  'Consumidor': { grad: 'from-amber-500 via-orange-500 to-rose-500', Icon: CreditCard },
  'Direitos': { grad: 'from-emerald-600 via-teal-600 to-clara-700', Icon: Scale },
}

// Variante determinística por post (hash do slug): mesma identidade por
// categoria, mas cada post ganha combinação própria de direção/brilho.
function varianteDe(semente = ''): number {
  let h = 0
  for (let i = 0; i < semente.length; i++) h = (h * 31 + semente.charCodeAt(i)) >>> 0
  return h % 3
}

const DIRECOES = ['bg-gradient-to-br', 'bg-gradient-to-tr', 'bg-gradient-to-bl']

export function CapaPost({
  categoria,
  className,
  iconSize = 56,
  semente = '',
  rotulo = false,
}: {
  categoria: Post['categoria']
  className?: string
  iconSize?: number
  semente?: string
  rotulo?: boolean
}) {
  const { grad, Icon } = ESTILOS[categoria]
  const v = varianteDe(semente || categoria)
  return (
    <div
      className={cn('relative overflow-hidden', DIRECOES[v], grad, className)}
      role="img"
      aria-label={`Ilustração: ${categoria}`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            v === 1
              ? 'radial-gradient(circle at 20% 15%, white 0, transparent 35%), radial-gradient(circle at 85% 90%, white 0, transparent 30%)'
              : 'radial-gradient(circle at 80% 20%, white 0, transparent 35%), radial-gradient(circle at 15% 85%, white 0, transparent 30%)',
        }}
      />
      {v !== 2 ? (
        <>
          <div className="absolute -right-6 -bottom-8 rounded-full border-[10px] border-white/15 w-40 h-40" />
          <div className="absolute -left-4 -top-6 rounded-full border-[6px] border-white/10 w-24 h-24" />
        </>
      ) : (
        <>
          <div className="absolute -left-8 -bottom-10 rotate-12 rounded-2xl border-[10px] border-white/15 w-44 h-28" />
          <div className="absolute -right-5 -top-8 -rotate-12 rounded-2xl border-[6px] border-white/10 w-28 h-20" />
        </>
      )}
      <div className="relative h-full grid place-items-center p-6">
        <span className={cn('grid place-items-center bg-white/20 backdrop-blur-sm p-4', v === 2 ? 'rounded-full' : 'rounded-2xl')}>
          <Icon size={iconSize} className="text-white" />
        </span>
      </div>
      {rotulo && (
        <span className="absolute bottom-3 left-4 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white">
          {categoria}
        </span>
      )}
    </div>
  )
}
