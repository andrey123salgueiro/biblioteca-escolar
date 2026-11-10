import React from 'react';
import { UserRole, Student } from '../types/library';
import { BookOpen, ShieldCheck, GraduationCap, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  students: Student[];
  currentStudentId: string;
  onStudentChange: (studentId: string) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  students,
  currentStudentId,
  onStudentChange,
  onResetData,
}) => {
  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zona 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap">
                  BiblioTech
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-sm bg-stone-100 text-stone-700 border border-stone-200">
                  Escolar
                </span>
              </div>
              <p className="text-[11px] text-stone-600 hidden md:block">
                Colégio Estadual Santos Dumont
              </p>
            </div>
          </div>

          {/* Zona 2: Seletor de Perfil Ativo (Alternância Rápida) */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200/80">
            <button
              type="button"
              onClick={() => onRoleChange('librarian')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                currentRole === 'librarian'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Painel Bibliotecária</span>
            </button>

            <button
              type="button"
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                currentRole === 'student'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
              <span>Portal do Aluno</span>
            </button>
          </div>

          {/* Zona 3: Contexto do Usuário / Seletor de Aluno e Reset */}
          <div className="flex items-center gap-3 shrink-0">
            {currentRole === 'student' ? (
              <div className="flex items-center gap-2">
                <label htmlFor="student-selector" className="text-xs text-stone-500 hidden lg:inline">
                  Estudante ativo:
                </label>
                <select
                  id="student-selector"
                  value={currentStudentId}
                  onChange={(e) => onStudentChange(e.target.value)}
                  className="text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-md px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                >
                  {students.map((stud) => (
                    <option key={stud.id} value={stud.id}>
                      {stud.name} ({stud.grade.split('-')[0].trim()})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 text-xs text-stone-600">
                <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-300 text-amber-900 flex items-center justify-center font-bold text-[11px]">
                  HM
                </div>
                <div className="text-left">
                  <span className="font-semibold text-stone-900 block leading-tight">Profª Helena Morais</span>
                  <span className="text-[10px] text-stone-600">Bibliotecária Chefe</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={onResetData}
              title="Restaurar dados de demonstração (empréstimos, atrasos e acervo)"
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md border border-stone-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
