export default function Home() {
  return (
    <div>
        <div className="font-bold mb-6">
          Step challenge - João Liliu
        </div>

        <div className="flex items-center flex-col sm:flex-row w-full">
          <a
            className="flex-1 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/stake"
          >
            Stake
          </a>
        </div>
    </div>
  );
}
