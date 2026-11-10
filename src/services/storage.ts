import { Book, Student, Loan, Review, Reservation } from '../types/library';

const STORAGE_KEYS = {
  BOOKS: 'bibliotech_books_v1',
  STUDENTS: 'bibliotech_students_v1',
  LOANS: 'bibliotech_loans_v1',
  REVIEWS: 'bibliotech_reviews_v1',
  RESERVATIONS: 'bibliotech_reservations_v1',
  INITIALIZED: 'bibliotech_initialized_v1',
};

// Formata uma data somando/subtraindo dias a partir de hoje
export function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function getDaysDiff(dueDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dueDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Sementes iniciais
const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: 'Literatura Brasileira',
    isbn: '978-85-359-1066-3',
    publicationYear: 1899,
    pages: 256,
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'Estante A · Prateleira 2',
    coverBg: 'from-amber-900 to-stone-900',
    coverAccent: '#f59e0b',
    coverPattern: 'classic',
    synopsis: 'A clássica narrativa em primeira pessoa de Bento Santiago sobre suas memórias da juventude e sua obsessão enigmática pelos olhos de ressaca de Capitu.',
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: 'book-2',
    title: 'A Hora da Estrela',
    author: 'Clarice Lispector',
    genre: 'Literatura Brasileira',
    isbn: '978-85-325-0812-4',
    publicationYear: 1977,
    pages: 96,
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'Estante A · Prateleira 3',
    coverBg: 'from-rose-950 to-stone-900',
    coverAccent: '#fb7185',
    coverPattern: 'minimal',
    synopsis: 'A história dolorosa e comovente de Macabéa, uma jovem alagoana solitária no Rio de Janeiro, narrada pelo escritor fictício Rodrigo S.M.',
    rating: 4.9,
    reviewCount: 31,
  },
  {
    id: 'book-3',
    title: '1984',
    author: 'George Orwell',
    genre: 'Ficção Científica',
    isbn: '978-85-359-1484-9',
    publicationYear: 1949,
    pages: 336,
    totalCopies: 6,
    availableCopies: 1,
    shelfLocation: 'Estante B · Prateleira 1',
    coverBg: 'from-sky-950 to-slate-900',
    coverAccent: '#38bdf8',
    coverPattern: 'geometric',
    synopsis: 'O Grande Irmão está sempre de olho em você. A distopia clássica que aborda a manipulação governamental, vigilância de massa e a perda da liberdade de pensamento.',
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: 'book-4',
    title: 'O Auto da Compadecida',
    author: 'Ariano Suassuna',
    genre: 'Literatura Brasileira',
    isbn: '978-85-209-1708-4',
    publicationYear: 1955,
    pages: 208,
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'Estante A · Prateleira 4',
    coverBg: 'from-yellow-900 to-amber-950',
    coverAccent: '#fbbf24',
    coverPattern: 'classic',
    synopsis: 'As artimanhas e aventuras impagáveis de João Grilo e Chicó no sertão nordestino, misturando elementos do cordel, moral popular e o julgamento final perante Nossa Senhora.',
    rating: 5.0,
    reviewCount: 56,
  },
  {
    id: 'book-5',
    title: 'Cosmos',
    author: 'Carl Sagan',
    genre: 'Ciências & Natureza',
    isbn: '978-85-359-3011-1',
    publicationYear: 1980,
    pages: 400,
    totalCopies: 3,
    availableCopies: 1,
    shelfLocation: 'Estante D · Prateleira 2',
    coverBg: 'from-indigo-950 to-purple-950',
    coverAccent: '#818cf8',
    coverPattern: 'modern',
    synopsis: 'Uma jornada transcendental através de 15 bilhões de anos de evolução cósmica e da busca incansável da humanidade pelo conhecimento e sua posição no universo.',
    rating: 4.9,
    reviewCount: 19,
  },
  {
    id: 'book-6',
    title: 'Capitães da Areia',
    author: 'Jorge Amado',
    genre: 'Literatura Brasileira',
    isbn: '978-85-359-1406-1',
    publicationYear: 1937,
    pages: 280,
    totalCopies: 4,
    availableCopies: 4,
    shelfLocation: 'Estante A · Prateleira 1',
    coverBg: 'from-amber-950 to-orange-950',
    coverAccent: '#f97316',
    coverPattern: 'classic',
    synopsis: 'A vida de um bando de meninos de rua em Salvador, Bahia, que habitam um trapiche abandonado e lutam pela sobrevivência e pela liberdade.',
    rating: 4.7,
    reviewCount: 18,
  },
  {
    id: 'book-7',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    genre: 'Ficção Científica',
    isbn: '978-85-250-5224-7',
    publicationYear: 1953,
    pages: 216,
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'Estante B · Prateleira 2',
    coverBg: 'from-red-950 to-stone-900',
    coverAccent: '#ef4444',
    coverPattern: 'geometric',
    synopsis: 'Uma sociedade totalitária do futuro onde os livros são proibidos e os bombeiros têm a função oficial de queimar qualquer exemplar remanescente.',
    rating: 4.8,
    reviewCount: 29,
  },
  {
    id: 'book-8',
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasia',
    isbn: '978-85-950-8474-2',
    publicationYear: 1937,
    pages: 336,
    totalCopies: 5,
    availableCopies: 3,
    shelfLocation: 'Estante C · Prateleira 1',
    coverBg: 'from-emerald-950 to-teal-950',
    coverAccent: '#34d399',
    coverPattern: 'modern',
    synopsis: 'Bilbo Bolseiro vive uma vida pacata e confortável em sua toca no Condado, até receber a visita inesperada do mago Gandalf e de treze anões corajosos.',
    rating: 4.9,
    reviewCount: 45,
  },
  {
    id: 'book-9',
    title: 'Olhos D\'Água',
    author: 'Conceição Evaristo',
    genre: 'Literatura Brasileira',
    isbn: '978-85-792-0182-0',
    publicationYear: 2014,
    pages: 116,
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'Estante A · Prateleira 5',
    coverBg: 'from-cyan-950 to-slate-900',
    coverAccent: '#22d3ee',
    coverPattern: 'minimal',
    synopsis: 'Contos potentes e de profunda escrevivência sobre a violência urbana, maternidade, resistência e ancestralidade da mulher e da população afro-brasileira.',
    rating: 5.0,
    reviewCount: 22,
  },
  {
    id: 'book-10',
    title: 'Maus: A História de um Sobrevivente',
    author: 'Art Spiegelman',
    genre: 'HQ & Mangá',
    isbn: '978-85-359-0628-8',
    publicationYear: 1991,
    pages: 296,
    totalCopies: 3,
    availableCopies: 0,
    shelfLocation: 'Estante E · Prateleira 1',
    coverBg: 'from-stone-900 to-zinc-950',
    coverAccent: '#a1a1aa',
    coverPattern: 'geometric',
    synopsis: 'O clássico absoluto dos quadrinhos e vencedor do Prêmio Pulitzer. Retrata a trajetória verídica de Vladek Spiegelman, judeu polonês sobrevivente de Auschwitz.',
    rating: 5.0,
    reviewCount: 38,
  },
  {
    id: 'book-11',
    title: 'Sapiens: Uma Breve História da Humanidade',
    author: 'Yuval Noah Harari',
    genre: 'História & Filosofia',
    isbn: '978-85-254-3218-6',
    publicationYear: 2014,
    pages: 464,
    totalCopies: 4,
    availableCopies: 2,
    shelfLocation: 'Estante D · Prateleira 1',
    coverBg: 'from-amber-950 to-stone-900',
    coverAccent: '#fbbf24',
    coverPattern: 'modern',
    synopsis: 'Como uma espécie insignificante de primatas conseguiu se tornar a senhora absoluta do planeta Terra? Uma análise instigante sobre biologia, cultura e poder.',
    rating: 4.8,
    reviewCount: 27,
  },
  {
    id: 'book-12',
    title: 'Alguma Poesia',
    author: 'Carlos Drummond de Andrade',
    genre: 'Poesia',
    isbn: '978-85-359-2244-8',
    publicationYear: 1930,
    pages: 112,
    totalCopies: 3,
    availableCopies: 3,
    shelfLocation: 'Estante F · Prateleira 1',
    coverBg: 'from-slate-900 to-stone-900',
    coverAccent: '#94a3b8',
    coverPattern: 'minimal',
    synopsis: 'Obra de estreia de Drummond que revolucionou a lírica brasileira moderna, contendo poemas inesquecíveis como "No meio do caminho" e "Poema de sete faces".',
    rating: 4.9,
    reviewCount: 15,
  },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    name: 'Lucas Silva',
    enrollmentNumber: '2024-0412',
    grade: '2º Ano B - Ensino Médio',
    avatar: 'LS',
    email: 'lucas.silva@escola.edu.br',
    guardianContact: '(11) 98123-4567 (Mãe: Patrícia)',
    status: 'regular',
    joinedYear: 2023,
  },
  {
    id: 'stud-2',
    name: 'Mariana Costa',
    enrollmentNumber: '2023-0189',
    grade: '3º Ano A - Ensino Médio',
    avatar: 'MC',
    email: 'mariana.costa@escola.edu.br',
    guardianContact: '(11) 97234-5678 (Pai: Roberto)',
    status: 'regular',
    joinedYear: 2022,
  },
  {
    id: 'stud-3',
    name: 'Gabriel Santos',
    enrollmentNumber: '2024-0551',
    grade: '1º Ano C - Ensino Médio',
    avatar: 'GS',
    email: 'gabriel.santos@escola.edu.br',
    guardianContact: '(11) 99876-1122 (Mãe: Fernanda)',
    status: 'pendente', // Possui atraso
    joinedYear: 2024,
  },
  {
    id: 'stud-4',
    name: 'Beatriz Lima',
    enrollmentNumber: '2022-0094',
    grade: '3º Ano B - Ensino Médio',
    avatar: 'BL',
    email: 'beatriz.lima@escola.edu.br',
    guardianContact: '(11) 98456-9988 (Pai: Carlos)',
    status: 'pendente', // Possui atraso crítico
    joinedYear: 2022,
  },
  {
    id: 'stud-5',
    name: 'Thiago Oliveira',
    enrollmentNumber: '2024-0732',
    grade: '9º Ano A - Fund. II',
    avatar: 'TO',
    email: 'thiago.oliveira@escola.edu.br',
    guardianContact: '(11) 97112-3344 (Tia: Regina)',
    status: 'regular',
    joinedYear: 2024,
  },
  {
    id: 'stud-6',
    name: 'Isabela Rocha',
    enrollmentNumber: '2023-0245',
    grade: '2º Ano A - Ensino Médio',
    avatar: 'IR',
    email: 'isabela.rocha@escola.edu.br',
    guardianContact: '(11) 98899-7766 (Mãe: Adriana)',
    status: 'regular',
    joinedYear: 2023,
  },
];

