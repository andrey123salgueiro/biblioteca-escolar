import React, { useState, useMemo } from 'react';
import { Book, Loan, Student } from '../../types/library';
import { StorageService, formatDateBR, getDaysDiff } from '../../services/storage';
import { BookCover } from '../BookCover';
import {
  BookOpen,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  UserCheck,
  TrendingUp,
  RotateCcw,
  Bell,
  Trash2,
  Edit,
  IdCard,
  MapPin,
  Users,
} from 'lucide-react';

interface LibrarianViewProps {
  books: Book[];
  loans: Loan[];
  students: Student[];
  onRefresh: () => void;
  onOpenNewLoanModal: () => void;
  onOpenBookFormModal: (book?: Book | null) => void;
  onOpenNoticeModal: (loan: Loan) => void;
  onOpenStudentCardModal: (student: Student) => void;
}

type TabType = 'circulacao' | 'atrasos' | 'acervo' | 'carteirinhas' | 'estatisticas';
type LoanFilter = 'todos' | 'em_dia' | 'vence_hoje' | 'em_atraso';

export const LibrarianView: React.FC<LibrarianViewProps> = ({
  books,
  loans,
  students,
  onRefresh,
  onOpenNewLoanModal,
  onOpenBookFormModal,
  onOpenNoticeModal,
  onOpenStudentCardModal,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('circulacao');
  const [searchQuery, setSearchQuery] = useState('');
  const [loanFilter, setLoanFilter] = useState<LoanFilter>('todos');
  const [genreFilter, setGenreFilter] = useState<string>('todos');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Filtra empréstimos ativos
  const activeLoans = useMemo(() => {
    return loans.filter((l) => l.status === 'active');
  }, [loans]);

  // Identifica atrasados
  const overdueLoans = useMemo(() => {
    return activeLoans
      .filter((l) => getDaysDiff(l.dueDate) < 0)
      .sort((a, b) => getDaysDiff(a.dueDate) - getDaysDiff(b.dueDate)); // Mais atrasado primeiro
  }, [activeLoans]);

  // Identifica vencimentos hoje
  const dueTodayLoans = useMemo(() => {
    return activeLoans.filter((l) => getDaysDiff(l.dueDate) === 0);
  }, [activeLoans]);

  // Filtro da tela de circulação
  const filteredCirculationLoans = useMemo(() => {
    return activeLoans.filter((loan) => {
      const daysDiff = getDaysDiff(loan.dueDate);

      if (loanFilter === 'em_dia' && daysDiff <= 0) return false;
      if (loanFilter === 'vence_hoje' && daysDiff !== 0) return false;
      if (loanFilter === 'em_atraso' && daysDiff >= 0) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        loan.bookTitle.toLowerCase().includes(q) ||
        loan.studentName.toLowerCase().includes(q) ||
        loan.studentGrade.toLowerCase().includes(q) ||
        loan.studentEnrollment.toLowerCase().includes(q)
      );
    });
  }, [activeLoans, loanFilter, searchQuery]);

  // Filtro da tela de acervo
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (genreFilter !== 'todos' && b.genre !== genreFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.shelfLocation.toLowerCase().includes(q)
      );
    });
  }, [books, genreFilter, searchQuery]);

  const handleReturn = (loanId: string, bookTitle: string) => {
    const success = StorageService.returnLoan(loanId);
    if (success) {
      setActionFeedback(`Baixa registrada com sucesso! "${bookTitle}" retornou à prateleira.`);
      setTimeout(() => setActionFeedback(null), 3500);
      onRefresh();
    }
  };

  const handleRenew = (loanId: string, bookTitle: string) => {
    const res = StorageService.renewLoan(loanId, 7);
    if (res.success) {
      setActionFeedback(`Prazo renovado em +7 dias para "${bookTitle}".`);
      setTimeout(() => setActionFeedback(null), 3500);
      onRefresh();
    }
  };

  const handleDeleteBook = (bookId: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja remover o título "${title}" do acervo da biblioteca?`)) {
      StorageService.deleteBook(bookId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Título Administrativa e Ações Rápidas */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Mesa de Gestão da Bibliotecária
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
              Modo Operacional
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Controle de circulação diária, monitoramento de prazos e administração do acervo escolar.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNewLoanModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Novo Empréstimo</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenBookFormModal(null)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 text-stone-800 rounded-lg text-xs font-semibold hover:bg-stone-200 border border-stone-200 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-600" />
            <span>Cadastrar Livro</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Cards de Métricas / Visão Rápida */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Livros em Uso</span>
            <BookOpen className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
            {activeLoans.length}
          </p>
          <span className="text-[11px] text-stone-500">Exemplares circulando com alunos</span>
        </div>

        <div
          onClick={() => {
            setActiveTab('atrasos');
          }}
          className="bg-rose-50/70 hover:bg-rose-50 cursor-pointer p-4 rounded-xl border border-rose-200 shadow-2xs transition-colors"
        >
          <div className="flex items-center justify-between text-rose-800 text-xs font-semibold">
            <span>Em Atraso Crítico</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-1 font-mono tabular-nums">
            {overdueLoans.length}
          </p>
          <span className="text-[11px] text-rose-700 font-medium">
            Clique para ver painel de cobrança
          </span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold">
            <span>Vencendo Hoje</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 mt-1 font-mono tabular-nums">
            {dueTodayLoans.length}
          </p>
          <span className="text-[11px] text-amber-700">Aguardando entrega até o fim do turno</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Acervo Total</span>
            <TrendingUp className="w-4 h-4 text-stone-700" />
          </div>
          <p className="text-2xl font-bold text-stone-900 mt-1 font-mono tabular-nums">
            {books.reduce((acc, curr) => acc + curr.totalCopies, 0)}
          </p>
          <span className="text-[11px] text-stone-500">
            {books.length} títulos cadastrados
          </span>
        </div>
      </div>

      {/* Navegação por Abas Principais */}
      <div className="border-b border-stone-200 flex items-center justify-between gap-4 overflow-x-auto pb-px">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('circulacao')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'circulacao'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Livros em Uso ({activeLoans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('atrasos')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'atrasos'
                ? 'border-rose-600 text-rose-700 bg-rose-50/50'
                : 'border-transparent text-rose-600 hover:text-rose-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Central de Atrasos ({overdueLoans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('acervo')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'acervo'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Gestão do Acervo ({books.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('carteirinhas')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'carteirinhas'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <IdCard className="w-4 h-4" />
            <span>Carteirinhas Digitais</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('estatisticas')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'estatisticas'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Relatórios & Top Leitores</span>
          </button>
        </div>
      </div>

      {/* ABA 1: LIVROS EM USO (CIRCULAÇÃO EM TEMPO REAL) */}
      {activeTab === 'circulacao' && (
        <div className="space-y-4">
          {/* Controles de Filtro e Busca */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por aluno, turma ou livro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div className="flex items-center gap-1 self-stretch sm:self-auto overflow-x-auto">
              <span className="text-[11px] font-semibold text-stone-500 mr-1 hidden md:inline">
                Filtrar status:
              </span>
              <button
                type="button"
                onClick={() => setLoanFilter('todos')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  loanFilter === 'todos'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Todos ({activeLoans.length})
              </button>
              <button
                type="button"
                onClick={() => setLoanFilter('em_dia')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  loanFilter === 'em_dia'
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Em Dia ({activeLoans.filter((l) => getDaysDiff(l.dueDate) > 0).length})
              </button>
              <button
                type="button"
                onClick={() => setLoanFilter('vence_hoje')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  loanFilter === 'vence_hoje'
                    ? 'bg-amber-700 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Vence Hoje ({dueTodayLoans.length})
              </button>
              <button
                type="button"
                onClick={() => setLoanFilter('em_atraso')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  loanFilter === 'em_atraso'
                    ? 'bg-rose-700 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                Em Atraso ({overdueLoans.length})
              </button>
            </div>
          </div>

          {/* Tabela de Circulação de Livros */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            {filteredCirculationLoans.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 space-y-2">
                <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="font-semibold text-stone-700">Nenhum livro em circulação neste filtro.</p>
                <p>Use o botão "Novo Empréstimo" acima para registrar saídas do acervo.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Obra / Autor</th>
                      <th className="py-3 px-4">Aluno Responsável</th>
                      <th className="py-3 px-4">Retirado Em</th>
                      <th className="py-3 px-4">Prazo de Entrega</th>
                      <th className="py-3 px-4">Situação do Prazo</th>
                      <th className="py-3 px-4 text-right">Ações Operacionais</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {filteredCirculationLoans.map((loan) => {
                      const daysDiff = getDaysDiff(loan.dueDate);
                      const isOverdue = daysDiff < 0;
                      const isToday = daysDiff === 0;

                      return (
                        <tr
                          key={loan.id}
                          className={`hover:bg-stone-50/80 transition-colors ${
                            isOverdue ? 'bg-rose-50/30' : isToday ? 'bg-amber-50/30' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900 block">
                              {loan.bookTitle}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              {loan.bookAuthor} · {loan.bookGenre}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-800 block">
                              {loan.studentName}
                            </span>
                            <span className="text-[11px] text-stone-500 font-mono tabular-nums">
                              {loan.studentGrade} · Matr: {loan.studentEnrollment}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono tabular-nums text-stone-600">
                            {formatDateBR(loan.loanDate)}
                          </td>

                          <td className="py-3 px-4 font-mono tabular-nums font-semibold text-stone-800">
                            {formatDateBR(loan.dueDate)}
                          </td>

                          <td className="py-3 px-4">
                            {isOverdue ? (
                              <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                ATRASADO ({Math.abs(daysDiff)} dias)
                              </span>
                            ) : isToday ? (
                              <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                                <Clock className="w-3 h-3 text-amber-600" />
                                VENCE HOJE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Em dia ({daysDiff} dias restam)
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isOverdue && (
                                <button
                                  type="button"
                                  onClick={() => onOpenNoticeModal(loan)}
                                  title="Emitir comunicado escolar ao aluno e responsável"
                                  className="flex items-center gap-1 px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded font-semibold text-[11px] transition-colors"
                                >
                                  <Bell className="w-3 h-3 text-rose-700" />
                                  <span>Cobrar</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleRenew(loan.id, loan.bookTitle)}
                                title="Prorrogar prazo por mais 7 dias"
                                className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-medium text-[11px] transition-colors"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>+7d</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleReturn(loan.id, loan.bookTitle)}
                                className="flex items-center gap-1 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold text-[11px] transition-colors"
                              >
                                <CheckCircle2 className="w-3 h-3 text-amber-400" />
                                <span>Dar Baixa</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: CENTRAL DE ATRASOS & COBRANÇA */}
      {activeTab === 'atrasos' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-rose-950 text-base">
                  Painel de Inadimplência e Livros Retidos em Atraso
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Lista prioritária de alunos com empréstimos vencidos que ultrapassaram a data limite estipulada pela biblioteca escolar.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-rose-700 font-semibold block">Total de Retenções</span>
              <span className="text-2xl font-bold font-mono text-rose-900">
                {overdueLoans.length} exemplares
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            {overdueLoans.length === 0 ? (
              <div className="p-10 text-center text-xs text-emerald-800 bg-emerald-50/40 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Parabéns! Nenhum empréstimo em atraso.</h4>
                <p className="text-emerald-700">Todos os livros retirados pelos alunos estão dentro do prazo legal de devolução.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Dias de Atraso</th>
                      <th className="py-3 px-4">Livro Retido</th>
                      <th className="py-3 px-4">Aluno / Turma</th>
                      <th className="py-3 px-4">Contato do Responsável</th>
                      <th className="py-3 px-4">Vencimento Original</th>
                      <th className="py-3 px-4 text-right">Ações Imediatas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {overdueLoans.map((loan) => {
                      const daysLate = Math.abs(getDaysDiff(loan.dueDate));
                      return (
                        <tr key={loan.id} className="hover:bg-rose-50/40 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-sm text-rose-700 bg-rose-100 px-2.5 py-1 rounded-md inline-block">
                              +{daysLate} dias
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900 block">
                              {loan.bookTitle}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              {loan.bookAuthor}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-900 block">
                              {loan.studentName}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              {loan.studentGrade} · Matr: {loan.studentEnrollment}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-stone-700 font-medium">
                            {loan.studentContact}
                          </td>

                          <td className="py-3 px-4 font-mono tabular-nums text-rose-900 font-semibold">
                            {formatDateBR(loan.dueDate)}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => onOpenNoticeModal(loan)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-2xs"
                              >
                                <Bell className="w-3.5 h-3.5" />
                                <span>Emitir Notificação</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleReturn(loan.id, loan.bookTitle)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Registrar Devolução</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 3: GESTÃO DO ACERVO */}
      {activeTab === 'acervo' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar no acervo por título, autor, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="genre-select" className="text-xs text-stone-500">Gênero:</label>
              <select
                id="genre-select"
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="text-xs p-2 bg-stone-50 border border-stone-300 rounded-lg font-medium"
              >
                <option value="todos">Todos os Gêneros</option>
                <option value="Literatura Brasileira">Literatura Brasileira</option>
                <option value="Ficção Científica">Ficção Científica</option>
                <option value="Fantasia">Fantasia</option>
                <option value="História & Filosofia">História & Filosofia</option>
                <option value="HQ & Mangá">HQ & Mangá</option>
                <option value="Ciências & Natureza">Ciências & Natureza</option>
                <option value="Poesia">Poesia</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Capa / Título</th>
                    <th className="py-3 px-4">Gênero</th>
                    <th className="py-3 px-4">Localização Física</th>
                    <th className="py-3 px-4">Disponibilidade</th>
                    <th className="py-3 px-4">Avaliação Média</th>
                    <th className="py-3 px-4 text-right">Gerenciar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <BookCover book={book} size="sm" />
                        <div>
                          <span className="font-bold text-stone-900 block text-sm">
                            {book.title}
                          </span>
                          <span className="text-stone-500 block">
                            {book.author} ({book.publicationYear})
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            ISBN: {book.isbn}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-stone-700 font-medium">
                        {book.genre}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-stone-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          {book.shelfLocation}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-stone-900 tabular-nums">
                          {book.availableCopies} livres
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          de {book.totalCopies} exemplares
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono tabular-nums text-amber-700 font-bold">
                        ★ {book.rating.toFixed(1)} ({book.reviewCount} resenhas)
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenBookFormModal(book)}
                            title="Editar informações do livro"
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBook(book.id, book.title)}
                            title="Remover título"
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: CARTEIRINHAS DIGITAIS DOS ALUNOS */}
      {activeTab === 'carteirinhas' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Emissão de Carteirinhas Escolares do Leitor
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Gere e imprima credenciais com código de barras institucional e QR code para agilizar o atendimento no balcão.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => {
              const studentLoans = activeLoans.filter((l) => l.studentId === student.id);
              const hasOverdue = studentLoans.some((l) => getDaysDiff(l.dueDate) < 0);

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                      {student.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-stone-900 text-sm truncate">
                          {student.name}
                        </h4>
                        {hasOverdue ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            Pendência
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            Apto
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 truncate mt-0.5">
                        {student.grade}
                      </p>
                      <div className="text-[11px] text-stone-400 font-mono mt-1 tabular-nums">
                        Matrícula: {student.enrollmentNumber}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      {studentLoans.length} livros com o aluno
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenStudentCardModal(student)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <IdCard className="w-3.5 h-3.5 text-stone-600" />
                      <span>Ver Carteirinha</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 5: RELATÓRIOS E TOP LEITORES */}
      {activeTab === 'estatisticas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Leitores da Escola */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Ranking dos Alunos Mais Assíduos (Top Leitores)</span>
              </h3>
              <span className="text-xs text-stone-500">Bimestre Atual</span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Lucas Silva', grade: '2º Ano B', reads: 14, rank: '🥇 1º Lugar' },
                { name: 'Mariana Costa', grade: '3º Ano A', reads: 11, rank: '🥈 2º Lugar' },
                { name: 'Beatriz Lima', grade: '3º Ano B', reads: 8, rank: '🥉 3º Lugar' },
                { name: 'Thiago Oliveira', grade: '9º Ano A', reads: 7, rank: '4º Lugar' },
                { name: 'Isabela Rocha', grade: '2º Ano A', reads: 6, rank: '5º Lugar' },
              ].map((reader, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-stone-50/70 border border-stone-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-stone-600 w-16">
                      {reader.rank}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-stone-900 block">
                        {reader.name}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {reader.grade}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-stone-900">
                      {reader.reads}
                    </span>
                    <span className="text-[11px] text-stone-500 block">livros lidos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Obras Mais Retiradas da Escola */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Títulos Mais Procurados no Semestre</span>
              </h3>
              <span className="text-xs text-stone-500">Circulação Total</span>
            </div>

            <div className="space-y-3.5">
              {[
                { title: 'O Auto da Compadecida', author: 'Ariano Suassuna', percentage: 92, loans: 48 },
                { title: '1984', author: 'George Orwell', percentage: 84, loans: 42 },
                { title: 'Dom Casmurro', author: 'Machado de Assis', percentage: 76, loans: 38 },
                { title: 'Maus: A História de um Sobrevivente', author: 'Art Spiegelman', percentage: 70, loans: 35 },
                { title: 'Cosmos', author: 'Carl Sagan', percentage: 58, loans: 29 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-stone-800">{item.title}</span>
                    <span className="font-mono font-semibold text-stone-600">{item.loans} empréstimos</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
