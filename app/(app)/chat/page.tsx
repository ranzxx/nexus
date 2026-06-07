"use client";

import { Suspense, useRef } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  const keyRef = useRef(crypto.randomUUID());

  return (
    <Suspense>
      <ChatInterface key={keyRef.current} />
    </Suspense>
  );
}
