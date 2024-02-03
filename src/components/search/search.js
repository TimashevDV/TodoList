import styles from './search.module.css';
import { useState } from 'react';

export const Search = ({ todoList }) => {
	const [searchValue, setSearchValue] = useState('');
	const [resultSearch, setResultSearch] = useState([]);

	const searchTodo = (e) => {
		e.preventDefault();
		const searchTodoList = todoList.filter((item) => {
			return item.todo
				.toLowerCase()
				.includes(String(searchValue).toLowerCase());
		});
		console.log(searchTodoList);
		if (searchTodoList) {
			return setResultSearch(searchTodoList);
		}
	};

	return (
		<form id="search">
			<input
				className={styles.search}
				type="search"
				name="search"
				placeholder="найти..."
				value={searchValue}
				onChange={({ target }) =>
					setSearchValue(target.value)
				}
			></input>
			<button
				className={styles.btnSearch}
				onClick={searchTodo}
			>
				Поиск
			</button>
			{resultSearch.map(({ id, todo }) => (
				<li className={styles.todoList} key={id}>
					{todo}
				</li>
			))}
		</form>
	);
};
