import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
	id: number;
	title: string;
	body: string;
	userId: number;
}

interface PostQuery {
	pageSize: number;
}

const usePostsInfinite = (query: PostQuery) => {
	const fetchPosts = ({ pageParam = 1 }) =>
		axios.get<Post[]>("https://jsonplaceholder.typicode.com/posts", { params: { _start: (pageParam - 1) * query.pageSize, _limit: query.pageSize } }).then((res) => res.data);

	return useInfiniteQuery<Post[], Error>({
		// if user selected or if no user selected
		// queryKey: userId ? ["users", userId, "posts"] : ["posts"],
		queryKey: ["posts", query],
		queryFn: fetchPosts,
		staleTime: 10 * 1000, // 10 sec
		keepPreviousData: true,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length > 0 ? allPages.length + 1 : undefined;
		},
	});
};

export default usePostsInfinite;
