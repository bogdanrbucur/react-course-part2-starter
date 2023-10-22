import axios from "axios";
import { useEffect, useState } from "react";
import usePosts from "./hooks/usePosts";
import usePostsInfinite from "./hooks/usePostsInfinite";
import React from "react";

interface Post {
	id: number;
	title: string;
	body: string;
	userId: number;
}

const PostList = () => {
	// when filtering by userId
	// const [userId, setUseId] = useState<number>();
	// const { data: posts, error, isLoading } = usePosts(userId);

	// when using pagination
	const pageSize = 10;
	const [page, setPage] = useState(1);
	const { data: posts, error, isLoading, fetchNextPage, isFetchingNextPage } = usePostsInfinite({ pageSize });

	if (error) return <p>{error.message}</p>;

	if (isLoading) return <p>Loading...</p>;

	return (
		<>
			{/* <select onChange={(event) => setUseId(parseInt(event.target.value))} value={userId} className="form-select mb-3">
				<option value=""></option>
				<option value="1">User 1</option>
				<option value="2">User 2</option>
				<option value="3">User 3</option>
			</select> */}
			<ul className="list-group">
				{posts.pages.map((page, index) => (
					<React.Fragment key={index}>
						{page.map((post) => (
							<li key={post.id} className="list-group-item">
								{post.title}
							</li>
						))}
					</React.Fragment>
				))}
			</ul>
			<button onClick={() => fetchNextPage()} className="btn btn-primary my-3 mx-2" disabled={isFetchingNextPage}>
				{isFetchingNextPage ? "Loading..." : "Load More"}
			</button>
		</>
	);
};

export default PostList;
