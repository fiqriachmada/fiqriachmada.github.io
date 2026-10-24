import clsx from "clsx";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="border dark:bg-white border-blue-300 shadow rounded-md p-4">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full dark:bg-white bg-slate-700 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-700 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 18 }).map((_, index) => (
                <div
                  key={index}
                  className={clsx(
                    "h-2 bg-slate-700 rounded",
                    `col-span-${index % 2 === 0 ? 2 : 1}`
                  )}></div>
              ))}
            </div>
            <div className="h-2 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
