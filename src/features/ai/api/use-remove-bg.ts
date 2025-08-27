import { useMutation } from "@tanstack/react-query";

import type { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
	(typeof client.api.ai)["remove-bg"]["$post"]
>;
type RequestType = InferRequestType<
	(typeof client.api.ai)["remove-bg"]["$post"]
>;

export const useRemoveBgImage = () => {
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.ai["remove-bg"].$post({
				json,
			});
			return await response.json();
		},
	});
	return mutation;
};
