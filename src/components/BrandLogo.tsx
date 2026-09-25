import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BRAND_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1W3EkQTYooz19GjaaLsyuAE93Mg-FZwzwWhIsn882A_x52bvU2LR0LZuLoVwIqum-Xfh3rfwktu14ijPdGLBUpPmQUJIbmCkEFSOt6jEvimVINuR2vwz4mAzENh81S7WxPK8680OYPBmYNnv-zL_3kvy1WCPOpYFaS8EvXJ4P4q9C9bFN9d1TBGfNgZfxxwwF-tgci9qpm-TCqjdc1FDe7RX8ypZadMcT82buwRToR1Fm5KJxOuk88GkFY';

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = 'h-8 w-auto', size = 'md' }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-[#0e4b46] text-[#89f5e7] p-1.5 shadow-sm ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={BRAND_LOGO_URL}
      alt="Sim⁴ Med Ed Logo"
      className={`${className} object-contain transition-transform group-hover:scale-105`}
      onError={() => setImageError(true)}
      referrerPolicy="no-referrer"
    />
  );
};
