import toPayIcon from '@/assets/icons/toPay-icon.svg'

export default function FaconnierOutstandingCard({ outstanding }: { outstanding: number }) {
  return (
    <div className="flex items-center gap-4 bg-foreground rounded-xl p-5 shadow-sm border min-h-24">
      <div className="p-3 bg-secondary rounded-full">
        <img src={toPayIcon} alt="cash" className="w-6 h-6" />
      </div>
      <div className="flex flex-col gap-0">
        <h3 className="text-lg font-semibold">À payer aux façonniers</h3>
        <p className="text-3xl font-bold tracking-tight font-bagel">
          {outstanding.toLocaleString('fr-MA')} <span className="text-base font-medium">DH</span>
        </p>
        {/* <p className="text-xs text-background/50">Amount to pay • {seasonName}</p> */}
      </div>
    </div>
  )
}
