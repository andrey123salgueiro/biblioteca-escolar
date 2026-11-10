export type BookGenre =
  | 'Literatura Brasileira'
  | 'Ficção Científica'
  | 'Fantasia'
  | 'História & Filosofia'
  | 'HQ & Mangá'
  | 'Ciências & Natureza'
  | 'Poesia'
  | 'Aventura & Mistério';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: BookGenre;
  isbn: string;
  publicationYear: number;
  pages: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string; // ex: "Estante B · Prateleira 3"
  coverBg: string; // CSS gradient/color palette for visual book cover
  coverAccent: string;
  coverPattern?: 'classic' | 'geometric' | 'minimal' | 'modern';
  synopsis: string;
  rating: number; // ex: 4.8
  reviewCount: number;
}

export interface Student {
  id: string;
  name: string;
  enrollmentNumber: string; // Matrícula escolar
  grade: string; // Turma / Ano
  avatar: string; // Iniciais ou URL
  email: string;
  guardianContact: string; // Contato do responsável para cobranças
  status: 'regular' | 'pendente';
  joinedYear: number;
}

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookGenre: BookGenre;
  studentId: string;
  studentName: string;
  studentGrade: string;
  studentEnrollment: string;
  studentContact: string;
  loanDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD se já devolvido
  status: 'active' | 'returned';
  renewalCount: number;
  notes?: string;
}

export interface Review {
  id: string;
  bookId: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  rating: number; // 1 a 5
  title: string;
  comment: string;
  date: string;
  likes: number;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  requestDate: string;
  status: 'pending' | 'ready' | 'fulfilled' | 'cancelled';
}

export type UserRole = 'librarian' | 'student';
