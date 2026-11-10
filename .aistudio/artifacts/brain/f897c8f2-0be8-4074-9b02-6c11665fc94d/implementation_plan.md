# BiblioTech: Sistema Integrado de Biblioteca Escolar

Plataforma completa de gestão de acervo e portal de leitura para escolas, conectando estudantes e bibliotecária com foco em visibilidade total de circulação de livros e controle rigoroso de prazos e devoluções.

---

### Decisões Confirmadas e Alinhamentos

> [!IMPORTANT]
> **Decisões confirmadas com base no alinhamento e reforço do usuário:**
> - **Visão Total de Livros em Uso (Bibliotecária)**: Painel prioritário de circulação onde a bibliotecária visualiza em uma única tela todos os livros que estão atualmente emprestados, com quem cada exemplar está (aluno, matrícula, turma), a data exata da retirada e o prazo previsto de devolução.
> - **Central de Atrasos e Inadimplência**: Monitor específico para livros em atraso com badge de alerta, contagem exata de dias vencidos (ex.: `+4 dias de atraso`), dados do estudante para cobrança rápida e botão de ação direta para registrar baixa, renovar ou emitir aviso escolar.
> - **Alternância Rápida de Perfis**: Seletor no cabeçalho permitindo alternar instantaneamente entre a visão do Aluno e o painel administrativo da Bibliotecária.
> - **Portal do Aluno**: Catálogo com busca e filtros de gênero/disponibilidade, acompanhamento dos seus próprios prazos de devolução, solicitações de reserva e mural de resenhas dos estudantes.
> - **Emissor de Carteirinhas e Métricas**: Geração de crachá virtual de leitor com código e QR code, além de relatórios de livros mais lidos e ranking de leitores da escola.

---

### 1. Visão Geral e Conceito Central

- **O que faz**: A plataforma atua tanto como vitrine interativa de incentivo à leitura para os alunos quanto como estação de comando diária da bibliotecária, com ênfase máxima no rastreamento físico de cada exemplar que sai da biblioteca.
- **Público-Alvo**:
  - *Estudantes*: Pesquisam o acervo, consultam disponibilidade imediata na estante, reservam exemplares, acompanham a data de devolução dos seus livros e avaliam títulos para seus colegas.
  - *Bibliotecária*: Possui controle completo e instantâneo sobre quais livros estão nas mãos de quais alunos, quais estão prestes a vencer e quais estão em atraso, além de cadastrar novos títulos e emitir carteirinhas.
- **Valor Principal**: Transparência absoluta no controle do acervo físico escolar, garantindo que nenhum livro se perca ou fique esquecido com estudantes após o prazo.

---

### 2. Experiência do Usuário e Design Visual

#### Fluxo Prioritário da Bibliotecária (Circulação & Atrasos)
1. **Central de Circulação de Livros em Uso**:
   - Tabela/Grid de alta densidade com busca por nome do aluno, turma ou título da obra.
   - Filtros instantâneos por abas:
     - *Todos em Uso* (exibe a totalidade de livros fora da estante).
     - *Dentro do Prazo* (empréstimos regulares com contagem regressiva de dias restantes).
     - *Vencendo em Breve* (devolução prevista para hoje ou amanhã).
     - *Em Atraso (Urgente)* (exemplares com prazo expirado, ordenados do atraso mais antigo ao mais recente).
   - Cada linha exibe: Capa miniatura, Título, Aluno, Turma, Data de Retirada, Data Prevista, Status visual e Ações (Dar Baixa / Renovar / Emitir Lembrete).
2. **Painel de Controle de Atrasos & Contato com o Aluno**:
   - Card de alerta consolidado com contadores em destaque: Total de livros em atraso, quantidade de alunos com pendências e tempo médio de retenção.
   - Modal com ficha detalhada do aluno devedor (histórico de leituras, outros livros em posse, telefone/contato de responsáveis cadastrado e botão para registrar devolução com ou sem multa/suspensão).
3. **Mesa de Novos Empréstimos & Devoluções**:
   - Fluxo ágil: Selecionar o Aluno (por matrícula ou busca) -> Selecionar o Livro -> Prazo sugerido automático de 14 dias (ajustável) -> Concluir.
   - Baixa imediata em 1 clique com atualização instantânea do estoque na estante.
4. **Gestão do Acervo & Cadastro de Obras**:
   - Cadastro de novos livros (título, autor, gênero, ISBN, ano, localização na estante, sinopse e número de cópias físicas).
5. **Emissor de Carteirinhas Escolares**:
   - Emissão de crachás virtuais de leitor com foto, código de barras simulado, QR code e status da matrícula.
6. **Métricas e Relatórios**:
   - Ranking de leitores mais assíduos da escola, livros mais lidos por série escolar e taxa de devolução no prazo.

#### Fluxo do Aluno (Descoberta & Meus Empréstimos)
1. **Catálogo & Busca Inteligente**:
   - Busca em tempo real por título, autor ou palavra-chave na sinopse.
   - Filtros rápidos por gênero literário e disponibilidade na prateleira física.
