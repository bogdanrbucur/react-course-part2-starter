import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_TODOS } from "../constants";
import todoService, { Todo } from "../services/todoService";

interface AddTodoContext {
	previousTodos: Todo[];
}

const useAddTodo = (onAdd: () => void) => {
	const queryClient = useQueryClient();

	return useMutation<Todo, Error, Todo, AddTodoContext>({
		mutationFn: todoService.post,
		onMutate: (newTodo: Todo) => {
			const previousTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS) || [];

			// APPROACH 1: Invalidating the cache
			// queryClient.invalidateQueries({
			// 	queryKey: CACHE_KEY_TODOS,
			// });

			// APPROACH 2: Updating the data in the cache
			queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) => [newTodo, ...(todos || [])]);

			// clear the textbox
			onAdd();

			return { previousTodos };
		},
		// savedTodo = the newTodo added to the backend
		// newTodo = the new Todo created on the client
		// replace the optimistic update with the data from the DB
		onSuccess: (savedTodo, newTodo) => {
			queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) => todos?.map((todo) => (todo === newTodo ? savedTodo : todo)));
		},
		// revert the optimistic update to previous state
		onError: (error, newTodo, context) => {
			if (!context) return;

			queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context.previousTodos);
		},
	});
};

export default useAddTodo;
