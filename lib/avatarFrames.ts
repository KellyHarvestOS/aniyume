export interface AvatarFrameFit {
  size: string;
  width?: string;
  height?: string;
  x?: string;
  y?: string;
}

export const AVATAR_FRAME_FIT: Record<string, AvatarFrameFit> = {
  ramka1000people: { size: '134%' },
  'ramka1-10lvl': { size: '136%' },
  'ramka11-20lvl': { size: '136%' },
  'ramka21-30lvl': { size: '138%' },
  'ramka31-40lvl': { size: '164%', width: '169%', height: '164%', x: '-1px', y: '5px' },
  'ramka41-50lvl': { size: '164%', width: '158%', height: '170%', x: '-2px', y: '9px' },
  'ramka51-60lvl': { size: '126%' },
  'ramka61-70lvl': { size: '173%', width: '181%', height: '166%', x: '0px', y: '1px' },
  ramka67: { size: '136%' },
  'ramka+5friends': { size: '136%' },
  'ramka+10friends': { size: '136%' },
  'ramka+25friends': { size: '136%' },
  ramkaShark: { size: '136%' },
  ramkaUborka: { size: '165%', width: '160%', height: '170%', x: '-1.5px', y: '9px' },
};

export const DEFAULT_AVATAR_FRAME_FIT: AvatarFrameFit = { size: '136%', x: '0px', y: '0px' };

export const getAvatarFrameFit = (key?: string | null) => {
  if (!key) return DEFAULT_AVATAR_FRAME_FIT;
  return AVATAR_FRAME_FIT[key] || DEFAULT_AVATAR_FRAME_FIT;
};
