import React, { useRef, useState } from "react"
import { ZoomIn, ZoomOut } from "lucide-react"

type Props = { title?: string; images: string[] }

export default function ZoomGallery({ title, images }: Props) {
  const [i, setI] = useState(0)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const drag = useRef<{x:number;y:number}|null>(null)
  const clamp = (n:number,min:number,max:number)=>Math.max(min,Math.min(max,n))

  function onWheel(e: React.WheelEvent<HTMLDivElement>) {
    e.preventDefault()
    setScale(s => clamp(s + (e.deltaY > 0 ? -0.15 : 0.15), 1, 3))
  }
  function start(e: React.MouseEvent | React.TouchEvent) {
    const p = "touches" in e ? e.touches[0] : (e as React.MouseEvent)
    drag.current = { x: p.clientX - pos.x, y: p.clientY - pos.y }
  }
  function move(e: React.MouseEvent | React.TouchEvent) {
    if (!drag.current) return
    const p = "touches" in e ? e.touches[0] : (e as React.MouseEvent)
    setPos({ x: p.clientX - drag.current.x, y: p.clientY - drag.current.y })
  }
  function end(){ drag.current = null }

  return (
    <div className="space-y-3">
      {title && <div className="text-lg font-semibold">{title}</div>}

      <div
        className="relative rounded-2xl border border-border bg-black/5 overflow-hidden h-[52vh] md:h-[60vh] grid place-items-center"
        onWheel={onWheel}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      >
        <img
          src={images[i] ?? ""}
          alt=""
          className="select-none pointer-events-none"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                   transition: drag.current ? "none" : "transform .15s ease" }}
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button className="btn-outline rounded-xl bg-surface" onClick={()=>setScale(s=>clamp(s-0.25,1,3))}><ZoomOut className="w-4 h-4"/></button>
          <button className="btn-outline rounded-xl bg-surface" onClick={()=>setScale(s=>clamp(s+0.25,1,3))}><ZoomIn className="w-4 h-4"/></button>
          <button className="btn-outline rounded-xl bg-surface" onClick={()=>{setScale(1);setPos({x:0,y:0})}}>Reset</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {images.map((src, idx)=>(
          <button key={idx}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${i===idx?'border-primary':'border-border'}`}
            onClick={()=>{setI(idx); setScale(1); setPos({x:0,y:0})}}>
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <p className="subtle text-xs">Tip: pinch or drag to pan; use +/- to zoom.</p>
    </div>
  )
}
