import { useState } from 'react';
import styles from './app.module.css';
import { useEffect } from 'react';

export const App = () => {
	const [todoList, setTodoList] = useState([]);

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/todos')
			.then((loadedTodos) => loadedTodos.json())
			.then((loadedTodo) => {
				setTodoList(loadedTodo);
				console.log(loadedTodo);
			})
			.catch((error) => console.log(error));
	}, []);

	return (
		<div className={styles.app}>
			<h1>Вывод списка</h1>
			{todoList.map(({ id, title }) => (
				<li key={id} className={styles.todoList}>
					{title}
				</li>
			))}
			<div></div>
		</div>
	);
};