2. **Minha Conta / Leituras Ativas**:
   - Cartões com os livros atualmente emprestados para o aluno logado.
   - Indicador claro de quantos dias restam para devolver (`"Faltam 4 dias para entregar"` ou aviso de atraso).
   - Botão para solicitar renovação de prazo caso o exemplar não esteja reservado por outro colega.
3. **Mural de Avaliações e Recomendações**:
   - Sistema de notas em estrelas (1 a 5) e resenhas escritas por colegas de turma.

#### Identidade Visual e Estilo
- **Aparência**: Editorial clássico com modernidade (estilo livraria contemporânea/campus universitário).
- **Cores (60-30-10)**:
  - Fundo neutro limpo (`bg-stone-50`/`bg-slate-50`), superfícies brancas com divisores sutis de 1px.
  - Azul petróleo profundo (`#1e3a5f` ou `indigo-900`) como tom institucional principal.
  - Verde esmeralda para livros em dia / disponíveis.
  - Âmbar para prazos próximos (< 2 dias).
  - Vermelho carmim (`#dc2626`) exclusivo para destacar livros em atraso.
- **Tipografia**:
  - Títulos elegantes com boa estrutura visual.
  - Corpo em sans-serif altamente legível (`Plus Jakarta Sans`).
  - Datas, prazos, matrículas e códigos em numerais tabulares alinhados (`font-mono tabular-nums`).

---

### 3. Decisões de Produto e Arquitetura

- **Gerenciamento de Estado e Persistência**:
  - Armazenamento em `localStorage` com dados ricos pré-configurados:
    - 14 livros escolares clássicos e modernos brasileiros e internacionais.
    - 8 estudantes simulados distribuídos entre turmas (6º ano ao 3º ano do Ensino Médio).
    - Empréstimos pré-populados contendo: livros regulares, livros com vencimento hoje e livros intencionalmente em atraso (com +3, +8 e +15 dias) para demonstrar plenamente a funcionalidade pedida.
    - Histórico de devoluções passadas e resenhas reais de estudantes.
  - Botão de conveniência no rodapé para reiniciar os dados caso o usuário queira resetar para a demonstração limpa.
- **Alternador de Perfil**:
  - Barra de topo com troca fácil entre:
    - *Bibliotecária*: Acesso à Mesa de Empréstimos, Lista de Livros em Uso, Painel de Atrasos, Acervo, Carteirinhas e Estatísticas.
    - *Aluno*: Acesso ao Catálogo, Detalhes da Obra, Minhas Leituras e Mural de Avaliações.

---

### 4. Arquitetura Técnica e Diagrama de Telas

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Top Bar & Perfil Switcher                            │
│  [ BiblioTech Escolar ] ── [ Perfil: Bibliotecária ⇄ Aluno ]          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌─────────────────────────────────┐       ┌──────────────────────────────────┐
│          VISÃO DO ALUNO         │       │       VISÃO DA BIBLIOTECÁRIA     │
│ ├─ Catálogo & Disponibilidade   │       │ ├─ ★ LIVROS EM USO (Circulação)  │
│ ├─ Minhas Leituras (Prazos)     │       │ ├─ ★ PAINEL DE ATRASOS & COBRANÇA│
│ ├─ Reserva de Exemplar          │       │ ├─ Novo Empréstimo & Devoluções  │
│ └─ Mural de Resenhas            │       │ ├─ Gestão de Acervo (Catálogo)   │
│                                 │       │ ├─ Emissor de Carteirinhas       │
│                                 │       │ └─ Relatórios e Top Leitores     │
└────────────────┬────────────────┘       └─────────────────┬────────────────┘
                 │                                          │
                 └──────────────────┬───────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Repositório Local (`src/services/storage.ts`)            │
│  - books: Book[]         - loans: Loan[] (status, dueDate, studentId)  │
│  - students: Student[]   - reviews: Review[]                           │
└────────────────────────────────────────────────────────────────────────┘
```

#### Modelo de Dados Detalhado para Controle de Empréstimos
```typescript
interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  studentEnrollment: string;
  studentContact: string; // telefone/e-mail para cobrança de atraso
  loanDate: string; // YYYY-MM-DD
  dueDate: string;  // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD quando devolvido
  status: 'active' | 'overdue' | 'returned';
  daysOverdue?: number; // calculado dinamicamente em relação à data atual
  renewalCount: number;
}
```

---

### Próximos Passos após Aprovação
1. Criar o serviço de armazenamento (`storage.ts`) com catálogo diversificado e empréstimos em andamento (incluindo casos claros de atraso para teste imediato).
2. Construir o painel da Bibliotecária com as abas de destaque: "Livros em Uso", "Atrasos Críticos", "Registrar Empréstimo", "Acervo", "Carteirinhas" e "Métricas".
3. Construir o portal do Aluno com catálogo, pesquisa em tempo real, "Minhas Leituras" com aviso de devolução e mural de resenhas.
4. Integrar o cabeçalho de troca rápida de perfil e testar todas as transições de estado.
5. Validar a compilação e ergonomia geral da aplicação.
