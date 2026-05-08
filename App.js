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
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { color: '#F97316', fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  mensagem: { color: '#F8FAFC', fontSize: 18, textAlign: 'center', marginBottom: 8, minHeight: 50 },
  tentativas: { color: '#94A3B8', fontSize: 14, marginBottom: 24 },
  input: {
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 24,
    textAlign: 'center',
    width: 200,
    marginBottom: 16,
  },
  botao: {
    backgroundColor: '#F97316',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  botaoVerde: { backgroundColor: '#10B981' },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