const INITIAL_LOANS: Loan[] = [
  // 1. Empréstimo em ATRASO CRÍTICO (+12 dias)
  {
    id: 'loan-1',
    bookId: 'book-1',
    bookTitle: 'Dom Casmurro',
    bookAuthor: 'Machado de Assis',
    bookGenre: 'Literatura Brasileira',
    studentId: 'stud-4',
    studentName: 'Beatriz Lima',
    studentGrade: '3º Ano B - Ensino Médio',
    studentEnrollment: '2022-0094',
    studentContact: '(11) 98456-9988 (Pai: Carlos)',
    loanDate: offsetDate(-26),
    dueDate: offsetDate(-12),
    status: 'active',
    renewalCount: 0,
    notes: 'Aviso de cobrança enviado para os pais em 14/10.',
  },
  // 2. Empréstimo em ATRASO MODERADO (+5 dias)
  {
    id: 'loan-2',
    bookId: 'book-3',
    bookTitle: '1984',
    bookAuthor: 'George Orwell',
    bookGenre: 'Ficção Científica',
    studentId: 'stud-3',
    studentName: 'Gabriel Santos',
    studentGrade: '1º Ano C - Ensino Médio',
    studentEnrollment: '2024-0551',
    studentContact: '(11) 99876-1122 (Mãe: Fernanda)',
    loanDate: offsetDate(-19),
    dueDate: offsetDate(-5),
    status: 'active',
    renewalCount: 0,
  },
  // 3. Empréstimo VENCE HOJE (0 dias)
  {
    id: 'loan-3',
    bookId: 'book-4',
    bookTitle: 'O Auto da Compadecida',
    bookAuthor: 'Ariano Suassuna',
    bookGenre: 'Literatura Brasileira',
    studentId: 'stud-1',
    studentName: 'Lucas Silva',
    studentGrade: '2º Ano B - Ensino Médio',
    studentEnrollment: '2024-0412',
    studentContact: '(11) 98123-4567 (Mãe: Patrícia)',
    loanDate: offsetDate(-14),
    dueDate: offsetDate(0),
    status: 'active',
    renewalCount: 0,
  },
  // 4. Empréstimo REGULAR (restam 6 dias)
  {
    id: 'loan-4',
    bookId: 'book-2',
    bookTitle: 'A Hora da Estrela',
    bookAuthor: 'Clarice Lispector',
    bookGenre: 'Literatura Brasileira',
    studentId: 'stud-2',
    studentName: 'Mariana Costa',
    studentGrade: '3º Ano A - Ensino Médio',
    studentEnrollment: '2023-0189',
    studentContact: '(11) 97234-5678 (Pai: Roberto)',
    loanDate: offsetDate(-8),
    dueDate: offsetDate(6),
    status: 'active',
    renewalCount: 0,
  },
  // 5. Empréstimo REGULAR (restam 10 dias)
  {
    id: 'loan-5',
    bookId: 'book-5',
    bookTitle: 'Cosmos',
    bookAuthor: 'Carl Sagan',
    bookGenre: 'Ciências & Natureza',
    studentId: 'stud-5',
    studentName: 'Thiago Oliveira',
    studentGrade: '9º Ano A - Fund. II',
    studentEnrollment: '2024-0732',
    studentContact: '(11) 97112-3344 (Tia: Regina)',
    loanDate: offsetDate(-4),
    dueDate: offsetDate(10),
    status: 'active',
    renewalCount: 0,
  },
  // 6. Empréstimo REGULAR (restam 12 dias)
  {
    id: 'loan-6',
    bookId: 'book-10',
    bookTitle: 'Maus: A História de um Sobrevivente',
    bookAuthor: 'Art Spiegelman',
    bookGenre: 'HQ & Mangá',
    studentId: 'stud-6',
    studentName: 'Isabela Rocha',
    studentGrade: '2º Ano A - Ensino Médio',
    studentEnrollment: '2023-0245',
    studentContact: '(11) 98899-7766 (Mãe: Adriana)',
    loanDate: offsetDate(-2),
    dueDate: offsetDate(12),
    status: 'active',
    renewalCount: 0,
  },
  // 7. Livros já devolvidos no histórico
  {
    id: 'loan-7',
    bookId: 'book-7',
    bookTitle: 'Fahrenheit 451',
    bookAuthor: 'Ray Bradbury',
    bookGenre: 'Ficção Científica',
    studentId: 'stud-1',
    studentName: 'Lucas Silva',
    studentGrade: '2º Ano B - Ensino Médio',
    studentEnrollment: '2024-0412',
    studentContact: '(11) 98123-4567 (Mãe: Patrícia)',
    loanDate: offsetDate(-30),
    dueDate: offsetDate(-16),
    returnDate: offsetDate(-18),
    status: 'returned',
    renewalCount: 0,
  },
  {
    id: 'loan-8',
    bookId: 'book-8',
    bookTitle: 'O Hobbit',
    bookAuthor: 'J.R.R. Tolkien',
    bookGenre: 'Fantasia',
    studentId: 'stud-2',
    studentName: 'Mariana Costa',
    studentGrade: '3º Ano A - Ensino Médio',
    studentEnrollment: '2023-0189',
    studentContact: '(11) 97234-5678 (Pai: Roberto)',
    loanDate: offsetDate(-45),
    dueDate: offsetDate(-31),
    returnDate: offsetDate(-32),
    status: 'returned',
    renewalCount: 1,
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookId: 'book-4',
    studentId: 'stud-1',
    studentName: 'Lucas Silva',
    studentGrade: '2º Ano B',
    rating: 5,
    title: 'A melhor leitura do ano escolar!',
    comment: 'Ri muito com as espertezas do João Grilo e do Chicó. A leitura é muito rápida e o vocabulário sertanejo dá um charme único. Recomendo para todo mundo da turma!',
    date: offsetDate(-5),
    likes: 14,
  },
  {
    id: 'rev-2',
    bookId: 'book-3',
    studentId: 'stud-2',
    studentName: 'Mariana Costa',
    studentGrade: '3º Ano A',
    rating: 5,
    title: 'Assustadoramente atual e reflexivo',
    comment: 'Li para a aula de sociologia e fiquei chocada com o conceito do Ministério da Verdade e a novilíngua. Um livro indispensável para entender o mundo de hoje.',
    date: offsetDate(-10),
    likes: 21,
  },
  {
    id: 'rev-3',
    bookId: 'book-1',
    studentId: 'stud-6',
    studentName: 'Isabela Rocha',
    studentGrade: '2º Ano A',
    rating: 4,
    title: 'Traiu ou não traiu? O debate eterno',
    comment: 'A ironia fina de Bentinho te faz duvidar de tudo. Você não consegue parar até a última página para tentar desvendar a Capitu.',
    date: offsetDate(-15),
    likes: 18,
  },
  {
    id: 'rev-4',
    bookId: 'book-9',
    studentId: 'stud-4',
    studentName: 'Beatriz Lima',
    studentGrade: '3º Ano B',
    rating: 5,
    title: 'Emocionante e necessário',
    comment: 'Conceição Evaristo escreve com a alma. O conto que dá nome ao livro me fez chorar. Deveria ser leitura obrigatória em toda a escola.',
    date: offsetDate(-12),
    likes: 26,
  },
];

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    bookId: 'book-10',
    bookTitle: 'Maus: A História de um Sobrevivente',
    studentId: 'stud-1',
    studentName: 'Lucas Silva',
    studentGrade: '2º Ano B',
    requestDate: offsetDate(-1),
    status: 'pending',
  },
];

