import React, { useState } from 'react';
import { Loan } from '../types/library';
import { formatDateBR, getDaysDiff } from '../services/storage';
import { X, Send, Copy, Check, AlertTriangle, Phone, Mail } from 'lucide-react';

interface NoticeModalProps {
  loan: Loan | null;
  onClose: () => void;
  onRecordContact: (loanId: string, note: string) => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ loan, onClose, onRecordContact }) => {
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [customNote, setCustomNote] = useState('');

  if (!loan) return null;

  const daysLate = Math.abs(getDaysDiff(loan.dueDate));

  const generatedMessage = `Prezados responsáveis e estudante ${loan.studentName} (${loan.studentGrade}),

Informamos que o livro "${loan.bookTitle}", retirado na Biblioteca do Colégio Estadual Santos Dumont no dia ${formatDateBR(
    loan.loanDate
  )}, encontra-se com prazo de devolução vencido há ${daysLate} dias (vencimento em ${formatDateBR(
    loan.dueDate
  )}).

Pedimos a gentileza de comparecer ao balcão da biblioteca para devolução ou renovação do exemplar, permitindo que outros colegas da escola também tenham acesso à leitura.

Em caso de dúvidas, procure a Profª Helena Morais na Biblioteca.
Colégio Estadual Santos Dumont`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSimulated = () => {
    setSentSuccess(true);
    onRecordContact(loan.id, `Notificação escolar enviada em ${new Date().toLocaleDateString('pt-BR')}.`);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-rose-50/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Aviso de Devolução em Atraso
              </h3>
              <p className="text-xs text-rose-700 font-medium">
                Livro vencido há {daysLate} dias
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Card Resumo do Empréstimo */}
          <div className="bg-stone-50 rounded-lg p-3.5 border border-stone-200 text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Obra em atraso:</span>
              <span className="font-bold text-stone-900">{loan.bookTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Aluno responsável:</span>
              <span className="font-semibold text-stone-800">{loan.studentName} ({loan.studentGrade})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Matrícula:</span>
              <span className="font-mono text-stone-700 tabular-nums">{loan.studentEnrollment}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-stone-200">
              <span className="text-stone-500 flex items-center gap-1">
                <Phone className="w-3 h-3 text-stone-400" />
                Contato do responsável:
              </span>
              <span className="font-medium text-stone-800">{loan.studentContact}</span>
            </div>
          </div>

          {/* Texto gerado para envio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Texto do comunicado escolar sugerido:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={generatedMessage}
              className="w-full text-xs font-sans p-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-hidden resize-none leading-relaxed"
            />
          </div>

          {/* Anotação interna opcional da bibliotecária */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Registro interno da biblioteca (opcional):
            </label>
            <input
              type="text"
              placeholder="Ex: Mãe avisou que o aluno trará amanhã."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {sentSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Notificação registrada com sucesso no prontuário do aluno!</span>
            </div>
          )}
        </div>

        <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendSimulated}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-700 text-white rounded-lg text-xs font-semibold hover:bg-rose-800 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Emitir Aviso & Registrar Contato</span>
          </button>
        </div>
      </div>
    </div>
  );
};
