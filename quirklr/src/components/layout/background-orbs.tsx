"use client";

export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary Moss Orb */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-moss/10 blur-[120px] animate-orb-slow" />

      {/* Secondary Emerald Orb */}
      <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[100px] animate-orb-delayed" />

      {/* Subtle Slate Depth */}
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-slate-200/20 blur-[80px] animate-orb-float" />

      {/* Mesh Grid Overlay (Optional - adds a technical look) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
