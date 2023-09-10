"use client";

import { Button } from "@/components/common/Button";

export default function Home() {
  return (
    <main>
      <h1>Shamo 🐔</h1>
      <Button
        loading={false}
        onClick={() => {
          alert("hello");
        }}
      >
        Click me
      </Button>
    </main>
  );
}
