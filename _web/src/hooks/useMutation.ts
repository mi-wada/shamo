import { useState } from "react";

export const useMutation = <TData = any, TError = any, TMutateProps = any>({
  method,
  url,
  body,
  onSuccess,
}: {
  method: "POST" | "PUT" | "DELETE";
  url: (props: TMutateProps) => string;
  body?: (props: TMutateProps) => { [key: string]: any };
  onSuccess?: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<TError | undefined>(undefined);

  const mutate = async (props: TMutateProps) => {
    setLoading(true);

    const res = await fetch(url(props), {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body(props)),
    });

    setLoading(false);

    if (!res.ok) {
      setError(data as TError);
    } else {
      if (res.status !== 204) {
        const data = await res.json();
        setData(data as TData);
      }

      onSuccess && (await onSuccess());
    }
  };

  return { loading, data, error, mutate };
};
