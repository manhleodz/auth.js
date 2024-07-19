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
import { signIn } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { FormLoginSchema } from '@/lib/validate';

async function loginAction(data: z.infer<typeof FormLoginSchema>) {
  try {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (res?.error) {
      return {
        error: true,
        message: res.error
      }
    }

    return {
      error: false,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
}

const SignInForm = () => {

  const router = useRouter();
  const form = useForm<z.infer<typeof FormLoginSchema>>({
    resolver: zodResolver(FormLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, formState, register, setError } = form;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await loginAction(data);
      console.log(res);

      if (res.error === true) {

        setError("root", {
          message: res.message,
        });
        return;
      }

      router.push("/");
    } catch (error: any) {
      setError("root", {
        message: error?.message,
      });
    }
  });

  return (
    <div
      className={` my-16 flex flex-col items-center justify-center rounded-[50px] p-10 backdrop-blur-[2px] w-[400px] shadow-2xl`}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}
    >
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className=' w-full'
        >
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className=' w-full'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='manhleo@gmail.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className=' cursor-pointer w-full h-[50px] text-[20px] my-5 bg-primary rounded-[50px] font-bold' type='submit'>
            Sign in
          </Button>
        </form>
        <div className='mx-auto my-4 flex w-full text-black items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
          or
        </div>
        <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
        <p className='text-center text-sm text-white mt-2'>
          If you don&apos;t have an account, please&nbsp;
          <Link className='text-blue-600 hover:underline' href='/register'>
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignInForm;
