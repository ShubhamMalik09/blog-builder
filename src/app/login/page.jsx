"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "@/lib/api/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                username,
                password
            };

            const res = await login(payload)

            if (!res.data?.success) {
                toast.error(res.data?.message || "Login failed");
                setLoading(false);
                return;
            }

            const data = res.data.data;

            // Save auth data to localStorage
            localStorage.setItem("username", payload.username);
            localStorage.setItem("token", data.access_token);

            toast.success("Login successful!");

            window.location.href = "/";   

        } catch (error) {
            toast.error("Login failed", {
                description: error?.response?.data?.message || error.message,
            });

        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem('username');
    if (token && username) router.replace("/");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-none rounded-2xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-semibold">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue your dashboard
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl mt-4 font-medium"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
