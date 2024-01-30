import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyD326lP_iBn-WPe_Ktt2eS7cUg6Le90Cug',
	authDomain: 'todolist-fbe56.firebaseapp.com',
	projectId: 'todolist-fbe56',
	storageBucket: 'todolist-fbe56.appspot.com',
	messagingSenderId: '910193906147',
	appId: '1:910193906147:web:0ac4946fec5da879d090d6',
	databaseURL:
		'https://todolist-fbe56-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
