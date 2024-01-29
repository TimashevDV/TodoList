export const useDeleteTodo = (refreshTodo) => {
	const deleteTodo = (id) => {
		fetch(`http://localhost:3005/todoList/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log(response);
				refreshTodo();
			})
			.catch((error) => console.log(error))
			.finally();
	};

	return {
		deleteTodo,
	};
};
