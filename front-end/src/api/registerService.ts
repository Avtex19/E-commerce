import axios from 'axios';
const base_url = 'http://localhost:8000/';

const axiosInstance = axios.create({
    baseURL: base_url,
})

interface RegisterData {
    username: string;
    email: string;
    password: string;
    password2: string;

}

export const register = async(data: RegisterData) => {
    try{
        const response = await axiosInstance.post('account/register/', data);
        console.log(response.data);
        return response.data;
    }
    catch(error:any){
        if(error.response && error.response.status === 401) {
            throw new Error('Invalid credentials');
        } else{
            throw new Error('Something went wrong');
        }
    }
}
