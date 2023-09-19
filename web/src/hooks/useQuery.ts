import { useEffect, useState } from "react";

type QueryResult<TData, TError> = (
  | {
      status: "loading";
      loading: true;
      data: undefined;
      error: undefined;
    }
  | {
      status: "error";
      loading: false;
      data: undefined;
      error: TError;
    }
  | {
      status: "success";
      loading: false;
      data: TData;
      error: undefined;
    }
) &
  CommonQueryResult;

type CommonQueryResult = {
  refetch: () => Promise<void>;
};

export const useQuery = <TData = any, TError = any>({
  url,
}: {
  url: string;
}): QueryResult<TData, TError> => {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<TError | undefined>(undefined);

  const fetchData = async () => {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      setError(data as TError);
      setStatus("error");
    } else {
      setData(data as TData);
      setStatus("success");
    }
  };

  const refetch = async () => {
    setStatus("loading");
    setData(undefined);
    setError(undefined);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  });

  if (status === "loading") {
    return {
      status,
      loading: true,
      data: undefined,
      error: undefined,
      refetch,
    };
  } else if (status === "error") {
    return {
      status,
      loading: false,
      data: undefined,
      error: error as TError,
      refetch,
    };
  } else {
    return {
      status,
      loading: false,
      data: data as TData,
      error: undefined,
      refetch,
    };
  }
};
