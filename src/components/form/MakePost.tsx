"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

interface props {
    userId: string
}

export const createPost = z.object({
    title: z.string().trim().min(1, "Cannot be empty"),
    content: z.string().trim(),
    file: z.any()
});

export default function MakePost({ userId }: props) {

    const { toast } = useToast();

    const fileRef = useRef(null);
    const focusInput = (inputRef: any) => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const form = useForm<z.infer<typeof createPost>>({
        resolver: zodResolver(createPost),
        defaultValues: { title: "", content: "", file: undefined },
    });
    const onSubmit = async (values: z.infer<typeof createPost>) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", values.content);
        values.file && formData.append("file", values.file[0]);
        formData.append("userId", userId);
        await fetch('/api/posts', {
            method: "POST",
            body: formData
        }).then((e) => {
            toast({ description: "Wait for admin.OKE!" });
            form.reset();
        }).catch(e => {
            toast({
                variant: "destructive",
                description: "An error occurred. Please try again.",
            });
        })
    }

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-[500px] space-y-2.5"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter a username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter a username" className=' resize-none' rows={6} itemType='string' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Upload File</FormLabel>
                                <FormControl>
                                    <Input type='file' onChange={(e) => field.onChange(e.target.files)} onSubmit={() => field.onChange(null)}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            Post
                        </Button>
                        <div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
                            <button type="button" className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 20">
                                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6" />
                                </svg>
                                <span className="sr-only">Attach file</span>
                            </button>
                            <button onClick={() => focusInput(fileRef)} type="button" className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                </svg>
                                <span className="sr-only">Upload image</span>
                            </button>
                        </div>
                    </div>
                </form>
            </Form >
        </>
    )
}
