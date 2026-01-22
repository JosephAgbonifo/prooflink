"use client";

import React from "react";
import { QRCode } from "react-qrcode-logo";

interface CustomQRCodeProps {
  value: string;
  size?: number;
  logoImage?: string;
}

export const BrandQRCode: React.FC<CustomQRCodeProps> = ({
  value,
  size = 280, // Slightly larger for better dot density
  logoImage = "/logo.png",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 w-fit">
      <div className="relative p-2 bg-white rounded-3xl">
        <QRCode
          value={value}
          size={size}
          logoImage={logoImage}
          // CRITICAL: High Error Correction is required when using a logo
          ecLevel="H"
          logoWidth={size * 0.22} // Slightly smaller logo improves readability
          logoHeight={size * 0.22}
          logoPadding={5} // Adds a white buffer around the logo
          logoPaddingStyle="circle"
          qrStyle="dots"
          // Eye radius should not be too extreme or scanners won't find the anchor
          eyeRadius={[12, 12, 12, 12]}
          quietZone={20} // Larger quiet zone helps cameras focus
          fgColor="#0F172A"
          bgColor="#FFFFFF"
          removeQrCodeBehindLogo={true}
        />
      </div>

      <div className="mt-4 text-center max-w-[200px] noprint">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Secure QR Identity
        </p>
        <p className="text-[10px] font-mono text-moss font-bold mt-1 break-all opacity-60">
          {value}
        </p>
      </div>
    </div>
  );
};
