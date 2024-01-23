import { useState } from 'react';
import styles from './app.module.css';
import { useEffect } from 'react';

export const App = () => {
	const [todoList, setTodoList] = useState([]);
	const [value, setValue] = useState('');
	const [refreshTodoFlag, setRefreshTodoFlag] =
		useState(false);
	const [buttonAddAndUpdate, setButtonAddAndUpdate] =
		useState('Добавить');
	const [byId, setById] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [resultSearch, setResultSearch] = useState([]);
	const [sorted, setSorted] = useState([]);

	const refreshTodo = () =>
		setRefreshTodoFlag(!refreshTodoFlag);

	useEffect(
		(filter) => {
			fetch('http://localhost:3005/todoList')
				.then((loadedTodos) => loadedTodos.json())
				.then((loadedTodo) => {
					setTodoList(loadedTodo);
					setSorted(loadedTodo);
					console.log(loadedTodo);
				})
				.catch((error) => console.log(error));
		},
		[refreshTodoFlag],
	);

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

	const updateTodo = (todo, id) => {
		setValue(todo);
		setButtonAddAndUpdate('Изменить');
		console.log(todo, id);
		setById(id);
	};

	const updateTodoInServer = () => {
		fetch(`http://localhost:3005/todoList/${byId}`, {
			method: 'PUT',
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
			.finally(
				setValue(''),
				setButtonAddAndUpdate('Добавить'),
			);
	};

	const buttonUpdate = () => {
		if (buttonAddAndUpdate === 'Добавить') {
			addNewTodo();
		} else if (buttonAddAndUpdate === 'Изменить') {
			updateTodoInServer();
		}
	};

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

	// setSorted(todoList);

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
		<div className={styles.app}>
			<h1>Список дел</h1>

			<input
				className={styles.input}
				type="text"
				value={value}
				onChange={({ target }) => setValue(target.value)}
			></input>

			<button
				className={styles.btnAdd}
				onClick={buttonUpdate}
			>
				{buttonAddAndUpdate}
			</button>
			<button
				className={styles.btnSorting}
				onClick={buttonSorting}
			>
				Сортировка по алфавиту
			</button>
			{sorted.map(({ id, todo }) => (
				<li key={id} className={styles.todoList}>
					{todo}
					<button
						className={styles.btnDelete}
						onClick={() => deleteTodo(id)}
					>
						X
					</button>
					<button
						className={styles.btnChange}
						onClick={() => updateTodo(todo, id)}
					>
						C
					</button>
				</li>
			))}
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
		</div>
	);
};
