import React from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
    const handleRegisterSuccess = () => {
        console.log("Registration was successful!");
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
        </div>
    );
};

export default RegisterPage;
