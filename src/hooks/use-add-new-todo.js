import { ref, push } from 'firebase/database';
import { db } from '../firebase';

export const useAddNewTodo = (refreshTodo, value, setValue) => {
	const addNewTodo = () => {
		const todoListDbRef = ref(db, 'TodoList');

		push(todoListDbRef, {
			todo: value,
			isComplited: false,
		})
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
