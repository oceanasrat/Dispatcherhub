import React from "react"
import { PenTool, Ruler, Hammer, Truck } from "lucide-react"

const steps = [
  { icon: PenTool,  title: "Consult", desc: "Free consult to understand your space, style and needs." },
  { icon: Ruler,    title: "Design",  desc: "Mozaik 3D drawings and material selection." },
  { icon: Hammer,   title: "Build",   desc: "Hand-built in our Texas shop with premium joinery." },
  { icon: Truck,    title: "Install", desc: "Clean install, fit & finish, 2-year workmanship warranty." },
]

export default function Timeline(){
  return (
    <div className="relative">
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border" />
      <div className="grid md:grid-cols-2 gap-6">
        {steps.map((s, i)=>(
          <div key={i} className={`flex ${i%2 ? 'md:justify-start' : 'md:justify-end'}`}>
            <div className="card p-4 max-w-md w-full">
              <div className="flex items-center gap-2 text-brand font-semibold">
                <s.icon className="w-5 h-5" /> {s.title}
              </div>
              <p className="subtle mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
