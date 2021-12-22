import { useGetIntId } from "./useGetIntId";
import { usePostQuery } from "../generated/graphql";

export const useGetPostFromUrl = () => {
  const intId = useGetIntId();
  return usePostQuery({
    // don't bother sending a request to the server if a bad id of -1 (impossible id) comes in
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
