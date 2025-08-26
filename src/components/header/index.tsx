import DropDownSeasons from './dropDownSeasons'

export default function Header() {
  return (
    <div className="flex w-full h-[80px] px-5">
      <div className="w-full h-full flex gap-5 items-center justify-end">
        {/* <div className="min-w-[400px] relative">
          <div className="absolute left-2 top-[50%] translate-y-[-50%]">
            <SearchIcon className="text-background/50" />
          </div>
          <Input
            className="w-full placeholder:text-background/35 text-base md:text-base py-5 bg-foreground text-background  border-background/35 rounded-lg pl-9"
            placeholder="Search Anything"
          />
        </div> */}

        <DropDownSeasons />
      </div>
    </div>
  )
}
