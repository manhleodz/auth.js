"use client"
import { FC, ReactNode } from 'react';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface GoogleSignInButtonProps {
  children: ReactNode;
}
const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  
  const router = useRouter();
  const loginWithGoogle = () => signIn("google")
  .then((e) => {
    if (e?.ok) router.push("/");
  })
  .catch(e => alert("Error!!!"));

  return (
    <Button onClick={loginWithGoogle} className='w-[300px] text-white'>
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
