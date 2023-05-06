import { lazy, Suspense } from 'react';
import './App.css';

import { Provider } from 'react-redux';
import { store } from './data/redux/store';
import { PersistGate } from 'redux-persist/es/integration/react';
import persistStore from 'redux-persist/lib/persistStore';

import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';

import SplashScreen from './components/SplashScreen';
import AuthIsLoaded from './AuthIsLoaded';
const Auth = lazy(() => import('./pages/Auth'));
const AuthLink = lazy(() => import('./pages/AuthLink'));
const Home = lazy(() => import('./pages/home'));
const Terms = lazy(() => import('./pages/TermZ'));
const PageNotFound = lazy(() => import('./pages/404'));
const persistedStore = persistStore(store);

function App() {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistedStore} loading={null}>
				<Router>
					<AuthIsLoaded>
						<Switch>
							<Suspense fallback={<SplashScreen />}>
								<Route exact path='/'>
									<Home />
								</Route>
								<Route exact path='/email_verification/:id'>
									<AuthLink />
								</Route>
								<Route exact path='/policy'>
									<Terms />
								</Route>
								<Route exact path='/auth/:id'>
									<Auth />
								</Route>
								<Route exact path='/404'>
									<PageNotFound />
								</Route>
							</Suspense>
							<Redirect to='/404' />
						</Switch>
					</AuthIsLoaded>
				</Router>
			</PersistGate>
		</Provider>
	);
}

export default App;
