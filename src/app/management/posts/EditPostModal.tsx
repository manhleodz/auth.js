import { Button } from '@/components/ui/button'
import React from 'react'
import { XIcon } from '../users/EditUserModal'
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdatePostValues, updatePostSchema } from '@/lib/validate';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updatePost } from './actions';

export default function EditPostModal({ post, user, setModal }: { post: any, user: any, setModal: any }) {

    const { toast } = useToast();

    const form = useForm<UpdatePostValues>({
        resolver: zodResolver(updatePostSchema),
        defaultValues: {
            id: post.id,
            title: post.title,
            content: post.content || "",
            image: post.image,
            userId: post.userId,
            verify: post.verify
        }
    });

    async function onsubmit(data: UpdatePostValues) {
        console.log('onSubmit called', data);
        try {
            await updatePost(data);
            toast({ description: "Updated" });
            setModal(null);
        } catch (error) {
            toast({
                variant: "destructive",
                description: "An error occurred. Please try again.",
            });
        }
    }

    return (
        <div className='w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center bg-[rgb(0,0,0,0.3)]'>
            <div className="w-[450px] rounded-lg bg-background p-6 shadow-lg">
                <div className="w-full flex items-start justify-between relative">
                    <div className='flex-grow space-y-4'>
                        <h1 className='text-xl font-bold'>Chưa xác thực</h1>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onsubmit)}
                                className="space-y-2.5"
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter title" {...field} />
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
                                                <Input placeholder="Enter content" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {post.image &&
                                    <Image
                                        src={post.image}
                                        alt='logo'
                                        width={200}
                                        height={200}
                                    />}
                                <div className='flex items-center justify-between w-full'>
                                    <p className="text-muted-foreground">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="verify"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Verify</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value.toString()}
                                                    onValueChange={(value) => field.onChange(value === "true")}
                                                >
                                                    <SelectTrigger className="w-[100px]">
                                                        <SelectValue placeholder="Verify" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="true">True</SelectItem>
                                                        <SelectItem value="false">False</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
    )
}
