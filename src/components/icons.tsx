
import React from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

export const PlayerIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Player character'}>
    {title && <title>{title}</title>}
    <path d="M12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C8.69 13 6 15.69 6 19V20H18V19C18 15.69 15.31 13 12 13Z"/>
    <path d="M12.5 7.5H11.5V8.5H10.5V9.5H11.5V10.5H12.5V9.5H13.5V8.5H12.5V7.5Z" fill="#FF80AB"/> {/* Tiny heart detail */}
  </svg>
);

export const LostWhisperIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Lost Whisper icon'}>
    {title && <title>{title}</title>}
    <path d="M12 2C7.58 2 4 5.58 4 10C4 12.76 5.37 15.17 7.28 16.73L7 22H17L16.72 16.73C18.63 15.17 20 12.76 20 10C20 5.58 16.42 2 12 2ZM9.5 11C8.67 11 8 10.33 8 9.5C8 8.67 8.67 8 9.5 8C10.33 8 11 8.67 11 9.5C11 10.33 10.33 11 9.5 11ZM14.5 11C13.67 11 13 10.33 13 9.5C13 8.67 13.67 8 14.5 8C15.33 8 16 8.67 16 9.5C16 10.33 15.33 11 14.5 11Z" opacity="0.8"/>
    <circle cx="9.5" cy="9.5" r="1.5" fill="#333"/> 
    <circle cx="14.5" cy="9.5" r="1.5" fill="#333"/> 
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Heart icon'}>
    {title && <title>{title}</title>}
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
  </svg>
);

export const GiftBoxIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Gift Box icon'}>
    {title && <title>{title}</title>}
    <path d="M20 6H4C2.89543 6 2 6.89543 2 8V10H22V8C22 6.89543 21.1046 6 20 6Z" />
    <path d="M2 12V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V12H2Z" />
    <path d="M12 2C10.34 2 9 3.34 9 5L11 7L12 6L13 7L15 5C15 3.34 13.66 2 12 2Z" fill="#FF80AB"/>
    <rect x="11" y="6" width="2" height="14" fill="#FF80AB" opacity="0.7"/>
  </svg>
);

export const NextDreamPortalIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Next Dream Portal icon'}>
    {title && <title>{title}</title>}
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" opacity="0.3"/>
    <path d="M12 6C9.17 6 6.89 7.67 5.91 10H8.09C8.73 8.81 10.27 8 12 8C13.73 8 15.27 8.81 15.91 10H18.09C17.11 7.67 14.83 6 12 6Z" />
    <path d="M12 18C14.83 18 17.11 16.33 18.09 14H15.91C15.27 15.19 13.73 16 12 16C10.27 16 8.73 15.19 8.09 14H5.91C6.89 16.33 9.17 18 12 18Z" />
    <path d="M10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10C10.9 10 10 10.9 10 12Z" fill="#FFF59D"/> 
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className, style, title }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Shield icon'}>
        {title && <title>{title}</title>}
        <path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2Z" />
        <path d="M12 11.5L10.78 10.52C8.79 8.87 7 7.55 7 6C7 4.9 7.9 4 9 4C9.83 4 10.58 4.45 11.03 5.09L12 6.25L12.97 5.09C13.42 4.45 14.17 4 15 4C16.1 4 17 4.9 17 6C17 7.55 15.21 8.87 13.22 10.52L12 11.5Z" fill="#FFC0CB" />
    </svg>
);

export const FlowerPuddleIcon: React.FC<IconProps> = ({ className, style, title }) => (
    <svg className={className} style={style} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Flower Puddle icon'}>
        {title && <title>{title}</title>}
        <path d="M50 20 C 25 25, 15 40, 20 60 S 25 85, 50 90 C 75 85, 85 70, 80 50 S 75 35, 50 20 Z" fill="#D1C4E9" opacity="0.6"/>
        <circle cx="50" cy="45" r="10" fill="#FF80AB"/>
        <circle cx="42" cy="42" r="4" fill="#FFF176"/>
        <circle cx="65" cy="65" r="8" fill="#FFF176"/>
        <circle cx="63" cy="63" r="3" fill="#FFB74D"/>
        <path d="M35 60 Q 40 50 45 60 Q 40 70 35 60 Z" fill="#A5D6A7"/>
         <path d="M70 40 Q 65 30 60 40 Q 65 50 70 40 Z" fill="#A5D6A7"/>
    </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Portal Key icon'}>
    {title && <title>{title}</title>}
    <path d="M16.707 3.293A1 1 0 0015.293 4.707L13 7V3a1 1 0 00-2 0v4l-2.293-2.293a1 1 0 00-1.414 1.414L9.586 8.414A5.002 5.002 0 006 13c0 2.761 2.239 5 5 5s5-2.239 5-5a5.001 5.001 0 00-1.086-3H18a1 1 0 001-1V7a1 1 0 00-1-1h-1.293l3-3a1 1 0 00-1.414-1.414L16.707 3.293zM11 16c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3z" />
    <path d="M11 12.5a.5.5 0 00-1 0V14a.5.5 0 001 0v-1.5z" fill="#FFC0CB"/>
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 10 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    {title && <title>{title}</title>}
    <path d="M5 0L6.12257 3.87743L10 5L6.12257 6.12257L5 10L3.87743 6.12257L0 5L3.87743 3.87743L5 0Z" />
  </svg>
);

