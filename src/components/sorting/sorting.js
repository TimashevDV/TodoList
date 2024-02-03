import styles from './sorting.module.css';

export const Sorting = ({ todoList, setSorted }) => {
	const buttonSorting = () => {
		let sortetTodo = [...todoList];
		sortetTodo.sort((a, b) => {
			if (a.todo.toLowerCase() < b.todo.toLowerCase()) {
				return -1;
			}
			if (a.todo.toLowerCase() > b.todo.toLowerCase()) {
				return 1;
			}
			return 0;
		});
		setSorted(sortetTodo);
	};

	return (
		<button
			className={styles.btnSorting}
			onClick={buttonSorting}
		>
			Сортировка по алфавиту
		</button>
	);
};
