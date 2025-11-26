// components/AppInitializer.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { verifyToken } from "@/lib/api/auth";
import { getIndustries, getPrimaryTags } from "@/lib/api/tags";
import { useDispatch } from "react-redux";
import { setIndustries, setPrimaryTags } from "@/store/slices/tagSlice";
import { toast } from "sonner";
import LoaderScreen from "./LoaderScreen";
import { getToken, getUsername, clearAuth } from "@/lib/utils/storage";

export default function AppInitializer({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function initApp() {
      if (pathname === "/login") {
        setInitialized(true);
        return;
      }

      const token = getToken();
      const username = getUsername();

      if (!token || !username) {
        setInitialized(true)
        router.replace("/login");
        return;
      }

      try {
        const result = await verifyToken();
        if (!result.data?.success) {
          clearAuth();
          setInitialized(true)
          router.replace("/login");
          return;
        }
      } catch (error) {
        setInitialized(true)
        clearAuth();
        router.replace("/login");
        return;
      }

      try {
        const [primaryRes, industryRes] = await Promise.all([
          getPrimaryTags(),
          getIndustries(),
        ]);

        if (primaryRes.data.success) {
          dispatch(setPrimaryTags(primaryRes.data.data || []));
        }

        if (industryRes.data.success) {
          dispatch(setIndustries(industryRes.data.data || []));
        }
      } catch (err) {
        toast.error("Failed to load tags", {
          description: err.response?.data?.error || err.message,
        });
      }

      setInitialized(true);
    }

    initApp();
  }, []);

  if (!initialized) return <LoaderScreen />;

  return children;
}