export const AuraIncreaseIcon: React.FC<IconProps> = ({ className, style, title }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Aura Increase'}>
      {title && <title>{title}</title>}
      <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16z" opacity=".3"/>
      <path d="M12 5c3.866 0 7 3.134 7 7s-3.134 7-7 7-7-3.134-7-7 3.134-7 7-7zm0 2a5 5 0 100 10 5 5 0 000-10z" opacity=".6"/>
      <circle cx="12" cy="12" r="3" />
    </svg>
);

export const SparklingWandIcon: React.FC<IconProps> = ({ className, style, title }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Sparkling Wand'}>
      {title && <title>{title}</title>}
      <path d="M19.414 4.586a2 2 0 00-2.828 0L3.586 17.586a2 2 0 000 2.828L4.172 21a2 2 0 002.828 0l13-13a2 2 0 000-2.828L19.414 4.586zM7 19l-2-2 9-9 2 2-9 9z"/>
      <path d="M22 6l-1-1-3 3 1 1 3-3zm-4-4l-1-1-3 3 1 1 3-3zm-1 7l-1-1-3 3 1 1 3-3z"/>
      <path d="M5 22l-1-1-2-2 1-1 2 2zm-3-3l-1-1-2-2 1-1 2 2z" opacity="0.7"/>
    </svg>
);

export const LetterFragmentIcon: React.FC<IconProps> = ({ className, style, title }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Letter Fragment'}>
        {title && <title>{title}</title>}
        <path d="M20 4H4C2.897 4 2 4.897 2 6V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V6C22 4.897 21.103 4 20 4ZM4 6L12 11L20 6V8L12 13L4 8V6Z" opacity="0.7"/>
        <path d="M12 14.5l-2-1.5v-2l2 1.5 2-1.5v2z" fill="#FFC0CB"/>
    </svg>
);

export const DoubleHeartIcon: React.FC<IconProps> = ({ className, style, title }) => (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Couple Power'}>
        {title && <title>{title}</title>}
        <path d="M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.03L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3Z" transform="translate(-3, -2) scale(0.8)" />
        <path d="M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.03L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3Z" transform="translate(3, 2) scale(0.8)" opacity="0.7"/>
    </svg>
);


export const ConfettiPieceIcon: React.FC<IconProps & { color: string, rotation: number, size: number }> = ({ className, style, title, color, rotation, size }) => (
  <rect
    className={className}
    style={{ ...style, transform: `rotate(${rotation}deg)` }}
    x={-size/2} 
    y={-size/2} 
    width={size}
    height={size * 0.5} 
    fill={color}
    rx="1"
    aria-hidden="true"
  />
);

export const BoomerangHitAnimationIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
    {title && <title>{title}</title>}
    <circle cx="12" cy="12" r="10" opacity="0"/> 
    <path d="M12 2L14.09 7.09L19.83 8.17L15.91 12.09L16.92 17.83L12 15.27L7.08 17.83L8.09 12.09L4.17 8.17L9.91 7.09L12 2Z" />
  </svg>
);

export const AimingArrowIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Aiming direction arrow'}>
    {title && <title>{title}</title>}
    <path d="M12 4L4 14H20L12 4Z" /> 
  </svg>
);

export const DreamEssenceIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Dream Essence icon'}>
    {title && <title>{title}</title>}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/>
    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" fill="#AD55FF"/>
    <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#E0AAFF" opacity="0.8"/>
    <path d="M12 5.5l1.58 3.22L17 9.5l-3.22 1.58L12 14.5l-1.58-3.22L7 9.5l3.22-1.58L12 5.5zM12 18.5l-1.58-3.22L7 14.5l3.22-1.58L12 9.5l1.58 3.22L17 14.5l-3.22 1.58L12 18.5z" fill="#FFF59D" opacity="0.6"/>
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className, style, title }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title ? title : 'Pause icon'}>
    {title && <title>{title}</title>}
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);
