import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, Book, Loan, Student, Review, Reservation } from './types/library';
import { StorageService } from './services/storage';
import { Header } from './components/Header';
import { LibrarianView } from './components/LibrarianView/LibrarianView';
import { StudentView } from './components/StudentView/StudentView';
import { BookDetailModal } from './components/BookDetailModal';
import { BookFormModal } from './components/BookFormModal';
import { NewLoanModal } from './components/NewLoanModal';
import { NoticeModal } from './components/NoticeModal';
import { StudentCardModal } from './components/StudentCardModal';
import { ReviewModal } from './components/ReviewModal';

export default function App() {
  const [role, setRole] = useState<UserRole>('librarian');
  const [currentStudentId, setCurrentStudentId] = useState<string>('stud-1');

  // Dados do sistema
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Estados dos Modais
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [bookToEdit, setBookToEdit] = useState<Book | null | undefined>(undefined);
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [noticeLoan, setNoticeLoan] = useState<Loan | null>(null);
  const [cardStudent, setCardStudent] = useState<Student | null>(null);
  const [reviewBook, setReviewBook] = useState<Book | null>(null);

  // Carrega dados do StorageService
  const loadData = useCallback(() => {
    StorageService.initialize();
    setBooks(StorageService.getBooks());
    setLoans(StorageService.getLoans());
    setStudents(StorageService.getStudents());
    setReviews(StorageService.getReviews());
    setReservations(StorageService.getReservations());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar todos os livros, empréstimos, alunos e resenhas de demonstração?')) {
      StorageService.resetToDefaults();
      loadData();
    }
  };

  const handleRecordContact = (loanId: string, note: string) => {
    const allLoans = StorageService.getLoans();
    const l = allLoans.find((item) => item.id === loanId);
    if (l) {
      l.notes = l.notes ? `${l.notes} | ${note}` : note;
      localStorage.setItem('bibliotech_loans_v1', JSON.stringify(allLoans));
      loadData();
    }
  };

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Cabeçalho com Seletor Rápido de Perfil */}
      <Header
        currentRole={role}
        onRoleChange={setRole}
        students={students}
        currentStudentId={currentStudentId}
        onStudentChange={setCurrentStudentId}
        onResetData={handleResetData}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'librarian' ? (
          <LibrarianView
            books={books}
            loans={loans}
            students={students}
            onRefresh={loadData}
            onOpenNewLoanModal={() => setIsNewLoanOpen(true)}
            onOpenBookFormModal={(book) => setBookToEdit(book ?? null)}
            onOpenNoticeModal={(loan) => setNoticeLoan(loan)}
            onOpenStudentCardModal={(student) => setCardStudent(student)}
          />
        ) : (
          currentStudent && (
            <StudentView
              currentStudent={currentStudent}
              books={books}
              loans={loans}
              reviews={reviews}
              reservations={reservations}
              onRefresh={loadData}
              onOpenBookDetail={(book) => setSelectedBookForDetail(book)}
              onOpenReviewModal={(book) => setReviewBook(book)}
              onOpenStudentCardModal={(student) => setCardStudent(student)}
            />
          )
        )}
      </main>

      {/* Rodapé Institucional */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            <span className="font-semibold text-stone-700">BiblioTech Escolar</span> — Sistema de Gestão de Acervo e Leitura
          </div>
          <div className="flex items-center gap-4">
            <span>Colégio Estadual Santos Dumont</span>
            <span>·</span>
            <button
              onClick={handleResetData}
              className="text-stone-600 hover:text-stone-900 underline"
            >
              Restaurar Dados de Exemplo
            </button>
          </div>
        </div>
      </footer>

      {/* Modais Globais */}
      {selectedBookForDetail && currentStudent && (
        <BookDetailModal
          book={selectedBookForDetail}
          currentStudent={currentStudent}
          reviews={reviews}
          onClose={() => setSelectedBookForDetail(null)}
          onRefresh={loadData}
          onOpenReviewModal={(book) => {
            setSelectedBookForDetail(null);
            setReviewBook(book);
          }}
        />
      )}

      {bookToEdit !== undefined && (
        <BookFormModal
          bookToEdit={bookToEdit}
          onClose={() => setBookToEdit(undefined)}
          onSuccess={loadData}
        />
      )}

      {isNewLoanOpen && (
        <NewLoanModal
          books={books}
          students={students}
          onClose={() => setIsNewLoanOpen(false)}
          onSuccess={loadData}
        />
      )}

      {noticeLoan && (
        <NoticeModal
          loan={noticeLoan}
          onClose={() => setNoticeLoan(null)}
          onRecordContact={handleRecordContact}
        />
      )}

      {cardStudent && (
        <StudentCardModal
          student={cardStudent}
          onClose={() => setCardStudent(null)}
        />
      )}

      {reviewBook && currentStudent && (
        <ReviewModal
          book={reviewBook}
          student={currentStudent}
          onClose={() => setReviewBook(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
