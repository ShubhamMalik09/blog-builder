"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function TagModal({ onAdd, triggerText }) {
  const [value, setValue] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tag</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Enter tag name..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <DialogFooter>
          <Button
            onClick={() => {
              if (value.trim().length > 0) {
                onAdd(value.trim());
                setValue("");
              }
            }}
          >
            Add Tag
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
