import React, { useState } from 'react';
import { Book, Review, Student } from '../types/library';
import { BookCover } from './BookCover';
import { StorageService, formatDateBR } from '../services/storage';
import { X, MapPin, CheckCircle2, BookmarkPlus, Star, ThumbsUp, MessageSquare, AlertCircle } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  currentStudent: Student;
  reviews: Review[];
  onClose: () => void;
  onRefresh: () => void;
  onOpenReviewModal: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  currentStudent,
  reviews,
  onClose,
  onRefresh,
  onOpenReviewModal,
}) => {
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!book) return null;

  const bookReviews = reviews.filter((r) => r.bookId === book.id);
  const hasAvailableCopies = book.availableCopies > 0;

  const handleBorrowOrReserve = () => {
    setActionError(null);
    setActionSuccess(null);

    if (hasAvailableCopies) {
      // Cria empréstimo direto de 14 dias para o estudante
      const res = StorageService.createLoan({
        bookId: book.id,
        studentId: currentStudent.id,
        dueDays: 14,
        notes: 'Solicitado pelo portal do aluno.',
      });
      if (res.success) {
        setActionSuccess('Empréstimo confirmado! Você tem 14 dias para a leitura.');
        onRefresh();
      } else {
        setActionError(res.error || 'Não foi possível solicitar o empréstimo.');
      }
    } else {
      // Faz reserva
      const res = StorageService.createReservation(book.id, currentStudent.id);
      if (res.success) {
        setActionSuccess('Reserva confirmada! Avisaremos assim que um exemplar for devolvido.');
        onRefresh();
      } else {
        setActionError(res.error || 'Erro ao efetuar reserva.');
      }
    }
  };

  const handleLike = (reviewId: string) => {
    StorageService.likeReview(reviewId);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
        {/* Topo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>{book.genre}</span>
            <span>·</span>
            <span>ISBN: {book.isbn}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 overflow-y-auto space-y-6">
          {actionSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {actionError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* Destaque do Livro: Capa + Informações */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <BookCover book={book} size="lg" />

            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h2 className="text-xl font-bold text-stone-900 leading-snug">
                  {book.title}
                </h2>
                <p className="text-sm font-semibold text-stone-700 mt-0.5">
                  {book.author}
                </p>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <span>Ano {book.publicationYear}</span>
                  <span>·</span>
                  <span>{book.pages} páginas</span>
                  <span>·</span>
                  <span className="text-amber-600 font-bold flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {book.rating.toFixed(1)} ({book.reviewCount} avaliações)
                  </span>
                </div>
              </div>

              {/* Localização Física e Disponibilidade */}
              <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-stone-700 font-medium">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Localização física: <strong>{book.shelfLocation}</strong></span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200/80">
                  <span className="text-stone-500">Exemplares na biblioteca:</span>
                  <span className="font-semibold text-stone-800">
                    {book.availableCopies} livres de {book.totalCopies} cópias
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      hasAvailableCopies ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      hasAvailableCopies ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {hasAvailableCopies
                      ? 'Disponível para empréstimo imediato'
                      : 'Todos os exemplares emprestados no momento'}
                  </span>
                </div>
              </div>

              {/* Botão de Ação do Estudante */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleBorrowOrReserve}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                    hasAvailableCopies
                      ? 'bg-stone-900 text-white hover:bg-stone-800'
                      : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>
                    {hasAvailableCopies
                      ? 'Pegar Emprestado (14 dias)'
                      : 'Reservar Próximo Exemplar'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenReviewModal(book)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                  <span>Avaliar Obra</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sinopse */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Sinopse do Livro
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50/60 p-4 rounded-lg border border-stone-100">
              {book.synopsis}
            </p>
          </div>

          {/* Resenhas dos Colegas da Escola */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                O que os alunos da escola acharam ({bookReviews.length})
              </h3>
              <button
                onClick={() => onOpenReviewModal(book)}
                className="text-xs font-semibold text-stone-800 hover:underline"
              >
                + Adicionar minha opinião
              </button>
            </div>

            {bookReviews.length === 0 ? (
              <p className="text-xs text-stone-500 italic p-3 bg-stone-50 rounded-lg text-center">
                Nenhum aluno publicou resenha sobre este título ainda. Seja o primeiro a avaliar!
              </p>
            ) : (
              <div className="space-y-3">
                {bookReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-lg border border-stone-200 bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-stone-900">
                          {rev.studentName}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          ({rev.studentGrade})
                        </span>
                        <span className="text-[11px] text-stone-400">·</span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {formatDateBR(rev.date)}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h5 className="text-xs font-bold text-stone-800">{rev.title}</h5>
                    <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>

                    <div className="pt-1 flex items-center justify-end">
                      <button
                        onClick={() => handleLike(rev.id)}
                        className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Útil ({rev.likes})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
