/**
 * PASSO 04 — NÍVEIS DE DIFICULDADE
 * ─────────────────────────────────────────────────────────────
 * Antes de jogar, o jogador escolhe a dificuldade:
 *   • Fácil    → números de 1 a 50,  15 tentativas
 *   • Médio    → números de 1 a 100, 10 tentativas
 *   • Difícil  → números de 1 a 500, 12 tentativas
 *
 * O que mudou em relação ao Passo 03:
 *   + Objeto DIFICULDADES com 3 configurações pré-definidas
 *   + Estado novo: dificuldade (null antes de escolher)
 *   + DUAS "telas" no mesmo App.js — selecionada por renderização
 *     condicional (sem React Navigation ainda)
 *   + Função iniciarJogo(nivel) que configura tudo e dispara o jogo
 *
 * Conceitos novos:
 *   • Objeto de configuração indexado (DIFICULDADES[nivel])
 *   • Object.entries() + map para gerar UI dinâmica
 *   • Padrão "máquina de estados" simples (null = menu, !null = jogo)
 *   • Botão "Voltar ao menu" — composição de telas sem navegação real
 *
 * Observação didática:
 *   Esse padrão "if (algo) render uma coisa, senão outra" é muito
 *   útil. Quando o app crescer, troca por React Navigation (Aula 05).
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const DIFICULDADES = {
  facil:   { label: 'Fácil',   max: 50,  tentativas: 15 },
  medio:   { label: 'Médio',   max: 100, tentativas: 10 },
  dificil: { label: 'Difícil', max: 500, tentativas: 12 },
};

function gerarNumero(max) {
  return Math.floor(Math.random() * max) + 1;
}

function avaliarTemperatura(distancia, max) {
  // Proporção: distâncias relativas ao tamanho do range
  const p = distancia / max;
  if (p <= 0.03) return { label: 'QUEIMANDO',  cor: '#EF4444' };
  if (p <= 0.08) return { label: 'Quente',     cor: '#F97316' };
  if (p <= 0.15) return { label: 'Morno',      cor: '#EAB308' };
  if (p <= 0.30) return { label: 'Frio',       cor: '#3B82F6' };
  return                { label: 'Congelando', cor: '#06B6D4' };
}

export default function App() {
  const [dificuldade, setDificuldade] = useState(null); // null = menu
  const [segredo, setSegredo] = useState(0);
  const [maxNumero, setMaxNumero] = useState(100);
  const [maxTentativas, setMaxTentativas] = useState(10);
  const [palpite, setPalpite] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const [mensagem, setMensagem] = useState('');
  const [corMensagem, setCorMensagem] = useState('#F8FAFC');
  const [ganhou, setGanhou] = useState(false);
  const [perdeu, setPerdeu] = useState(false);

  const acabouOJogo = ganhou || perdeu;

  function iniciarJogo(nivel) {
    const config = DIFICULDADES[nivel];
    setDificuldade(nivel);
    setMaxNumero(config.max);
    setMaxTentativas(config.tentativas);
    setSegredo(gerarNumero(config.max));
    setPalpite('');
    setTentativas(0);
    setMensagem(`Tente um número de 1 a ${config.max}`);
    setCorMensagem('#F8FAFC');
    setGanhou(false);
    setPerdeu(false);
  }

  function voltarAoMenu() {
    setDificuldade(null);
  }

  function tentar() {
    const n = parseInt(palpite);
    if (isNaN(n) || n < 1 || n > maxNumero) {
      setMensagem(`Digite um número válido entre 1 e ${maxNumero}`);
      setCorMensagem('#94A3B8');
      return;
    }
    const novas = tentativas + 1;
    setTentativas(novas);

    if (n === segredo) {
      setMensagem(`Acertou em ${novas} tentativas!`);
      setCorMensagem('#10B981');
      setGanhou(true);
    } else if (novas >= maxTentativas) {
      setMensagem(`Suas tentativas acabaram! O número era ${segredo}`);
      setCorMensagem('#EF4444');
      setPerdeu(true);
    } else {
      const distancia = Math.abs(n - segredo);
      const { label, cor } = avaliarTemperatura(distancia, maxNumero);
      const direcao = n < segredo ? 'maior' : 'menor';
      setMensagem(`${label}! Tente um número ${direcao}`);
      setCorMensagem(cor);
    }
    setPalpite('');
  }

  // ────────── TELA 1: MENU DE DIFICULDADE ──────────
  if (dificuldade === null) {
    return (
      <View style={styles.outer}>
        <View style={styles.inner}>
          <Text style={styles.titulo}>Adivinhe um Número</Text>
          <Text style={styles.subtitulo}>Escolha a dificuldade</Text>

          {Object.entries(DIFICULDADES).map(([key, cfg]) => (
            <TouchableOpacity
              key={key}
              style={styles.botaoMenu}
              onPress={() => iniciarJogo(key)}
            >
              <Text style={styles.botaoMenuTitulo}>{cfg.label}</Text>
              <Text style={styles.botaoMenuDetalhe}>
                1 a {cfg.max} — {cfg.tentativas} tentativas
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // ────────── TELA 2: JOGO ──────────
  return (
    <View style={styles.outer}>
      <TouchableOpacity style={styles.linkVoltar} onPress={voltarAoMenu}>
        <Text style={styles.linkVoltarTexto}>← Trocar dificuldade</Text>
      </TouchableOpacity>

      <View style={styles.inner}>
        <Text style={styles.titulo}>Adivinhe um Número</Text>
        <Text style={styles.subtitulo}>
          {DIFICULDADES[dificuldade].label} (1 a {maxNumero})
        </Text>
        <Text style={[styles.mensagem, { color: corMensagem }]}>{mensagem}</Text>
        <Text style={styles.tentativas}>
          Tentativas: {tentativas} / {maxTentativas}
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
            onPress={() => iniciarJogo(dificuldade)}
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
  titulo: { color: '#F97316', fontSize: 38, fontWeight: 'bold', marginBottom: 10 },
  subtitulo: { color: '#94A3B8', fontSize: 18, marginBottom: 28, textAlign: 'center' },
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
  botaoMenu: {
    backgroundColor: '#1E293B', paddingHorizontal: 32, paddingVertical: 20,
    borderRadius: 10, marginBottom: 14, width: '100%', maxWidth: 360,
    alignItems: 'center', alignSelf: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  botaoMenuTitulo: { color: '#F97316', fontSize: 24, fontWeight: 'bold' },
  botaoMenuDetalhe: { color: '#94A3B8', fontSize: 15, marginTop: 6 },
  linkVoltar: { position: 'absolute', top: 40, left: 16, zIndex: 1, padding: 8 },
  linkVoltarTexto: { color: '#94A3B8', fontSize: 16 },
});
