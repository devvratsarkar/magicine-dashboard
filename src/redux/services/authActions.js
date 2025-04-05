// import { API_BASE_URL } from '../../utils/config';
// import axios from 'axios';
// import { loader, loginSuccess, logoutSuccess } from '../slices/authSlice';
// import toast from 'react-hot-toast';
// import { axiosInstance } from '../../utils/baseApi';

// export const login = (credentials, navigate) => async (dispatch) => {
//     try {
//         dispatch(loader(true));
//         const response = await axiosInstance.post(`${API_BASE_URL}/auth/sign-in`, credentials);
//         console.log(response);
//         dispatch(loginSuccess(response.data.token));
//         if (response.status === 200) {
//             // navigate("/dashboard");
//             dispatch(loader(false));
//             toast.success(response.data.message);
//             console.log(Date());
//         }
//         return true;
//     } catch (error) {
//         console.error(error)
//         dispatch(loader(false));
//         if (error) {
//             toast.error(error.response.data.message)
//         }
//         return false;
//     }
// };

// export const logout = () => async (dispatch) => {
//     try {
//         await axios.post('/logout');
//         dispatch(logoutSuccess());
//     } catch (error) {
//     }
// };