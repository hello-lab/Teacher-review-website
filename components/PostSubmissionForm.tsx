"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { PostSubmissionSchema, type PostSubmission } from "@/lib/schemas";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { submitPost,submitTeacher } from "@/lib/actions";
import { authClient } from "@/lib/auth-client";

export function PostSubmissionForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const form = useForm<PostSubmission>({
    resolver: zodResolver(PostSubmissionSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  const handleSubmit = async (data: PostSubmission) => {
    // Redirect to login if user is not authenticated
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("url", data.url);

      await submitPost(formData);

      form.reset();
      toast.success("Post submitted successfully!");
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit post");
    }
  };

  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-card border border-border shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col w-full items-end gap-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full space-y-0">
                <FormLabel className="sr-only">Title</FormLabel>
                <FormControl className="w-full">
                  <Input
                    placeholder="Title*"
                    aria-label="Title"
                    {...field}
          className="w-full shadow-none bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder:text-tertiary dark:placeholder:text-tertiary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full space-y-0">
                <FormLabel className="sr-only">URL</FormLabel>
                <FormControl className="w-full">
                  <Input
                    placeholder="Link URL*"
                    aria-label="URL"
                    {...field}
          className="w-full bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder:text-tertiary dark:placeholder:text-tertiary shadow-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} variant="default" className="w-fit flex items-center gap-2">
            {isSubmitting && <Spinner size="sm" />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
export function PostSubmissionForm1() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const form = useForm<PostSubmission>({
    resolver: zodResolver(PostSubmissionSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  const handleSubmit = async (data: PostSubmission) => {
    // Redirect to login if user is not authenticated
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("url", data.url);

      await submitTeacher(formData);

      form.reset();
      toast.success("Teacher submitted successfully!");
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit post");
    }
  };

  return (
    <div className="border border-gray-200 dark:border-[#023430] rounded-lg p-3 bg-gray-50 dark:bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col w-full items-end gap-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full space-y-0">
                <FormLabel className="sr-only">Title</FormLabel>
                <FormControl className="w-full">
                  <Input
                    placeholder="Title*"
                    aria-label="Title"
                    {...field}
          className="w-full shadow-none bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder:text-tertiary dark:placeholder:text-tertiary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full space-y-0">
                <FormLabel className="sr-only">URL</FormLabel>
                <FormControl className="w-full">
                  <Input
                    placeholder="Link URL*"
                    aria-label="URL"
                    {...field}
          className="w-full bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder:text-tertiary dark:placeholder:text-tertiary shadow-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#00ED64] w-fit text-[#001E2B] transition-colors duration-200 hover:bg-[#58C860] font-semibold flex items-center gap-2 shadow-none"
          >
            {isSubmitting && <Spinner size="sm" />}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}