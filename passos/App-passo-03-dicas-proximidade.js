/**
 * PASSO 03 — DICAS DE PROXIMIDADE
 * ─────────────────────────────────────────────────────────────
 * O app dá pistas mais ricas baseadas na DISTÂNCIA entre o palpite
 * e o segredo: queimando / quente / morno / frio / congelando.
 * A cor da mensagem muda junto com a "temperatura".
 *
 * O que mudou em relação ao Passo 02:
 *   + Função auxiliar avaliarTemperatura() retorna um objeto
 *     { label, cor } com a dica e a cor correspondente
 *   + Estado novo: corMensagem (controla a cor do texto)
 *   + Estilo aplicado dinamicamente: style={[styles.mensagem, { color: corMensagem }]}
 *
 * Conceitos novos:
 *   • Funções auxiliares puras fora do componente
 *   • Retornar objetos de funções (padrão muito comum em React)
 *   • Estilos dinâmicos via estado (intro a "estilização reativa")
 *   • Math.abs para calcular distância absoluta
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const MAX_TENTATIVAS = 10;

function gerarNumero() {
  return Math.floor(Math.random() * 100) + 1;
}

// Função pura: dada uma distância, retorna { label, cor }
function avaliarTemperatura(distancia) {
  if (distancia <= 3)  return { label: 'QUEIMANDO',  cor: '#EF4444' }; // vermelho
  if (distancia <= 8)  return { label: 'Quente',     cor: '#F97316' }; // laranja
  if (distancia <= 15) return { label: 'Morno',      cor: '#EAB308' }; // amarelo
  if (distancia <= 30) return { label: 'Frio',       cor: '#3B82F6' }; // azul
  return                       { label: 'Congelando', cor: '#06B6D4' }; // ciano
}

export default function App() {
  const [segredo, setSegredo] = useState(gerarNumero());
  const [palpite, setPalpite] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const [mensagem, setMensagem] = useState(`Você tem ${MAX_TENTATIVAS} tentativas`);
  const [corMensagem, setCorMensagem] = useState('#F8FAFC');
  const [ganhou, setGanhou] = useState(false);
  const [perdeu, setPerdeu] = useState(false);

  const acabouOJogo = ganhou || perdeu;

  function tentar() {
    const n = parseInt(palpite);
    if (isNaN(n) || n < 1 || n > 100) {
      setMensagem('Digite um número válido entre 1 e 100');
      setCorMensagem('#94A3B8');
      return;
    }
    const novas = tentativas + 1;
    setTentativas(novas);

    if (n === segredo) {
      setMensagem(`Acertou em ${novas} tentativas!`);
      setCorMensagem('#10B981');
      setGanhou(true);
    } else if (novas >= MAX_TENTATIVAS) {
      setMensagem(`Suas tentativas acabaram! O número era ${segredo}`);
      setCorMensagem('#EF4444');
      setPerdeu(true);
    } else {
      const distancia = Math.abs(n - segredo);
      const { label, cor } = avaliarTemperatura(distancia);
      const direcao = n < segredo ? 'maior' : 'menor';
      setMensagem(`${label}! Tente um número ${direcao}`);
      setCorMensagem(cor);
    }
    setPalpite('');
  }

  function reiniciar() {
    setSegredo(gerarNumero());
    setPalpite('');
    setTentativas(0);
    setMensagem(`Você tem ${MAX_TENTATIVAS} tentativas`);
    setCorMensagem('#F8FAFC');
    setGanhou(false);
    setPerdeu(false);
  }

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.titulo}>Adivinhe um Número</Text>
        <Text style={[styles.mensagem, { color: corMensagem }]}>{mensagem}</Text>
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
    fontSize: 24, fontWeight: '700',
    textAlign: 'center', marginBottom: 12, minHeight: 80, paddingHorizontal: 8,
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
  botaoVermelho: { backgroundColor: '#EF4444' },
  botaoTexto: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});
