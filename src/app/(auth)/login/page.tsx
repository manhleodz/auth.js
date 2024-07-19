import { auth } from '@/auth';
import SignInForm from '@/components/form/SignInForm';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
    title: "Login",
};

const Login: React.FC = () => {

    return (
        <div className=' w-full bg-white flex-grow overflow-hidden p-10 flex flex-col items-center justify-center'>
            <h1 className=' text-4xl font-bold'>Login Page</h1>
            <SignInForm />
        </div>
    );
};

export default Login;
