"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "@/lib/axios";
import { setIndustries, setPrimaryTags } from "@/store/slices/tagSlice";
import { getIndustries, getPrimaryTags } from "@/lib/api/tags";
import { toast } from "sonner";

export default function TagInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadTags() {
      try {
        const [primaryRes, secondaryRes] = await Promise.all([
          getPrimaryTags(),
          getIndustries()
        ]);

        if(primaryRes.data.success){
          dispatch(setPrimaryTags(primaryRes.data.data || []));
        }
        if(secondaryRes.data.success){
          dispatch(setIndustries(secondaryRes.data.data || []));
        }

      } catch (err) {
        toast.error("Failed to load tags", {
          description: (err.response?.data?.error || err.message)
        })
        console.error("Failed to load tags", err);
      }
    }
    loadTags();
  }, []);

  return null; // invisible initializer
}
