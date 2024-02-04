import { useState } from 'react';
import styles from './app.module.css';
import { useEffect } from 'react';
import { useAddNewTodo, useDeleteTodo } from './hooks';
import { Search } from './components/search/search';
import { Sorting } from './components/sorting/sorting';
import { AppContext } from './context';

export const App = () => {
	const [todoList, setTodoList] = useState([]);
	const [value, setValue] = useState('');
	const [refreshTodoFlag, setRefreshTodoFlag] =
		useState(false);
	const [buttonAddAndUpdate, setButtonAddAndUpdate] =
		useState('Добавить');
	const [byId, setById] = useState('');
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
		fetch('http://localhost:3005/todoList')
			.then((loadedTodos) => loadedTodos.json())
			.then((loadedTodo) => {
				setTodoList(loadedTodo);
				setSorted(loadedTodo);
				console.log(loadedTodo);
			})
			.catch((error) => console.log(error));
	}, [refreshTodoFlag]);

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

	return (
		<AppContext.Provider value={{ todoList }}>
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
				<Sorting
					todoList={todoList}
					setSorted={setSorted}
				/>

				<div className={styles.todoList}>
					{sorted.map(({ id, todo }) => (
						<div
							key={id}
							className={styles.todoTask}
						>
							<li
								key={id}
								className={styles.todoTaskText}
							>
								<input
									key={id}
									className={
										styles.todoCheckBox
									}
									type="checkbox"
								/>
								{todo}

								<button
									className={styles.btnDelete}
									onClick={() =>
										deleteTodo(id)
									}
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
				<Search todoList={todoList} />
			</div>
		</AppContext.Provider>
	);
};
