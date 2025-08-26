import { ScrollText } from 'lucide-react'

export function OpenBonsCard({
  openBon,
  text,
  description
}: {
  openBon: number
  text: string
  description: string
}) {
  return (
    <div className="group relative flex items-center gap-4 bg-foreground rounded-xl p-5 shadow-sm border min-h-24">
      <div className="p-3 bg-secondary rounded-full">
        <ScrollText className="w-6 h-6 text-white" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-0">
        <h3 className="text-lg font-semibold">{text}</h3>
        <p className="text-3xl font-bold tracking-tight font-bagel">
          {openBon} <span className="text-base font-medium">bons</span>
        </p>
        {/* <p className="text-xs text-background/50">Bons Faconniers en cours • {seasonName}</p> */}
      </div>

      {/* Tooltip */}
      <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap">
        {description}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
}
