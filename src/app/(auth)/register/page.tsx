import SignUpForm from '@/components/form/SignUpForm';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: "Register",
};

export default function Register() {
    return (
        <div className=' min-w-full overflow-y-hidden h-full p-10 flex flex-col items-center justify-center'>
            <h1 className=' text-4xl font-bold'>Register Page</h1>
            <SignUpForm />
        </div>
    )
}
