import { Video } from 'lucide-react';

interface SourceBadgeProps {
  url: string;
  index: number;
}

export const SourceBadge = ({ url, index }: SourceBadgeProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 mt-2 mr-2 text-xs font-medium text-white/80 bg-white/10 hover:bg-red-500/20 hover:text-red-200 border border-white/10 rounded-full transition-all duration-300"
    >
      <Video size={14} className="text-red-400" />
      <span>Source Video {index + 1}</span>
    </a>
  );
};