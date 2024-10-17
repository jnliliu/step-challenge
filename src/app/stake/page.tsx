// type StakeMode = "stake" | "unstake"

export default function Stake() {
  return (
    <div>
        <div className="font-bold mb-6">
          Stake page
        </div>
        
        <div className="flex gap-2 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Unstake
          </button>

          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/"
          >
            Back to home
          </a>
        </div>
    </div>
  );
}
