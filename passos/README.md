# AdivinhaNumero — Progressão Didática

Sequência de variações progressivas do app, cada uma introduzindo um novo conceito sem quebrar nada do anterior. Pensada para uso em sala depois da Aula 05 (UI II + Navegação), reforçando conteúdos vistos e antecipando o que vem.

## Como usar

Cada arquivo `App-passo-NN-nome.js` é um **App.js completo**. Para experimentar um passo:

```powershell
# Copia o conteúdo do passo desejado por cima do App.js
Copy-Item passos\App-passo-03-dicas-proximidade.js App.js -Force

# Roda
npm run web        # ou: npx expo start
```

> **Dica:** antes do passo 06, instale o AsyncStorage:
> ```
> npx expo install @react-native-async-storage/async-storage
> ```

## Os 6 passos

| # | Arquivo | Novo conceito | Aula alvo |
|---|---|---|---|
| 01 | `App-passo-01-base.js` | Versão inicial — useState, TextInput, lógica condicional | Aulas 01–04 |
| 02 | `App-passo-02-limite-tentativas.js` | Estado de derrota, variáveis derivadas, array de estilos | Aula 04 |
| 03 | `App-passo-03-dicas-proximidade.js` | Função auxiliar pura, retorno de objeto, estilo dinâmico via estado | Aula 04 |
| 04 | `App-passo-04-dificuldades.js` | Renderização condicional de "telas", objeto de configuração indexado, `Object.entries().map()` | Aula 05 (telas) |
| 05 | `App-passo-05-historico-flatlist.js` | **FlatList** com `data`, `keyExtractor`, `renderItem`, `ListEmptyComponent`. Padrão imutável de arrays. Componente filho extraído. | **Aula 05 (aplicação direta)** |
| 06 | `App-passo-06-recorde-asyncstorage.js` | `useEffect`, `AsyncStorage`, `async/await`, `JSON.stringify`/`parse`, padrão "load on mount + save on change" | **Antecipa Aula 09 (Persistência)** |

## Sugestão de uso em aula

- **Aula 05 (revisão final):** mostrar passos 01 → 04 ao vivo, deixar passo 05 como exercício prático ("agora vocês implementam o histórico").
- **Aula 06 (Estado):** começar pelo passo 05 e refatorar para `useReducer` — vira ponte natural para a discussão de gerenciamento de estado.
- **Aula 09 (Persistência):** passo 06 já pronto para usar como ponto de partida, e desafiar os alunos a adicionar persistência também ao histórico da sessão atual.

## Para os alunos

Cada arquivo tem um cabeçalho explicando:
- O que mudou em relação ao passo anterior
- Quais conceitos novos foram introduzidos
- Observações didáticas quando relevante

A intenção é que dê para ler o passo N+1 ao lado do passo N e enxergar exatamente a diferença — sem ter que "caçar" mudanças no código todo.

## Próximos passos (sugestões futuras)

- **07 — Cronômetro:** `useEffect` com `setInterval`, recorde considera tempo
- **08 — Tema claro/escuro:** Context API (boa ponte para Aula 06)
- **09 — Animação no acerto:** `Animated` API
- **10 — Som:** `expo-av` para feedback sonoro
- **11 — Multiplayer local:** array de jogadores alternando
- **12 — Placar online:** consumo de API REST (Aula 08)
