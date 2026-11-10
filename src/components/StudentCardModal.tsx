import React from 'react';
import { Student } from '../types/library';
import { X, Printer, BookOpen, QrCode } from 'lucide-react';

interface StudentCardModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-stone-800" />
            <h3 className="font-semibold text-stone-900 text-sm">
              Carteirinha Digital do Leitor
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo do Crachá / Carteirinha */}
        <div className="p-6">
          <div className="rounded-xl border border-stone-300 bg-gradient-to-br from-stone-900 via-stone-800 to-slate-900 text-white p-5 shadow-lg relative overflow-hidden">
            {/* Faixa decorativa sutil */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

            {/* Cabeçalho do Crachá */}
            <div className="flex items-start justify-between border-b border-stone-700/60 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 block">
                  Biblioteca Escolar Santos Dumont
                </span>
                <h4 className="font-bold text-sm tracking-tight text-white">
                  Credencial de Acesso & Empréstimos
                </h4>
              </div>
              <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-amber-300" />
              </div>
            </div>

            {/* Dados do Estudante */}
            <div className="flex gap-4 items-center">
              <div className="w-16 h-20 rounded-lg bg-stone-700 border border-stone-600 flex flex-col items-center justify-center text-center p-1 shrink-0">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-sm">
                  {student.avatar}
                </div>
                <span className="text-[9px] text-stone-400 mt-1 uppercase font-semibold">
                  Foto
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-stone-400 block">Nome do Aluno</span>
                <p className="font-bold text-base text-white truncate leading-tight">
                  {student.name}
                </p>
                <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Matrícula</span>
                    <span className="font-mono font-semibold text-amber-300 tabular-nums">
                      {student.enrollmentNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Turma</span>
                    <span className="font-medium text-stone-200 truncate block">
                      {student.grade.split('-')[0].trim()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé da Carteirinha: Código de Barras e QR Code Simulado */}
            <div className="mt-5 pt-3 border-t border-stone-700/60 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-stone-400 block uppercase tracking-wider">
                  Código de Barras Escolar
                </span>
                {/* Barras SVG geradas baseadas na matrícula */}
                <svg className="h-6 w-36 mt-0.5" viewBox="0 0 120 20">
                  <rect x="0" y="0" width="2" height="20" fill="#fff" />
                  <rect x="4" y="0" width="1" height="20" fill="#fff" />
                  <rect x="7" y="0" width="3" height="20" fill="#fff" />
                  <rect x="12" y="0" width="1" height="20" fill="#fff" />
                  <rect x="15" y="0" width="2" height="20" fill="#fff" />
                  <rect x="19" y="0" width="4" height="20" fill="#fff" />
                  <rect x="25" y="0" width="1" height="20" fill="#fff" />
                  <rect x="28" y="0" width="3" height="20" fill="#fff" />
                  <rect x="33" y="0" width="2" height="20" fill="#fff" />
                  <rect x="37" y="0" width="1" height="20" fill="#fff" />
                  <rect x="40" y="0" width="4" height="20" fill="#fff" />
                  <rect x="46" y="0" width="2" height="20" fill="#fff" />
                  <rect x="50" y="0" width="1" height="20" fill="#fff" />
                  <rect x="53" y="0" width="3" height="20" fill="#fff" />
                  <rect x="58" y="0" width="1" height="20" fill="#fff" />
                  <rect x="61" y="0" width="2" height="20" fill="#fff" />
                  <rect x="65" y="0" width="4" height="20" fill="#fff" />
                  <rect x="71" y="0" width="2" height="20" fill="#fff" />
                  <rect x="75" y="0" width="1" height="20" fill="#fff" />
                  <rect x="78" y="0" width="3" height="20" fill="#fff" />
                  <rect x="83" y="0" width="2" height="20" fill="#fff" />
                  <rect x="87" y="0" width="4" height="20" fill="#fff" />
                  <rect x="93" y="0" width="1" height="20" fill="#fff" />
                  <rect x="96" y="0" width="3" height="20" fill="#fff" />
                  <rect x="101" y="0" width="2" height="20" fill="#fff" />
                  <rect x="105" y="0" width="1" height="20" fill="#fff" />
                  <rect x="108" y="0" width="2" height="20" fill="#fff" />
                </svg>
              </div>

              <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-md border border-white/10">
                <QrCode className="w-8 h-8 text-white opacity-90" />
                <div className="text-[9px] text-stone-300">
                  <span className="block font-bold">Válido até</span>
                  <span className="font-mono">12/2026</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-stone-500 text-center">
            Apresente este documento digital no balcão da biblioteca para retirar ou devolver livros físicos.
          </p>
        </div>

        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Carteirinha</span>
          </button>
        </div>
      </div>
    </div>
  );
};
