"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => setLoading(false), 1500);
  };

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
                type="email"
                placeholder="you@example.com"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
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
