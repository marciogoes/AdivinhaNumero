/**
 * PASSO 02 — LIMITE DE TENTATIVAS
 * ─────────────────────────────────────────────────────────────
 * Agora o jogador tem no máximo 10 tentativas. Se passar disso
 * sem acertar, PERDE e o app revela o número secreto.
 *
 * O que mudou em relação ao Passo 01:
 *   + Constante MAX_TENTATIVAS no topo (boa prática: configuração visível)
 *   + Estado novo: perdeu (boolean)
 *   + Variável derivada: acabouOJogo = ganhou || perdeu
 *   + Mensagem mostra tentativas restantes
 *   + Botão final tem cor verde (vitória) ou vermelha (derrota)
 *
 * Conceitos reforçados:
 *   • Múltiplos estados booleanos relacionados
 *   • Variáveis derivadas no corpo do componente (sem useState)
 *   • Array com 2 estilos: style={[styles.botao, condição ? a : b]}
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const MAX_TENTATIVAS = 10;

function gerarNumero() {
  return Math.floor(Math.random() * 100) + 1;
}

export default function App() {
  const [segredo, setSegredo] = useState(gerarNumero());
  const [palpite, setPalpite] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const [mensagem, setMensagem] = useState(`Você tem ${MAX_TENTATIVAS} tentativas`);
  const [ganhou, setGanhou] = useState(false);
  const [perdeu, setPerdeu] = useState(false);

  // Variáveis derivadas (recalculadas a cada render — não precisa useState)
  const acabouOJogo = ganhou || perdeu;

  function tentar() {
    const n = parseInt(palpite);
    if (isNaN(n) || n < 1 || n > 100) {
      setMensagem('Digite um número válido entre 1 e 100');
      return;
    }
    const novas = tentativas + 1;
    setTentativas(novas);

    if (n === segredo) {
      setMensagem(`Acertou em ${novas} tentativas!`);
      setGanhou(true);
    } else if (novas >= MAX_TENTATIVAS) {
      setMensagem(`Suas tentativas acabaram! O número era ${segredo}`);
      setPerdeu(true);
    } else {
      const restantes = MAX_TENTATIVAS - novas;
      const direcao = n < segredo ? 'maior' : 'menor';
      setMensagem(`Tente um número ${direcao} (restam ${restantes})`);
    }
    setPalpite('');
  }

  function reiniciar() {
    setSegredo(gerarNumero());
    setPalpite('');
    setTentativas(0);
    setMensagem(`Você tem ${MAX_TENTATIVAS} tentativas`);
    setGanhou(false);
    setPerdeu(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adivinhe um Número</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
      <Text style={styles.tentativas}>
        Tentativas: {tentativas} / {MAX_TENTATIVAS}
      </Text>

      {!acabouOJogo ? (
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
        <TouchableOpacity
          style={[styles.botao, ganhou ? styles.botaoVerde : styles.botaoVermelho]}
          onPress={reiniciar}
        >
          <Text style={styles.botaoTexto}>
            {ganhou ? 'Jogar de Novo' : 'Tentar de Novo'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 24, alignItems: 'center', justifyContent: 'center' },
  titulo: { color: '#F97316', fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  mensagem: { color: '#F8FAFC', fontSize: 18, textAlign: 'center', marginBottom: 8, minHeight: 50, paddingHorizontal: 16 },
  tentativas: { color: '#94A3B8', fontSize: 14, marginBottom: 24 },
  input: {
    backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 24,
    textAlign: 'center', width: 200, marginBottom: 16,
  },
  botao: { backgroundColor: '#F97316', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 },
  botaoVerde: { backgroundColor: '#10B981' },
  botaoVermelho: { backgroundColor: '#EF4444' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
