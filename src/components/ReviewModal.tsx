import React, { useState } from 'react';
import { Book, Student } from '../types/library';
import { StorageService } from '../services/storage';
import { X, Star, Check } from 'lucide-react';

interface ReviewModalProps {
  book: Book | null;
  student: Student;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  book,
  student,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  if (!book) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) return;

    StorageService.addReview({
      bookId: book.id,
      studentId: student.id,
      studentName: student.name,
      studentGrade: student.grade.split('-')[0].trim(),
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              Escrever Resenha Escolar
            </h3>
            <p className="text-xs text-stone-500 truncate max-w-xs">
              {book.title} — {book.author}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Estrelas */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              Sua Nota para esta Leitura:
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-hidden"
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-stone-700">
                {rating} de 5 estrelas
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Título da sua resenha:
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Uma surpresa fantástica! / Muito emocionante"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Sua opinião para recomendar aos colegas:
            </label>
            <textarea
              required
              rows={4}
              placeholder="O que você achou dos personagens, do enredo e do ritmo da história? Vale a pena ler para o clube de leitura?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-hidden resize-none leading-relaxed"
            />
          </div>

          <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-md border border-stone-200">
            Sua resenha será publicada com seu nome: <strong>{student.name} ({student.grade.split('-')[0].trim()})</strong>.
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Publicar Resenha</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