export const StorageService = {
  initialize() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetToDefaults();
    }
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOANS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  // Livros
  getBooks(): Book[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
      return data ? JSON.parse(data) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  },

  saveBook(book: Book) {
    const books = this.getBooks();
    const existingIndex = books.findIndex((b) => b.id === book.id);
    if (existingIndex >= 0) {
      books[existingIndex] = book;
    } else {
      books.unshift(book);
    }
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  },

  deleteBook(bookId: string) {
    const books = this.getBooks().filter((b) => b.id !== bookId);
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  },

  // Alunos
  getStudents(): Student[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudent(student: Student) {
    const students = this.getStudents();
    const idx = students.findIndex((s) => s.id === student.id);
    if (idx >= 0) {
      students[idx] = student;
    } else {
      students.unshift(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  // Empréstimos
  getLoans(): Loan[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOANS);
      return data ? JSON.parse(data) : INITIAL_LOANS;
    } catch {
      return INITIAL_LOANS;
    }
  },

  createLoan(params: {
    bookId: string;
    studentId: string;
    dueDays?: number;
    notes?: string;
  }): { success: boolean; error?: string; loan?: Loan } {
    const books = this.getBooks();
    const students = this.getStudents();
    const book = books.find((b) => b.id === params.bookId);
    const student = students.find((s) => s.id === params.studentId);

    if (!book) return { success: false, error: 'Livro não encontrado' };
    if (!student) return { success: false, error: 'Aluno não encontrado' };
    if (book.availableCopies <= 0) {
      return { success: false, error: 'Não há exemplares físicos disponíveis no momento.' };
    }

    const todayStr = offsetDate(0);
    const dueStr = offsetDate(params.dueDays || 14);

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookGenre: book.genre,
      studentId: student.id,
      studentName: student.name,
      studentGrade: student.grade,
      studentEnrollment: student.enrollmentNumber,
      studentContact: student.guardianContact,
      loanDate: todayStr,
      dueDate: dueStr,
      status: 'active',
      renewalCount: 0,
      notes: params.notes,
    };

    // Atualiza cópias do livro
    book.availableCopies = Math.max(0, book.availableCopies - 1);
    this.saveBook(book);

    const loans = this.getLoans();
    loans.unshift(newLoan);
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

    return { success: true, loan: newLoan };
  },

  returnLoan(loanId: string): boolean {
    const loans = this.getLoans();
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || loan.status === 'returned') return false;

    loan.status = 'returned';
    loan.returnDate = offsetDate(0);

    // Devolve o exemplar ao estoque
    const books = this.getBooks();
    const book = books.find((b) => b.id === loan.bookId);
    if (book) {
      book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
      this.saveBook(book);
    }

    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

    // Atualiza status do aluno se não tiver mais atrasos
    this.recalculateStudentStatus(loan.studentId);

    return true;
  },

  renewLoan(loanId: string, additionalDays: number = 7): { success: boolean; error?: string } {
    const loans = this.getLoans();
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || loan.status === 'returned') {
      return { success: false, error: 'Empréstimo inativo.' };
    }

    // Calcula nova data somando os dias a partir da data atual ou do vencimento
    const currentDiff = getDaysDiff(loan.dueDate);
    const baseDays = currentDiff < 0 ? 0 : currentDiff;
    loan.dueDate = offsetDate(baseDays + additionalDays);
    loan.renewalCount += 1;

    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
    this.recalculateStudentStatus(loan.studentId);
    return { success: true };
  },

  recalculateStudentStatus(studentId: string) {
    const loans = this.getLoans().filter((l) => l.studentId === studentId && l.status === 'active');
    const hasOverdue = loans.some((l) => getDaysDiff(l.dueDate) < 0);
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId);
    if (student) {
      student.status = hasOverdue ? 'pendente' : 'regular';
      this.saveStudent(student);
    }
  },

  // Resenhas
  getReviews(): Review[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  addReview(review: Omit<Review, 'id' | 'date' | 'likes'>): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: offsetDate(0),
      likes: 0,
    };
    reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    // Recalcula avaliação média do livro
    const bookReviews = reviews.filter((r) => r.bookId === review.bookId);
    const avg = bookReviews.reduce((acc, curr) => acc + curr.rating, 0) / bookReviews.length;
    const books = this.getBooks();
    const book = books.find((b) => b.id === review.bookId);
    if (book) {
      book.rating = parseFloat(avg.toFixed(1));
      book.reviewCount = bookReviews.length;
      this.saveBook(book);
    }

    return newReview;
  },

  likeReview(reviewId: string) {
    const reviews = this.getReviews();
    const rev = reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.likes += 1;
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    }
  },

  // Reservas
  getReservations(): Reservation[] {
    this.initialize();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      return data ? JSON.parse(data) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  },

  createReservation(bookId: string, studentId: string): { success: boolean; error?: string } {
    const reservations = this.getReservations();
    const books = this.getBooks();
    const students = this.getStudents();
    const book = books.find((b) => b.id === bookId);
    const student = students.find((s) => s.id === studentId);

    if (!book || !student) return { success: false, error: 'Dados inválidos' };

    const alreadyReserved = reservations.some(
      (r) => r.bookId === bookId && r.studentId === studentId && r.status === 'pending'
    );
    if (alreadyReserved) {
      return { success: false, error: 'Você já possui uma reserva ativa para esta obra.' };
    }

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      bookId,
      bookTitle: book.title,
      studentId,
      studentName: student.name,
      studentGrade: student.grade,
      requestDate: offsetDate(0),
      status: 'pending',
    };

    reservations.unshift(newRes);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    return { success: true };
  },

  cancelReservation(resId: string) {
    const reservations = this.getReservations().map((r) =>
      r.id === resId ? { ...r, status: 'cancelled' as const } : r
    );
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  },
};
