import { useState } from 'react';
import styles from './app.module.css';
import { useEffect } from 'react';
import { useAddNewTodo, useDeleteTodo } from './hooks';
import { ref, onValue, set } from 'firebase/database';
import { db } from './firebase';

export const App = () => {
	const [todoList, setTodoList] = useState({});
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

	const { addNewTodo } = useAddNewTodo(
		refreshTodo,
		value,
		setValue,
	);

	const { deleteTodo } = useDeleteTodo(refreshTodo);

	useEffect(() => {
		const todoListDbRef = ref(db, 'TodoList');

		return onValue(todoListDbRef, (snapshot) => {
			const loadedTodoList = snapshot.val() || [];
			setTodoList(loadedTodoList);
			setSorted(Object.entries(loadedTodoList));
			console.log(loadedTodoList);
		});
	}, []);

	const updateTodo = (todo, id) => {
		setValue(todo);
		setButtonAddAndUpdate('Изменить');
		console.log(todo, id);
		setById(id);
	};

	const updateTodoInServer = () => {
		const updeteTodoDbRef = ref(db, `TodoList/${byId}`);

		set(updeteTodoDbRef, {
			todo: value,
			isCompleted: false,
		})
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
		const searchTodoList = Object.entries(todoList).filter(
			([index, item]) => {
				return item.todo.includes(String(searchValue));
			},
		);
		console.log(searchTodoList);
		if (searchTodoList) {
			return setResultSearch(searchTodoList);
		}
	};

	const buttonSorting = () => {
		let isSort = true;
		const arrayTodo = Object.entries(todoList);

		const sortetTodo = isSort
			? arrayTodo.sort((a, b) => {
					return a[0].todo > b[0].todo ? 1 : -1;
				})
			: arrayTodo;

		setSorted(sortetTodo);
	};

	return (
		<div className={styles.app}>
			<h1 className={styles.todoTitle}>Список дел</h1>
			<div className={styles.todoNew}>
				<input
					placeholder="Новая задача..."
					className={styles.input}
					type="text"
					value={value}
					onChange={({ target }) =>
						setValue(target.value)
					}
				></input>

				<button
					className={styles.btnAdd}
					onClick={buttonUpdate}
				>
					{buttonAddAndUpdate}
				</button>
			</div>
			<button
				className={styles.btnSorting}
				onClick={buttonSorting}
			>
				Сортировка по алфавиту
			</button>
			<div className={styles.todoList}>
				{sorted.map(([id, { todo }]) => (
					<div key={id} className={styles.todoTask}>
						<li
							key={id}
							className={styles.todoTaskText}
						>
							<input
								key={id}
								className={styles.todoCheckBox}
								type="checkbox"
							/>
							{todo}

							<button
								className={styles.btnDelete}
								onClick={() => deleteTodo(id)}
							>
								X
							</button>
							<button
								className={styles.btnChange}
								onClick={() =>
									updateTodo(todo, id)
								}
							>
								R
							</button>
						</li>
					</div>
				))}
			</div>
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
				{resultSearch.map(([id, { todo }]) => (
					<li className={styles.todoList} key={id}>
						{todo}
					</li>
				))}
			</form>
		</div>
	);
};
