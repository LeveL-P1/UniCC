import { Zap, Activity, Database, CheckCircle2 } from 'lucide-react'

export function SystemStatusWidget() {
    return (
        <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-wider bg-card/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>System Online</span>
            </div>
            <div className="h-3 w-px bg-border"></div>
            <div className="flex items-center gap-1.5">
                <Database size={10} />
                <span>DB: Connected</span>
            </div>
            <div className="h-3 w-px bg-border"></div>
            <div className="flex items-center gap-1.5">
                <Activity size={10} />
                <span>v2.4.0</span>
            </div>
        </div>
    )
}

export function MiniGoalWidget({ current, target }: { current: number, target: number }) {
    const percentage = Math.min((current / target) * 100, 100)

    return (
        <div className="flex flex-col gap-1 min-w-[140px]">
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <span>Weekly Target</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

export function QuickTipWidget() {
    return (
        <div className="hidden xl:flex items-center gap-2 text-xs text-muted-foreground bg-accent/20 px-3 py-1.5 rounded border border-border/50">
            <Zap size={12} className="text-primary" />
            <span className="font-mono">TIP: Press <kbd className="bg-background px-1 rounded border border-border text-[10px]">⌘K</kbd> for command palette</span>
        </div>
    )
}
