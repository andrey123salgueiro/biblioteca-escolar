import React, { useState } from 'react';
import { Book, Student } from '../types/library';
import { StorageService, offsetDate, formatDateBR } from '../services/storage';
import { X, Check, BookPlus, AlertCircle } from 'lucide-react';

interface NewLoanModalProps {
  books: Book[];
  students: Student[];
  onClose: () => void;
  onSuccess: () => void;
}

export const NewLoanModal: React.FC<NewLoanModalProps> = ({
  books,
  students,
  onClose,
  onSuccess,
}) => {
  const [selectedBookId, setSelectedBookId] = useState(
    books.find((b) => b.availableCopies > 0)?.id || ''
  );
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [dueDays, setDueDays] = useState(14);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedBook = books.find((b) => b.id === selectedBookId);
  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedBookId || !selectedStudentId) {
      setError('Por favor, selecione um livro e um aluno.');
      return;
    }

    const result = StorageService.createLoan({
      bookId: selectedBookId,
      studentId: selectedStudentId,
      dueDays,
      notes: notes.trim() || undefined,
    });

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Erro ao registrar empréstimo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <BookPlus className="w-5 h-5 text-stone-900" />
            <h3 className="font-bold text-stone-900 text-sm">
              Registrar Novo Empréstimo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Seleção do Livro */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Selecionar Livro do Acervo:
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400 font-medium"
            >
              {books.map((b) => (
                <option
                  key={b.id}
                  value={b.id}
                  disabled={b.availableCopies <= 0}
                >
                  {b.title} — {b.author} ({b.availableCopies > 0 ? `${b.availableCopies} disponíveis` : 'ESGOTADO'})
                </option>
              ))}
            </select>
            {selectedBook && (
              <p className="mt-1 text-[11px] text-stone-500">
                Localização: <span className="font-semibold text-stone-700">{selectedBook.shelfLocation}</span> · {selectedBook.genre}
              </p>
            )}
          </div>

          {/* Seleção do Aluno */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Selecionar Aluno(a):
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400 font-medium"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade.split('-')[0].trim()}) — Matrícula: {s.enrollmentNumber} {s.status === 'pendente' ? '⚠️ COM ATRASO' : ''}
                </option>
              ))}
            </select>
            {selectedStudent?.status === 'pendente' && (
              <p className="mt-1 text-[11px] text-amber-700 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Atenção: Este aluno possui livro com prazo vencido pendente de devolução.
              </p>
            )}
          </div>

          {/* Prazo de Devolução */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Prazo Padrão:
              </label>
              <select
                value={dueDays}
                onChange={(e) => setDueDays(Number(e.target.value))}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              >
                <option value={7}>7 dias (1 semana)</option>
                <option value={14}>14 dias (2 semanas - Padrão)</option>
                <option value={21}>21 dias (3 semanas)</option>
                <option value={30}>30 dias (1 mês)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Data Prevista de Entrega:
              </label>
              <div className="text-xs p-2.5 bg-stone-100 border border-stone-200 rounded-lg text-stone-800 font-mono font-semibold tabular-nums flex items-center h-[38px]">
                {formatDateBR(offsetDate(dueDays))}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Observações (opcional):
            </label>
            <input
              type="text"
              placeholder="Ex: Trabalho de literatura bimestral do Prof. Carlos."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400"
            />
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
              <span>Confirmar Empréstimo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
