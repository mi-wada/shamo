"use client";

import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";

export default function Home() {
  return (
    <main>
      <div>
        <Button
          loading={true}
          color="error"
          onClick={() => {
            alert("hello");
          }}
        >
          Register
        </Button>
      </div>
      <div>
        <Button
          loading={false}
          color="primary"
          onClick={() => {
            alert("hello");
          }}
        >
          Register
        </Button>
      </div>
      <div>
        <Loading size="small" />
      </div>
    </main>
  );
}
