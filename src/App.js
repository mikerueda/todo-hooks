import React, { useState, useEffect } from 'react'
import { CssBaseline, Container, Button, TextField, Modal } from '@material-ui/core'

import TasksList from './components/TasksList'
import { idGen, findIndex } from './helpers/'
import './App.scss'

const App = () => {
	const [ taskValue, setTaskValue ] = useState('')
	const [ todoList, setTodoList ] = useState([])
	const [ isModalOpen, toggleModalState ] = useState(false)

	useEffect(() => {
		console.log('levanto del storage')
		const persistedState = window.localStorage.getItem('todo-state')
		setTodoList([ ...(JSON.parse(persistedState) || '') ])
	}, [])

	useEffect(
		() => {
			console.log('guardo en el storage')
			window.localStorage.setItem('todo-state', JSON.stringify(todoList))
		},
		[ todoList ]
	)

	const toggleModal = () => toggleModalState(!isModalOpen)

	const enterHandler = (e) => {
		if (e.key === 'Enter' && taskValue) {
			let newTask = { id: idGen('task'), text: taskValue, status: 'pending' }
			setTodoList([ newTask, ...todoList ])
			setTaskValue('')
		}
	}

	const deleteTask = (id) => {
		let newList = [ ...todoList ]
		newList.splice(findIndex(newList, id), 1)
		setTodoList(newList)
	}

	const changeTaskState = (id) => {
		let newList = [ ...todoList ]
		let task = newList.find((e) => e.id === id)
		task.status = task.status === 'pending' ? 'completed' : 'pending'
		setTodoList(newList)
	}

	const openEditModal = () => {
		toggleModal()
	}

	const completed = todoList.filter((e) => e.status === 'completed')
	const pending = todoList.filter((e) => e.status === 'pending')
	return (
		<Container>
			<CssBaseline />
			<h1>Todo List</h1>
			<TextField
				value={taskValue}
				label={'Ingrese tarea'}
				onChange={(e) => setTaskValue(e.target.value)}
				onKeyPress={(e) => enterHandler(e)}
				name={'task'}
				variant="outlined"
			/>
			<TasksList
				title={'pendientes'}
				tag={'()'}
				data={pending}
				deleteTask={deleteTask}
				changeStatus={changeTaskState}
				editTask={openEditModal}
			/>
			<TasksList
				title={'completadas'}
				tag={'(x)'}
				data={completed}
				deleteTask={deleteTask}
				changeStatus={changeTaskState}
				editTask={openEditModal}
			/>
			<Modal open={isModalOpen} onClose={toggleModal}>
				<div className={'modal-content'}>
					<Container>
						<h3>Editar:</h3>
						<TextField value={''} name={'editField'} />
						<Button onClick={toggleModal}>Cancelar</Button>
					</Container>
				</div>
			</Modal>
		</Container>
	)
}

export default App
