import { ref, remove } from 'firebase/database';
import { db } from '../firebase';

export const useDeleteTodo = (refreshTodo) => {
	const deleteTodo = (id) => {
		const delTodoDbRef = ref(db, `TodoList/${id}`);
		remove(delTodoDbRef)
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
