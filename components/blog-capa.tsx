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

export function CapaPost({
  categoria,
  className,
  iconSize = 56,
}: {
  categoria: Post['categoria']
  className?: string
  iconSize?: number
}) {
  const { grad, Icon } = ESTILOS[categoria]
  return (
    <div
      className={cn('relative overflow-hidden bg-gradient-to-br', grad, className)}
      role="img"
      aria-label={`Ilustração: ${categoria}`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, white 0, transparent 35%), radial-gradient(circle at 15% 85%, white 0, transparent 30%)',
        }}
      />
      <div className="absolute -right-6 -bottom-8 rounded-full border-[10px] border-white/15 w-40 h-40" />
      <div className="absolute -left-4 -top-6 rounded-full border-[6px] border-white/10 w-24 h-24" />
      <div className="relative h-full grid place-items-center p-6">
        <span className="grid place-items-center rounded-2xl bg-white/20 backdrop-blur-sm p-4">
          <Icon size={iconSize} className="text-white" />
        </span>
      </div>
    </div>
  )
}
