export function Skeleton({
    className = '',
    style
}: {
    className?: string
    style?: React.CSSProperties
}) {
    return (
        <div
            className={`animate-pulse bg-[#242424] rounded ${className}`}
            style={style}
        />
    )
}
export function KPICardSkeleton() {
    return (
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
        </div>
    )
}

export function ChartSkeleton() {
    return (
        <div className="h-64 flex flex-col justify-end gap-2 px-4">
            {[60, 80, 45, 90, 70, 55, 85].map((height, i) => (
                <div key={i} className="flex items-end gap-2">
                    <Skeleton className="flex-1" style={{ height: `${height}%` }} />
                </div>
            ))}
        </div>
    )
}

export function TableRowSkeleton() {
    return (
        <tr className="border-b border-[#2a2a2a]">
            <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
            <td className="py-4 px-4"><Skeleton className="h-6 w-20" /></td>
            <td className="py-4 px-4"><Skeleton className="h-4 w-8 mx-auto" /></td>
            <td className="py-4 px-4"><Skeleton className="h-4 w-8 mx-auto" /></td>
            <td className="py-4 px-4"><Skeleton className="h-4 w-8 mx-auto" /></td>
            <td className="py-4 px-4"><Skeleton className="h-4 w-8 mx-auto" /></td>
            <td className="py-4 px-4"><Skeleton className="h-4 w-12 mx-auto" /></td>
            <td className="py-4 px-4">
                <div className="flex gap-2 justify-end">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </td>
        </tr>
    )
}