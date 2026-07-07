import { useState } from 'react';
import api from '../../api/axiosConfig';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage({ setToken, setUsername }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { username: form.username, password: form.password }
        : { name: form.name, username: form.username, password: form.password };

      const response = await api.post(endpoint, payload);

      if (response.data.token) {
        const loggedInUsername = response.data.username || form.username;
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', loggedInUsername);
        setToken(response.data.token);
        setUsername(loggedInUsername);
      }
    } catch {
      // Error toast ditangani global oleh axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{isLogin ? 'Masuk' : 'Daftar'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Masukkan kredensial Anda untuk masuk' : 'Buat akun baru untuk memulai'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input type="text" value={form.name} autoComplete="off"
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Username</Label>
              <Input type="text" value={form.username} autoComplete="off"
                onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={form.password} autoComplete="new-password"
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 mt-5">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
            </Button>
            <Button type="button" variant="link" className="text-sm" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}