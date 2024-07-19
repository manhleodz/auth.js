'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../GoogleSignInButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const FormSchema = z
  .object({
    Name: z.string().min(1, 'Name is required').max(30),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  });

const SignUpForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    await fetch('/api/auth/register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.Name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: "user"
      })
    }).then((e) => {
      if (e.status === 201) router.push("/login");
      if (e.status === 409) setErrorMessage("User with this email already exits");
    })
  };

  return (
    <div
      className={` my-16 flex flex-col items-center justify-center rounded-[50px] p-10 backdrop-blur-[2px] w-[400px] border border-white shadow-2xl`}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=' w-full'
        >
          <div className='w-full space-y-5'>
            <FormField
              control={form.control}
              name='Name'
              render={({ field }) => (
                <FormItem className=' w-full relative'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='manhleo' {...field} />
                  </FormControl>
                  <FormMessage className=' absolute -bottom-5 left-0 z-50 text-red-800' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className=' w-full relative'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='mail@example.com' {...field} />
                  </FormControl>
                  <div className='absolute -bottom-5 left-0 z-50 text-red-800'>
                    <p className='text-sm font-medium text-destructive'>{errorMessage && errorMessage}</p>
                  </div>
                  <FormMessage className=' absolute -bottom-5 left-0 z-50 text-red-800' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className=' w-full relative'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=' absolute -bottom-5 left-0 z-50 text-red-800' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className=' w-full relative'>
                  <FormLabel>Re-Enter your password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Re-Enter your password'
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=' absolute -bottom-5 left-0 z-50 text-red-800' />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={form.formState.isSubmitting} className=' cursor-pointer w-full h-[50px] text-[20px] my-5 bg-primary rounded-[50px] font-bold' type='submit'>
            Sign up
          </Button>
        </form>
        <div className='mx-auto text-primary my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
          or
        </div>
        <GoogleSignInButton>Sign up with Google</GoogleSignInButton>
        <p className='text-center text-sm text-white mt-2'>
          If you don&apos;t have an account, please&nbsp;
          <Link className='text-blue-600 hover:underline' href='/login'>
            Sign in
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignUpForm;
