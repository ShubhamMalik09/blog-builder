"use client";

import dynamic from "next/dynamic";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

export default SunEditor;
