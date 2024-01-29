export const useAddNewTodo = (refreshTodo, value, setValue) => {
	const addNewTodo = () => {
		fetch('http://localhost:3005/todoList', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({
				todo: value,
				isCompleted: false,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				console.log(response);
				refreshTodo();
			})
			.catch((error) => console.log(error))
			.finally(setValue(''));
	};

	return {
		addNewTodo,
	};
};
