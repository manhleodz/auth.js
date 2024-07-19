"use client"

import { JSX, SVGProps, useEffect, useState } from 'react';
import { User } from '@prisma/client';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import default_user from "@/assets/user.png";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateProfile } from './actions';
import { UpdateProfileValues, updateProfileSchema } from "@/lib/validate";
import { useToast } from '@/components/ui/use-toast';

export default function EditAdminModal({ userId, setModal }: { userId: string | null, setModal: any }) {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);

    const form = useForm<UpdateProfileValues>({
        resolver: zodResolver(updateProfileSchema),
    });

    async function onsubmit(data: UpdateProfileValues) {
        console.log('onSubmit called', data);
        try {
            await updateProfile(data);
            toast({ description: "Updated." });
            setModal(null);
        } catch (error) {
            toast({
                variant: "destructive",
                description: "An error occurred. Please try again.",
            });
        }
    }

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch(`/api/user/${userId}`);
            const data: User = await response.json();
            setUser(data);
            form.setValue("id", data.id);
            form.setValue("email", data.email);
            form.setValue("name", data.name);
            form.setValue("role", data.role);
        };
        if (!user && userId) {
            getUser();
        }
    }, [userId]);

    if (!userId || !user) return null;

    return (
        <div className='w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center bg-[rgb(0,0,0,0.3)]'>
            <div className="w-[450px] rounded-lg bg-background p-6 shadow-lg">
                <div className="w-full flex items-start justify-between relative">
                    <div className='flex-grow space-y-4'>
                        <h1 className='text-xl font-bold'>{user.name}</h1>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onsubmit)}
                                className="space-y-2.5"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter a name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Image
                                    src={user.image ? user.image : default_user}
                                    alt='logo'
                                    width={80}
                                    height={80}
                                    className='rounded-full'
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter a email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <FormControl>
                                                <Select
                                                    defaultValue={user.role}
                                                    value={field.value || user.role}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className="w-[100px]">
                                                        <SelectValue placeholder="Role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="user">USER</SelectItem>
                                                        <SelectItem value="admin">ADMIN</SelectItem>
                                                        <SelectItem value="root">ROOT</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='flex items-center justify-between w-full'>
                                    <p className="text-muted-foreground">
                                        User since {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </div>
                    <Button onClick={() => setModal(null)} variant="ghost" className="absolute top-0 right-0 rounded-lg w-8 h-8 flex items-center justify-center p-0 hover:bg-muted">
                        <XIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}
