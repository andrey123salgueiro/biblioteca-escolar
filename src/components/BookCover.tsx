import React from 'react';
import { Book } from '../types/library';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ book, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-16 h-24 text-[10px]',
    md: 'w-28 h-40 text-xs',
    lg: 'w-44 h-64 text-sm',
  };

  return (
    <div
      className={`relative rounded-md overflow-hidden shadow-sm flex flex-col justify-between p-2.5 select-none bg-gradient-to-br ${book.coverBg} border border-stone-800/40 shrink-0 ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.15)',
      }}
    >
      {/* Detalhe da lombada do livro */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

      {/* Topo: Gênero discreto */}
      <div className="relative z-10 pl-1.5 flex items-center justify-between text-stone-300/80">
        <span className="truncate uppercase tracking-wider text-[9px] font-semibold">
          {book.genre.split('&')[0].trim()}
        </span>
        <BookOpen className="w-3 h-3 opacity-60 shrink-0" />
      </div>

      {/* Centro: Título e Autor com tipografia elegante */}
      <div className="relative z-10 pl-1.5 my-auto text-left">
        <h4 className="font-bold text-white leading-tight line-clamp-3 text-shadow">
          {book.title}
        </h4>
        <p className="mt-1 text-stone-300 font-medium text-[11px] truncate">
          {book.author}
        </p>
      </div>

      {/* Base: Ano e detalhes */}
      <div className="relative z-10 pl-1.5 pt-1 border-t border-white/10 flex items-center justify-between text-stone-400 text-[9px] font-mono tabular-nums">
        <span>{book.publicationYear}</span>
        <span className="text-amber-300/90 font-bold">★ {book.rating.toFixed(1)}</span>
      </div>
    </div>
  );
};
