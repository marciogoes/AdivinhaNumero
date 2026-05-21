/**
 * PASSO 06 — RECORDE PERSISTENTE (AsyncStorage + useEffect)
 * ─────────────────────────────────────────────────────────────
 * O melhor placar de cada dificuldade fica SALVO no dispositivo.
 * Mesmo fechando o app, ele lembra o recorde quando reabrir.
 *
 * Antes de rodar este passo, instale o AsyncStorage:
 *   npx expo install @react-native-async-storage/async-storage
 *
 * O que mudou em relação ao Passo 05:
 *   + Import de AsyncStorage e useEffect
 *   + Estado novo: recordes (objeto { facil, medio, dificil })
 *   + useEffect na MONTAGEM carrega os recordes salvos
 *   + Após uma vitória, compara e atualiza o recorde se necessário
 *   + Tela do menu mostra o recorde de cada dificuldade
 *
 * Conceitos novos:
 *   • useEffect com lista vazia [] = roda 1 vez ao montar
 *   • async/await com AsyncStorage
 *   • JSON.stringify / JSON.parse para guardar objetos
 *   • Padrão "carregar do storage no boot, salvar a cada mudança"
 *
 * Antecipa o conteúdo da AULA 09 (Persistência de Dados).
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@adivinha:recordes';

const DIFICULDADES = {
  facil:   { label: 'Fácil',   max: 50,  tentativas: 15 },
  medio:   { label: 'Médio',   max: 100, tentativas: 10 },
  dificil: { label: 'Difícil', max: 500, tentativas: 12 },
};

function gerarNumero(max) {
  return Math.floor(Math.random() * max) + 1;
}

function avaliarTemperatura(distancia, max) {
  const p = distancia / max;
  if (p <= 0.03) return { label: 'QUEIMANDO',  cor: '#EF4444' };
  if (p <= 0.08) return { label: 'Quente',     cor: '#F97316' };
  if (p <= 0.15) return { label: 'Morno',      cor: '#EAB308' };
  if (p <= 0.30) return { label: 'Frio',       cor: '#3B82F6' };
  return                { label: 'Congelando', cor: '#06B6D4' };
}

function ItemHistorico({ item }) {
  return (
    <View style={styles.itemHistorico}>
      <Text style={[styles.itemPalpite, { color: item.cor }]}>{item.palpite}</Text>
      <Text style={styles.itemTexto}>
        {item.resultado === 'acertou' ? '✓ Acertou' : `${item.label} — ${item.direcao}`}
      </Text>
    </View>
  );
}

export default function App() {
  const [dificuldade, setDificuldade] = useState(null);
  const [segredo, setSegredo] = useState(0);
  const [maxNumero, setMaxNumero] = useState(100);
  const [maxTentativas, setMaxTentativas] = useState(10);
  const [palpite, setPalpite] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const [mensagem, setMensagem] = useState('');
  const [corMensagem, setCorMensagem] = useState('#F8FAFC');
  const [ganhou, setGanhou] = useState(false);
  const [perdeu, setPerdeu] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [recordes, setRecordes] = useState({}); // ← NOVO: { facil: 3, medio: null, ... }
  const [novoRecorde, setNovoRecorde] = useState(false);

  const acabouOJogo = ganhou || perdeu;

  // ─── CARREGA RECORDES AO INICIAR (1 vez só) ───
  useEffect(() => {
    async function carregar() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setRecordes(JSON.parse(json));
      } catch (e) {
        console.warn('Erro ao carregar recordes:', e);
      }
    }
    carregar();
  }, []); // ← [] = roda só na montagem inicial

  // ─── SALVA RECORDES ───
  async function salvarRecordes(novos) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
    } catch (e) {
      console.warn('Erro ao salvar recordes:', e);
    }
  }

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
    setHistorico([]);
    setNovoRecorde(false);
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

    let novoItem;
    const distancia = Math.abs(n - segredo);

    if (n === segredo) {
      novoItem = { id: Date.now(), palpite: n, resultado: 'acertou', cor: '#10B981' };

      // ─── VERIFICA E ATUALIZA RECORDE ───
      const recordeAtual = recordes[dificuldade];
      if (recordeAtual == null || novas < recordeAtual) {
        const novosRecordes = { ...recordes, [dificuldade]: novas };
        setRecordes(novosRecordes);
        salvarRecordes(novosRecordes);
        setNovoRecorde(true);
        setMensagem(`NOVO RECORDE! Acertou em ${novas} tentativas!`);
      } else {
        setMensagem(`Acertou em ${novas} tentativas! (recorde: ${recordeAtual})`);
      }
      setCorMensagem('#10B981');
      setGanhou(true);

    } else if (novas >= maxTentativas) {
      const { label, cor } = avaliarTemperatura(distancia, maxNumero);
      novoItem = {
        id: Date.now(), palpite: n, resultado: 'errou',
        label, direcao: n < segredo ? 'era maior' : 'era menor', cor,
      };
      setMensagem(`Acabaram as tentativas! O número era ${segredo}`);
      setCorMensagem('#EF4444');
      setPerdeu(true);
    } else {
      const { label, cor } = avaliarTemperatura(distancia, maxNumero);
      const direcao = n < segredo ? 'tente maior' : 'tente menor';
      novoItem = { id: Date.now(), palpite: n, resultado: 'errou', label, direcao, cor };
      setMensagem(`${label}! ${direcao}`);
      setCorMensagem(cor);
    }

    setHistorico([novoItem, ...historico]);
    setPalpite('');
  }

  // ────────── MENU ──────────
  if (dificuldade === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Adivinhe um Número</Text>
        <Text style={styles.subtitulo}>Escolha a dificuldade</Text>
        {Object.entries(DIFICULDADES).map(([key, cfg]) => {
          const recorde = recordes[key];
          return (
            <TouchableOpacity key={key} style={styles.botaoMenu} onPress={() => iniciarJogo(key)}>
              <Text style={styles.botaoMenuTitulo}>{cfg.label}</Text>
              <Text style={styles.botaoMenuDetalhe}>
                1 a {cfg.max} — {cfg.tentativas} tentativas
              </Text>
              <Text style={styles.botaoMenuRecorde}>
                {recorde != null
                  ? `Recorde: ${recorde} tentativa${recorde === 1 ? '' : 's'}`
                  : 'Sem recorde ainda'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // ────────── JOGO ──────────
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.linkVoltar} onPress={() => setDificuldade(null)}>
        <Text style={styles.linkVoltarTexto}>← Trocar dificuldade</Text>
      </TouchableOpacity>

      <View style={styles.topo}>
        <Text style={styles.titulo}>Adivinhe um Número</Text>
        <Text style={styles.subtitulo}>
          {DIFICULDADES[dificuldade].label} — Tentativas: {tentativas} / {maxTentativas}
          {recordes[dificuldade] != null && `   |   Recorde: ${recordes[dificuldade]}`}
        </Text>
        <Text style={[styles.mensagem, { color: corMensagem }]}>{mensagem}</Text>
        {novoRecorde && <Text style={styles.faixaRecorde}>🏆 NOVO RECORDE</Text>}

        {!acabouOJogo ? (
          <View style={styles.formRow}>
            <TextInput
              style={styles.input}
              placeholder="Palpite"
              placeholderTextColor="#64748B"
              value={palpite}
              onChangeText={setPalpite}
              keyboardType="numeric"
              onSubmitEditing={tentar}
            />
            <TouchableOpacity style={styles.botao} onPress={tentar}>
              <Text style={styles.botaoTexto}>Tentar</Text>
            </TouchableOpacity>
          </View>
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

      <View style={styles.historicoContainer}>
        <Text style={styles.historicoTitulo}>Histórico</Text>
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ItemHistorico item={item} />}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum palpite ainda</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 16, paddingTop: 60 },
  topo: { alignItems: 'center', marginBottom: 16 },
  titulo: { color: '#F97316', fontSize: 26, fontWeight: 'bold' },
  subtitulo: { color: '#94A3B8', fontSize: 13, marginTop: 4, marginBottom: 12, textAlign: 'center' },
  mensagem: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 8, minHeight: 50, paddingHorizontal: 16 },
  faixaRecorde: { color: '#FACC15', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  formRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 20,
    textAlign: 'center', width: 140,
  },
  botao: { backgroundColor: '#F97316', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  botaoVerde: { backgroundColor: '#10B981' },
  botaoVermelho: { backgroundColor: '#EF4444' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  botaoMenu: {
    backgroundColor: '#1E293B', paddingHorizontal: 32, paddingVertical: 16,
    borderRadius: 8, marginBottom: 12, width: 280, alignItems: 'center',
    alignSelf: 'center', borderWidth: 1, borderColor: '#334155',
  },
  botaoMenuTitulo: { color: '#F97316', fontSize: 20, fontWeight: 'bold' },
  botaoMenuDetalhe: { color: '#94A3B8', fontSize: 13, marginTop: 4 },
  botaoMenuRecorde: { color: '#FACC15', fontSize: 12, marginTop: 6, fontWeight: '600' },
  linkVoltar: { position: 'absolute', top: 50, left: 16, zIndex: 1 },
  linkVoltarTexto: { color: '#94A3B8', fontSize: 14 },
  historicoContainer: { flex: 1, marginTop: 16, borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 12 },
  historicoTitulo: { color: '#F8FAFC', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  itemHistorico: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E293B', borderRadius: 6, padding: 12, marginBottom: 6,
  },
  itemPalpite: { fontSize: 20, fontWeight: 'bold', width: 60, textAlign: 'center' },
  itemTexto: { color: '#CBD5E1', fontSize: 14, marginLeft: 12, flex: 1 },
  vazio: { color: '#64748B', fontStyle: 'italic', textAlign: 'center', marginTop: 12 },
});
