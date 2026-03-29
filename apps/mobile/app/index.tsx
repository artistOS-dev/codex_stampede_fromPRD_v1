import { useState } from 'react';
import { Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Screen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function signUp() {
    setMessage('Creating account...');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName }
      }
    });

    setMessage(error ? error.message : 'Account created. Check your email.');
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Stampede Signup</Text>
      <Text>Uses the same Supabase project as the web app.</Text>

      <View style={{ gap: 10, marginTop: 12 }}>
        <TextInput
          placeholder="Display name"
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
          value={displayName}
          onChangeText={setDisplayName}
        />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={{ borderWidth: 1, borderRadius: 8, padding: 10 }}
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Create account" onPress={signUp} />
      </View>

      <Text>{message}</Text>
    </SafeAreaView>
  );
}
