# Como usar dados mockados

## ✅ Como alternar entre mock e backend

### Para rodar com dados mockados (MSW)

1. Abra o arquivo `.env.development`
2. Defina:

```env
VITE_USE_MOCK_API=true
```

3. Rode:

```bash
npm run dev
```

### Para rodar com backend real

1. Abra o arquivo `.env.development`
2. Defina:

```env
VITE_USE_MOCK_API=false
```

3. Certifique-se que sua API está rodando em `http://localhost:3000`
4. Rode:

```bash
npm run dev
```

---

## ✅ Para testes (recomendado)

Execute os testes para validar a aplicação **completamente sem API**:

```bash
# Rodar todos os testes com dados mockados
npm test -- --run
```

- 50 testes passando
- Dados mockados via MSW
- Sem dependência de API externa
- Rápido e confiável

**Arquivos de mock para testes:**

- `src/api/mocks/handlers.ts` - Handlers MSW
- `src/api/mocks/server.ts` - Server MSW setup
- `vitest.setup.ts` - Inicializa MSW nos testes

---

## Dados mockados nos testes

Os testes usam 3 alunos de exemplo:

```typescript
{
  id: '1',
  name: 'João Silva',
  belt: 'Branca',
  birthday: new Date('2000-05-15'),
  trainingStartDate: new Date('2024-01-10'),
  isActive: true,
}
```

Com operações CRUD completas (GET, POST, PUT, DELETE).
