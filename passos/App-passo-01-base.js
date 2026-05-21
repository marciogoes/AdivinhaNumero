/**
 * PASSO 01 — BASE
 * ─────────────────────────────────────────────────────────────
 * Versão inicial do jogo: o app sorteia um número de 1 a 100 e
 * o jogador tenta acertar. A cada palpite o app informa se o
 * número secreto é MAIOR ou MENOR.
 *
 * Conceitos aplicados:
 *   • useState para guardar segredo, palpite, tentativas e mensagem
 *   • TextInput controlado (value + onChangeText)
 *   • TouchableOpacity para botões
 *   • Math.random + Math.floor para sortear
 *   • parseInt + validação básica de entrada
 *   • Renderização condicional ({ganhou ? ... : ...})
 *
 * Padrão de layout (igual em todos os passos):
 *   - Container `outer`: ocupa tela, centraliza conteúdo
 *   - Container `inner`: maxWidth 480, preenche no celular,
 *     fica como um "cartão" centralizado no desktop
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

function gerarNumero() {
  return Math.floor(Math.random() * 100) + 1;
}

export default function App() {
  const [segredo, setSegredo] = useState(gerarNumero());
  const [palpite, setPalpite] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const [mensagem, setMensagem] = useState('Tente um número de 1 a 100');
  const [ganhou, setGanhou] = useState(false);

  function tentar() {
    const n = parseInt(palpite);
    if (isNaN(n) || n < 1 || n > 100) {
      setMensagem('Digite um número válido entre 1 e 100');
      return;
    }
    const novas = tentativas + 1;
    setTentativas(novas);
    if (n === segredo) {
      setMensagem(`Parabéns! Você acertou em ${novas} tentativas!`);
      setGanhou(true);
    } else if (n < segredo) {
      setMensagem('Tente um número maior');
    } else {
      setMensagem('Tente um número menor');
    }
    setPalpite('');
  }

  function reiniciar() {
    setSegredo(gerarNumero());
    setPalpite('');
    setTentativas(0);
    setMensagem('Tente um número de 1 a 100');
    setGanhou(false);
  }

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.titulo}>Adivinhe um Número</Text>
        <Text style={styles.mensagem}>{mensagem}</Text>
        <Text style={styles.tentativas}>Tentativas: {tentativas}</Text>

        {!ganhou ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Digite seu palpite"
              placeholderTextColor="#64748B"
              value={palpite}
              onChangeText={setPalpite}
              keyboardType="numeric"
              onSubmitEditing={tentar}
            />
            <TouchableOpacity style={styles.botao} onPress={tentar}>
              <Text style={styles.botaoTexto}>Tentar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={[styles.botao, styles.botaoVerde]} onPress={reiniciar}>
            <Text style={styles.botaoTexto}>Jogar de Novo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  inner: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    padding: 24,
  },
  titulo: { color: '#F97316', fontSize: 38, fontWeight: 'bold', marginBottom: 20 },
  mensagem: {
    color: '#F8FAFC', fontSize: 22, fontWeight: '600',
    textAlign: 'center', marginBottom: 12, minHeight: 70, paddingHorizontal: 8,
  },
  tentativas: { color: '#94A3B8', fontSize: 16, marginBottom: 28 },
  input: {
    backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: 10,
    paddingHorizontal: 20, paddingVertical: 16, fontSize: 28,
    textAlign: 'center', width: '100%', maxWidth: 320, marginBottom: 20,
  },
  botao: {
    backgroundColor: '#F97316', paddingHorizontal: 48, paddingVertical: 18,
    borderRadius: 10, minWidth: 220, alignItems: 'center',
  },
  botaoVerde: { backgroundColor: '#10B981' },
  botaoTexto: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});
