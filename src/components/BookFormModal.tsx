import React, { useState } from 'react';
import { Book, BookGenre } from '../types/library';
import { StorageService } from '../services/storage';
import { X, Check, BookPlus } from 'lucide-react';

interface BookFormModalProps {
  bookToEdit?: Book | null;
  onClose: () => void;
  onSuccess: () => void;
}

const GENRES: BookGenre[] = [
  'Literatura Brasileira',
  'Ficção Científica',
  'Fantasia',
  'História & Filosofia',
  'HQ & Mangá',
  'Ciências & Natureza',
  'Poesia',
  'Aventura & Mistério',
];

export const BookFormModal: React.FC<BookFormModalProps> = ({
  bookToEdit,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState(bookToEdit?.title || '');
  const [author, setAuthor] = useState(bookToEdit?.author || '');
  const [genre, setGenre] = useState<BookGenre>(bookToEdit?.genre || 'Literatura Brasileira');
  const [isbn, setIsbn] = useState(bookToEdit?.isbn || '978-85-');
  const [publicationYear, setPublicationYear] = useState(bookToEdit?.publicationYear || 2020);
  const [pages, setPages] = useState(bookToEdit?.pages || 200);
  const [totalCopies, setTotalCopies] = useState(bookToEdit?.totalCopies || 3);
  const [shelfLocation, setShelfLocation] = useState(bookToEdit?.shelfLocation || 'Estante A · Prateleira 1');
  const [synopsis, setSynopsis] = useState(bookToEdit?.synopsis || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const newBook: Book = {
      id: bookToEdit ? bookToEdit.id : `book-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      genre,
      isbn: isbn.trim(),
      publicationYear: Number(publicationYear),
      pages: Number(pages),
      totalCopies: Number(totalCopies),
      availableCopies: bookToEdit
        ? Math.max(0, bookToEdit.availableCopies + (Number(totalCopies) - bookToEdit.totalCopies))
        : Number(totalCopies),
      shelfLocation: shelfLocation.trim(),
      coverBg: bookToEdit ? bookToEdit.coverBg : 'from-indigo-950 to-slate-900',
      coverAccent: bookToEdit ? bookToEdit.coverAccent : '#818cf8',
      synopsis: synopsis.trim() || 'Obra literária disponível para consulta e empréstimo na biblioteca escolar.',
      rating: bookToEdit ? bookToEdit.rating : 5.0,
      reviewCount: bookToEdit ? bookToEdit.reviewCount : 0,
    };

    StorageService.saveBook(newBook);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <BookPlus className="w-5 h-5 text-stone-900" />
            <h3 className="font-bold text-stone-900 text-sm">
              {bookToEdit ? 'Editar Obra do Acervo' : 'Cadastrar Novo Livro no Acervo'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Título da Obra:
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Grande Sertão: Veredas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Autor / Escritor:
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Guimarães Rosa"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400 font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Gênero / Categoria:
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as BookGenre)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                ISBN:
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Ano de Publ.:
              </label>
              <input
                type="number"
                value={publicationYear}
                onChange={(e) => setPublicationYear(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Total de Cópias:
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={totalCopies}
                onChange={(e) => setTotalCopies(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Localização Física na Biblioteca (Estante / Prateleira):
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Estante B · Prateleira 3"
              value={shelfLocation}
              onChange={(e) => setShelfLocation(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Sinopse / Resumo:
            </label>
            <textarea
              rows={3}
              placeholder="Breve descrição da obra para ajudar os estudantes na escolha..."
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-hidden resize-none leading-relaxed"
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
              <span>{bookToEdit ? 'Salvar Alterações' : 'Cadastrar Livro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
