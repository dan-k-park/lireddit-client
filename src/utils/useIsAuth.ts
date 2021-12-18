import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    // takes a bit of time to fetch the data
    // don't want a logged in user to get redirected while mequery is fetching data
    if (!fetching && !data?.me) {
      router.replace("/login");
    }
  }, [fetching, data, router]);
};
