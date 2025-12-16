# PRD — Sistema de Atendimento para Aproveitamento de Cargas Horárias Complementares  
Curso: Ciência da Computação

---

## 1. Project Overview

O projeto consiste no desenvolvimento de um **sistema digital de atendimento ao graduando** para submissão e análise de **certificados de cargas horárias complementares** no âmbito do colegiado do curso de Ciência da Computação.

Atualmente, o processo ocorre majoritariamente por **e-mail**, o que gera confusão, sobrecarga de mensagens, falta de rastreabilidade e baixa fluidez tanto para alunos quanto para a coordenação.  
O sistema proposto **não substitui imediatamente** o processo atual, mas **convive com ele**, oferecendo uma alternativa organizada, centralizada e rastreável.

O foco inicial é um **MVP enxuto**, priorizando clareza de fluxo, redução de ruído e melhoria na experiência de submissão e análise.

---

## 2. Core Requirements

### Funcionais
- Permitir que alunos submetam solicitações de aproveitamento de carga horária complementar via plataforma
- Permitir upload de **1 certificado em PDF por solicitação**
- Implementar uma **fila única de atendimento**, com indicação explícita de prioridade
- Permitir que a coordenação avalie e decida solicitações
- Comunicar o resultado da análise diretamente na solicitação
- Suportar submissões paralelas por um mesmo aluno
- Permitir cancelamento de solicitações ainda não analisadas

### Regras de Negócio
- Máximo de **60 horas por semestre por tipo de atividade**
- Alguns tipos de atividade possuem teto menor de aproveitamento
- Total exigido na graduação: **430 horas complementares**
- Resultado da análise:
  - Aprovado com a carga horária máxima permitida para o tipo
  - Recusado
- Casos excepcionais são avaliados manualmente (fora do escopo do MVP)

### Não Funcionais
- Sistema web
- Interface simples e funcional
- Sem necessidade de integração inicial com sistemas acadêmicos oficiais
- Persistência básica de dados e arquivos

---

## 3. Core Features

### Para o Aluno
- Submissão de solicitação de carga horária complementar
- Upload de certificado em PDF
- Visualização da lista de solicitações realizadas
- Visualização do status da solicitação:
  - Em análise
  - Aprovada
  - Recusada
- Visualização da resposta da coordenação dentro da solicitação
- Cancelamento de solicitações pendentes
- Autodeclaração como aluno concluinte (para prioridade)

### Para a Coordenação
- Visualização de lista única de solicitações
- Identificação visual de prioridade (concluinte ou não)
- Acesso aos dados da solicitação e ao PDF
- Decisão da solicitação (aprovar ou recusar)
- Envio de mensagem padronizada + justificativa manual ao aluno

---

## 4. Core Components

### Entidades Principais
- **Usuário**
  - Tipo: Aluno | Coordenação
- **Solicitação de Aproveitamento**
  - Aluno
  - Tipo de atividade
  - Título da atividade
  - Instituição responsável
  - Data de início
  - Data de fim
  - Carga horária declarada
  - Indicador de prioridade (concluinte)
  - Status
  - Resposta da coordenação
- **Certificado**
  - Arquivo PDF
  - Associado a uma solicitação

---

## 5. App / User Flow

### Fluxo do Aluno
1. Login na plataforma
2. Acessa opção “Submeter carga horária”
3. Preenche formulário da atividade
4. Faz upload do certificado (PDF)
5. Submete a solicitação
6. Solicitação entra na fila com status “Em análise”
7. Aluno acompanha o status na lista
8. Ao clicar na solicitação:
   - Visualiza resposta da coordenação
   - Vê mensagem de aprovação ou recusa

### Fluxo da Coordenação
1. Login na plataforma
2. Visualiza lista única de solicitações
3. Identifica prioridade (concluintes)
4. Abre uma solicitação
5. Analisa dados e certificado
6. Decide:
   - Aprovar (até o máximo permitido)
   - Recusar
7. Envia resposta com:
   - Mensagem padrão
   - Justificativa escrita
8. Solicitação é encerrada

---

## 6. Tech Stack (Sugestão)

### Frontend
- React
- TypeScript
- Framework de UI simples (ex.: Tailwind)

### Backend
- Node.js
- API REST
- Autenticação baseada em roles

### Banco de Dados
- PostgreSQL ou similar
- Armazenamento de metadados das solicitações

### Armazenamento de Arquivos
- Storage local (MVP) ou serviço de objetos (ex.: S3-compatible)

---

## 7. Implementation Plan

### Fase 1 — MVP
- Autenticação básica (Aluno / Coordenação)
- Submissão de solicitações com upload de PDF
- Listagem de solicitações (aluno e coordenação)
- Fila única com indicador de prioridade
- Avaliação e resposta da coordenação
- Visualização do resultado pelo aluno

### Fase 2 — Estabilização
- Melhorias de UX
- Validações adicionais
- Mensagens de erro e confirmação
- Logs básicos

### Fase 3 — Evoluções Futuras (fora do escopo atual)
- Dashboard de progresso do aluno
- Integração com sistema acadêmico
- Auditoria de autodeclaração de concluintes
- Filtros e ordenações avançadas para coordenação
- Notificações por e-mail
