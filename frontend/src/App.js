
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { Provider } from 'react-redux';
import store from './redux/store';
import AdminDashboard from './admin/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import CreatePost from './admin/CreatePost';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Layout from './admin/global/Layout'
import EditPost from './admin/EditPost';
import UserDashboard from './user/UserDashboard';
import SinglePost from './pages/SinglePost';
import Profile from './pages/Profile';
import './App.css';
import FirstPage from './pages/FirstPage';
import CreateUser from './admin/CreateUser';
import AdminUserUpdate from './admin/AdminUserUpdate';

//HOC
const AdminDashboardHOC = Layout(AdminDashboard);
const CreatePostHOC = Layout(CreatePost);
const EditPostHOC = Layout(EditPost);
const UserDashboardHOC = Layout(UserDashboard);
const UserProfile = Layout(Profile);
const AdminProfile = Layout(Profile);
const AdminHomeHOC = Layout(Home);
const UserHomeHOC = Layout(Home);
const CreateUserHOC = Layout(CreateUser);


const App = () => {
  return (
    <>
      <ToastContainer />
      <Provider store={store}>
        <ProSidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<FirstPage />} />
              <Route path='/login' element={<LogIn />} />
              <Route path='/register' element={<Register />} />
              <Route path='/post/:id' element={<SinglePost />} />
              <Route path='*' element={<NotFound />} />
              <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboardHOC /></AdminRoute>} />
              <Route path='/admin/profile' element={<AdminRoute><AdminProfile /></AdminRoute>} />
              <Route path='/admin/user/create' element={<AdminRoute><CreateUserHOC /></AdminRoute>} />
              <Route path='/admin/post/create' element={<AdminRoute><CreatePostHOC /></AdminRoute>} />
              <Route path='/admin/updateUser/:id' element={<AdminRoute><AdminUserUpdate /></AdminRoute>} />
              <Route path='/admin/home' element={<AdminRoute><AdminHomeHOC /></AdminRoute>} />
              <Route path='/admin/post/edit/:id' element={<AdminRoute><EditPostHOC /></AdminRoute>} />
              <Route path='/user/dashboard' element={<UserRoute><UserDashboardHOC /></UserRoute>} />
              <Route path='/user/home' element={<UserRoute><UserHomeHOC /></UserRoute>} />
              <Route path='/user/post/create' element={<UserRoute><CreatePostHOC /></UserRoute>} />
              <Route path='/user/profile' element={<UserRoute><UserProfile /></UserRoute>} />
              <Route path='/user/post/edit/:id' element={<UserRoute><EditPostHOC /></UserRoute>} />
            </Routes>
          </BrowserRouter>
        </ProSidebarProvider>

      </Provider>
    </>
  )
}

export default App