import { useDispatch } from 'react-redux';
import axios from '../api/axios';
import { updateUser } from '../redux/userReducer';
import { setCurrentToken } from '../redux/accessTokenReducer';

const useRefreshToken = () => {
    const dispatch = useDispatch();

    const refresh = async () => {
        const response = await axios.get('/auth/refresh-token', {
            withCredentials: true
        });
        
        dispatch(updateUser(response?.data?.userInfo))
        dispatch(setCurrentToken(response?.data?.accessToken))

        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;