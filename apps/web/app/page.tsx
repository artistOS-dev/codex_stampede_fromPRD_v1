'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Creating account...');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName }
      }
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus(data.user ? 'Account created. Check your email to verify.' : 'Signup complete.');
  }

  return (
    <main>
      <h1>Stampede Signup</h1>
      <p>Single Supabase backend for web (Vercel) and mobile (Expo/EAS).</p>

      <form className="card" onSubmit={onSignup}>
        <label htmlFor="display">Display name</label>
        <input id="display" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Create account</button>
        {status ? <p>{status}</p> : null}
      </form>
    </main>
  );
}
