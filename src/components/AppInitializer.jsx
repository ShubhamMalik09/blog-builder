"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { verifyToken } from "@/lib/api/auth";
import { getIndustries, getPrimaryTags } from "@/lib/api/tags";
import { useDispatch } from "react-redux";
import { setIndustries, setPrimaryTags } from "@/store/slices/tagSlice";
import { toast } from "sonner";
import LoaderScreen from "./LoaderScreen";

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

      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!token || !username) {
        router.replace("/login");
        return;
      }

      try {
        const result = await verifyToken();
        if (!result.data?.success) {
          localStorage.clear();
          router.replace("/login");
          return;
        }
      } catch (error) {
        localStorage.clear();
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
