import React, { useState, useMemo } from 'react';
import { Book, Loan, Student, Review, Reservation, BookGenre } from '../../types/library';
import { BookCover } from '../BookCover';
import { StorageService, formatDateBR, getDaysDiff } from '../../services/storage';
import {
  Search,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Star,
  ThumbsUp,
  RotateCcw,
  Sparkles,
  MapPin,
  IdCard,
  MessageSquare,
} from 'lucide-react';

interface StudentViewProps {
  currentStudent: Student;
  books: Book[];
  loans: Loan[];
  reviews: Review[];
  reservations: Reservation[];
  onRefresh: () => void;
  onOpenBookDetail: (book: Book) => void;
  onOpenReviewModal: (book: Book) => void;
  onOpenStudentCardModal: (student: Student) => void;
}

type StudentTab = 'catalogo' | 'minhas_leituras' | 'mural';

const GENRES: ('todos' | BookGenre)[] = [
  'todos',
  'Literatura Brasileira',
  'Ficção Científica',
  'Fantasia',
  'História & Filosofia',
  'HQ & Mangá',
  'Ciências & Natureza',
  'Poesia',
];

export const StudentView: React.FC<StudentViewProps> = ({
  currentStudent,
  books,
  loans,
  reviews,
  reservations,
  onRefresh,
  onOpenBookDetail,
  onOpenReviewModal,
  onOpenStudentCardModal,
}) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('catalogo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<'todos' | BookGenre>('todos');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Livros atualmente com o aluno logado
  const myActiveLoans = useMemo(() => {
    return loans.filter((l) => l.studentId === currentStudent.id && l.status === 'active');
  }, [loans, currentStudent.id]);

  // Histórico de leituras já devolvidas pelo aluno
  const myReturnedLoans = useMemo(() => {
    return loans.filter((l) => l.studentId === currentStudent.id && l.status === 'returned');
  }, [loans, currentStudent.id]);

  // Reservas ativas do aluno
  const myReservations = useMemo(() => {
    return reservations.filter(
      (r) => r.studentId === currentStudent.id && r.status === 'pending'
    );
  }, [reservations, currentStudent.id]);

  // Filtro do catálogo
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (selectedGenre !== 'todos' && b.genre !== selectedGenre) return false;
      if (onlyAvailable && b.availableCopies <= 0) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.shelfLocation.toLowerCase().includes(q) ||
        b.synopsis.toLowerCase().includes(q)
      );
    });
  }, [books, selectedGenre, onlyAvailable, searchQuery]);

  const handleRenew = (loanId: string, bookTitle: string) => {
    const res = StorageService.renewLoan(loanId, 7);
    if (res.success) {
      setFeedbackMsg(`Prazo renovado em +7 dias para "${bookTitle}"! Boa leitura.`);
      setTimeout(() => setFeedbackMsg(null), 3500);
      onRefresh();
    }
  };

  const handleLike = (reviewId: string) => {
    StorageService.likeReview(reviewId);
    onRefresh();
  };

  // Verifica se o aluno tem atraso
  const hasOverdueLoan = myActiveLoans.some((l) => getDaysDiff(l.dueDate) < 0);

  return (
    <div className="space-y-6">
      {/* Banner de Boas-Vindas com Imagem Real da Biblioteca */}
      <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-white shadow-md border border-stone-800">
        <img
          src="/src/assets/images/library_reading_hall_1792413850673.jpg"
          alt="Salão de leitura da biblioteca escolar"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Portal do Estudante
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-xs text-stone-300 font-mono">{currentStudent.grade}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Olá, {currentStudent.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Explore o acervo físico da escola, pesquise na prateleira certa, reserve novos títulos e acompanhe suas datas de devolução sem atrasos.
            </p>
          </div>

          <div className="flex flex-row md:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onOpenStudentCardModal(currentStudent)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs border border-white/15 transition-all shadow-xs"
            >
              <IdCard className="w-4 h-4 text-amber-300" />
              <span>Minha Carteirinha Digital</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('minhas_leituras')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                hasOverdueLoan
                  ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
                  : 'bg-amber-400 text-stone-950 hover:bg-amber-300 font-bold'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>
                {myActiveLoans.length} {myActiveLoans.length === 1 ? 'Livro Comigo' : 'Livros Comigo'}
                {hasOverdueLoan && ' (Atrasado!)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Alerta de Atraso se houver */}
      {hasOverdueLoan && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-rose-950 text-xs sm:text-sm">
                Atenção: Você possui exemplar com devolução em atraso!
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Por favor, entregue o livro no balcão da biblioteca hoje para regularizar seu cadastro e liberar novos empréstimos.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('minhas_leituras')}
            className="px-3 py-1.5 bg-rose-700 text-white rounded-lg text-xs font-bold hover:bg-rose-800 shrink-0"
          >
            Ver Detalhes
          </button>
        </div>
      )}

      {/* Abas do Aluno */}
      <div className="border-b border-stone-200 flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('catalogo')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'catalogo'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catálogo de Livros ({books.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('minhas_leituras')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'minhas_leituras'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Minhas Leituras & Prazos ({myActiveLoans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mural')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'mural'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Mural de Resenhas dos Colegas ({reviews.length})</span>
        </button>
      </div>

      {/* ABA 1: CATÁLOGO DE LIVROS */}
      {activeTab === 'catalogo' && (
        <div className="space-y-5">
          {/* Barra de Busca e Filtro de Disponibilidade */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar por título, autor, assunto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer self-start md:self-auto select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
              />
              <span>Mostrar apenas com exemplares disponíveis agora na estante</span>
            </label>
          </div>

          {/* Abas de Gêneros Literários (Botões Funcionais) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedGenre === g
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {g === 'todos' ? 'Todos os Gêneros' : g}
              </button>
            ))}
          </div>

          {/* Grid de Livros */}
          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-xl border border-stone-200 space-y-2">
              <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="font-semibold text-stone-700">Nenhum livro encontrado para esta busca.</p>
              <p>Tente buscar por outro termo ou selecione "Todos os Gêneros".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBooks.map((book) => {
                const isAvailable = book.availableCopies > 0;
                return (
                  <div
                    key={book.id}
                    onClick={() => onOpenBookDetail(book)}
                    className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="flex gap-3.5">
                      <BookCover book={book} size="md" />

                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                          {book.genre.split('&')[0].trim()}
                        </span>
                        <h3 className="font-bold text-stone-900 text-sm leading-tight line-clamp-2 group-hover:text-amber-800 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-xs text-stone-600 font-medium truncate">
                          {book.author}
                        </p>

                        <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold pt-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{book.rating.toFixed(1)}</span>
                          <span className="text-stone-400 font-normal">({book.reviewCount})</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-stone-600">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{book.shelfLocation}</span>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm ${
                          isAvailable
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {isAvailable ? `${book.availableCopies} livres` : 'Reservar'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ABA 2: MINHAS LEITURAS & PRAZOS */}
      {activeTab === 'minhas_leituras' && (
        <div className="space-y-6">
          {/* Livros Atualmente Emprestados */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  Livros em Sua Posse ({myActiveLoans.length})
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Acompanhe a data exata de entrega e solicite renovações caso precise de mais tempo.
                </p>
              </div>
            </div>

            {myActiveLoans.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-lg space-y-2">
                <Bookmark className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="font-semibold text-stone-700">Você não possui nenhum livro emprestado no momento.</p>
                <button
                  onClick={() => setActiveTab('catalogo')}
                  className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Explorar Catálogo da Biblioteca
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myActiveLoans.map((loan) => {
                  const daysDiff = getDaysDiff(loan.dueDate);
                  const isOverdue = daysDiff < 0;
                  const isToday = daysDiff === 0;

                  return (
                    <div
                      key={loan.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isOverdue
                          ? 'bg-rose-50/70 border-rose-300'
                          : isToday
                          ? 'bg-amber-50/70 border-amber-300'
                          : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">
                            {loan.bookTitle}
                          </h4>
                          <span className="text-xs text-stone-500">
                            por {loan.bookAuthor}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                          <span>Retirado em: <strong className="font-mono">{formatDateBR(loan.loanDate)}</strong></span>
                          <span>·</span>
                          <span>Data Limite: <strong className="font-mono">{formatDateBR(loan.dueDate)}</strong></span>
                          {loan.renewalCount > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-stone-500 italic">({loan.renewalCount}x renovado)</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                        {isOverdue ? (
                          <div className="text-right">
                            <span className="inline-block px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-md">
                              Atrasado há {Math.abs(daysDiff)} dias!
                            </span>
                            <span className="block text-[11px] text-rose-700 mt-0.5 font-medium">
                              Entregue no balcão hoje
                            </span>
                          </div>
                        ) : isToday ? (
                          <div className="text-right">
                            <span className="inline-block px-2.5 py-1 bg-amber-500 text-stone-950 font-bold text-xs rounded-md">
                              Vence HOJE!
                            </span>
                            <span className="block text-[11px] text-amber-800 mt-0.5">
                              Último dia para devolução
                            </span>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-md">
                              Restam {daysDiff} dias
                            </span>
                            <span className="block text-[11px] text-stone-500 mt-0.5">
                              Tudo em dia
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRenew(loan.id, loan.bookTitle)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold border border-stone-200 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Pedir +7 Dias</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reservas Ativas */}
          {myReservations.length > 0 && (
            <div className="bg-amber-50/50 rounded-xl border border-amber-200 p-5 space-y-3">
              <h4 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-amber-700" />
                <span>Suas Reservas em Fila de Espera ({myReservations.length})</span>
              </h4>
              <div className="space-y-2">
                {myReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 bg-white rounded-lg border border-amber-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900 block">{res.bookTitle}</span>
                      <span className="text-stone-500">
                        Solicitado em {formatDateBR(res.requestDate)} · Aguardando devolução
                      </span>
                    </div>
                    <span className="text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded">
                      Fila Ativa
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Histórico de Leituras Já Concluídas */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-stone-900 text-sm">
              Histórico de Livros Concluídos ({myReturnedLoans.length})
            </h4>

            {myReturnedLoans.length === 0 ? (
              <p className="text-xs text-stone-500 italic">Nenhum livro concluído neste ano letivo ainda.</p>
            ) : (
              <div className="space-y-2">
                {myReturnedLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="p-3 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-800">{loan.bookTitle}</span>
                      <span className="text-stone-500 block">por {loan.bookAuthor}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-700 font-semibold block">Devolvido em dia</span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {formatDateBR(loan.returnDate || '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 3: MURAL DE RESENHAS DA COMUNIDADE */}
      {activeTab === 'mural' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Mural de Recomendações e Resenhas
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Veja o que os outros estudantes estão achando dos livros da biblioteca escolar e publique suas dicas de leitura.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenReviewModal(books[0])}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs"
            >
              + Escrever Nova Resenha
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => {
              const book = books.find((b) => b.id === rev.bookId);
              return (
                <div
                  key={rev.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                          Livro Resenhado
                        </span>
                        <h4
                          onClick={() => book && onOpenBookDetail(book)}
                          className="font-bold text-sm text-stone-900 hover:text-amber-800 cursor-pointer"
                        >
                          {book ? book.title : 'Obra do Acervo'}
                        </h4>
                      </div>

                      <div className="flex items-center text-amber-500 shrink-0">
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

                    <h5 className="font-bold text-xs text-stone-800 pt-1">
                      "{rev.title}"
                    </h5>
                    <p className="text-xs text-stone-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="text-stone-600">
                      <span className="font-bold">{rev.studentName}</span>
                      <span className="text-[11px] text-stone-400 ml-1">
                        ({rev.studentGrade})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLike(rev.id)}
                      className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-900 font-medium transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{rev.likes} curtidas</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
