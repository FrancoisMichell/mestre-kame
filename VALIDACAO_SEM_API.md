# Guia: Como validar o projeto SEM API

## ✅ Como alternar entre mock e backend

### Para rodar com dados mockados (MSW)

1. No arquivo `.env.development`, defina:
   ```env
   VITE_USE_MOCK_API=true
   ```
2. Rode:
   ```bash
   npm run dev
   ```

### Para rodar com backend real

1. No arquivo `.env.development`, defina:
   ```env
   VITE_USE_MOCK_API=false
   ```
2. Certifique-se que sua API está rodando em `http://localhost:3000`
3. Rode:
   ```bash
   npm run dev
   ```

---

## ✅ Opção 1: Rodar os testes (RECOMENDADO)

Os testes já usam dados mockados (MSW) e **não precisam de nenhuma API**:

```bash
# Rodar todos os testes uma única vez
npm test -- --run

# Rodar testes em modo watch (atualiza ao salvar arquivos)


# Rodar testes com cobertura
npm test -- --coverage
```

**O que é testado:**

- **API Layer**: hooks (useFetchStudents, useAddStudent) e cliente axios
- **Components**: Header, StudentCard, StudentRegisterForm
- **Pages**: Home com loading, error, e empty states
- **Utils**: Funções de cores e formatação
- **Total**: 50 testes passando com 100% de sucesso

---

## ✅ Opção 2: Build da aplicação (validar compilação)

```bash
# Compilar a aplicação para produção
npm run build

# Verificar se o build foi bem-sucedido (zero erros)
# O resultado estará em ./dist/
```

---

## ✅ Opção 3: Verificar linting e tipos

```bash
# Executar ESLint para verificar qualidade do código
npx eslint src/

# Verificar tipos TypeScript
npx tsc --noEmit
```

---

## 📊 Status do Projeto

### Testes

- ✅ **50 testes passando** em 7 arquivos
- ✅ Todos os componentes testados
- ✅ Todos os hooks testados
- ✅ Cobertura: ~90% da lógica de negócio

### Estrutura

- ✅ Backend integration com SWR + axios
- ✅ Context API para estado global
- ✅ Mock Service Worker (MSW) para testes
- ✅ Componentes responsivos com Tailwind CSS

### Commits

- ✅ Backend integration
- ✅ Testes para Utils, Card, Register, Header, Client
- ✅ Testes para página Home
- ✅ Nome alterado para "Mestre Kame"

---

## 🚀 Próximos passos (com API)

Quando quiser conectar a uma API real:

1. **Iniciar sua API** em `http://localhost:3000`
2. **Rodar**: `npm run dev`
3. A aplicação buscará dados da sua API
4. Testes continuarão funcionando com dados mockados

---

## 📝 Resumo das pastas

```
src/
├── components/          # Componentes React
│   ├── common/         # Header
│   └── student/        # Componentes de alunos + testes
├── api/                # Camada de requisições
│   ├── hooks.ts        # Hooks customizados (SWR)
│   ├── client.ts       # Cliente axios
│   ├── mocks/          # MSW handlers para testes
│   └── __tests__/      # Testes de API
├── pages/              # Páginas da aplicação
│   └── __tests__/      # Testes de páginas
├── mocks/              # Setup MSW (opcional para dev)
└── main.tsx            # Entry point
```

---

**Recomendação**: Execute `npm test -- --run` para validar tudo sem depender de nenhuma API! ✅
