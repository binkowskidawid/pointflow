'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { UserRole } from '@pointflow/contracts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { authApi } from '@/lib/api/auth'
import { useAuthSession } from '@/lib/auth/session'
import { getApiErrorMessage } from '@/lib/get-api-error-message'

// Roles that can be assigned when creating staff.
// OWNER can assign any; MANAGER can assign only up to MANAGER — enforced on BE.
const ROLE_OPTIONS = [
  { value: UserRole.RECEPTIONIST, label: 'Receptionist' },
  { value: UserRole.MANAGER, label: 'Manager' },
  { value: UserRole.OWNER, label: 'Owner' },
] as const

const createStaffSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Please enter a valid email address'),
    phoneNumber: z
      .string()
      .min(9, 'Phone number must be at least 9 digits')
      .transform((val) => val.replace(/\D/g, '').slice(-9))
      .refine(
        (val) => val.length === 0 || val.length === 9,
        'Phone number must be exactly 9 digits',
      ),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    role: z.enum([UserRole.RECEPTIONIST, UserRole.MANAGER, UserRole.OWNER] as [
      UserRole.RECEPTIONIST,
      UserRole.MANAGER,
      UserRole.OWNER,
    ]),
    tenantId: z.uuid(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type CreateStaffFormValues = z.infer<typeof createStaffSchema>

export default function NewStaffUserPage() {
  const router = useRouter()
  const { status, user } = useAuthSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateStaffFormValues>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: UserRole.RECEPTIONIST,
      tenantId: user?.tenantId ?? '',
    },
  })

  async function onSubmit(values: CreateStaffFormValues) {
    setIsSubmitting(true)

    try {
      await authApi.createStaff({
        name: values.name,
        email: values.email,
        password: values.password,
        tenantId: values.tenantId,
        role: values.role,
        phoneNumber: values.phoneNumber || null,
      })

      toast.success(`Staff account created for ${values.name}`)
      router.push('/settings')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to create account.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">New staff account</h1>
        <p className="text-sm text-zinc-400">
          Create a login for a new team member. They can sign in immediately.
        </p>
      </div>

      <Card className="max-w-2xl border-zinc-800 bg-zinc-900/80">
        <CardHeader>
          <CardTitle className="text-lg">Account details</CardTitle>
          <CardDescription>
            The role determines what this person can access in the dashboard.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" autoComplete="name" {...field} />
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-w-32 bg-black/80 backdrop-blur-sm">
                          {ROLE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@company.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" autoComplete="tel" {...field} />
                      </FormControl>
                      <FormDescription className="text-[10px] leading-tight">
                        Saved as last 9 digits.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/settings')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || status === 'checking'}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Create account
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
