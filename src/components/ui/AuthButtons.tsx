"use client"
import { redirect, useRouter } from 'next/navigation'
import { Button } from './button'
import { signIn, signOut, useSession } from 'next-auth/react'
import { DropdownMenu, DropdownMenuItem } from './dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

export default function AuthButtons() {
    const router = useRouter();
    const { data } = useSession();
    const user = data?.user;

    return (
        <>
            {data ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.image ? user.image : "/placeholder-user.jpg"} />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className=' bg-white rounded-xl' style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}>
                        <div className="flex items-center gap-2 p-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-0.5 leading-none">
                                <div className="font-semibold">{user?.name}</div>
                                <div className="text-sm text-muted-foreground">{user?.email}</div>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/user/${user?.id}`} className="flex items-center gap-2 w-full" prefetch={false}>
                                <div className="h-4 w-4" />
                                <span>My Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="#" className="flex items-center gap-2 w-full" prefetch={false}>
                                <div className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem> */}
                        <Button onClick={() => signOut()} variant="outline" size="sm" className=' w-full flex items-center gap-2 justify-start rounded-b-xl border-none'>
                            <div className="h-4 w-3" />
                            <span>Logout</span>
                        </Button>
                        {/* </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <Button onClick={() => signIn()} variant="outline" size="sm">
                        Sign in
                    </Button>
                    <Button size="sm" onClick={() => router.push("/register")} className=" bg-black text-white">Sign up</Button>
                </>
            )}
        </>
    )
}
