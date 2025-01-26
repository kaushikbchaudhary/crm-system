"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {useToast} from "@/hooks/use-toast";
import {useContext} from "react";
import {apiContext} from "@/infrastructure/api/ApiContext";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function AdminLogin() {
  const router = useRouter();
  // @ts-ignore
    const { callApi } = useContext(apiContext);
    const { toast } = useToast();


    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

 async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement actual authentication
      console.log("Toast test 1")
      console.log("values", values)
try{
   const response = await callApi({url:'user/login',method:"POST",body:values});
   console.log('response:::',response);
    toast({
        title: 'Success',
        description: 'login successful!',
    });

}catch(e){
    console.error(e);
}
    if (values.email === "admin@example.com" && values.password === "kaushik@123") {
        console.log('Toast function executed!')
        toast({
            title: 'Success',
            description: 'login successful!',
        });
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}