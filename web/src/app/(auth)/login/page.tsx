'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginSchemaData } from '@/validations/login-schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const LoginPage = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginSchemaData>({ resolver: zodResolver(loginSchema) })
  const router = useRouter()

  const handleLogin = async (data: LoginSchemaData) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (result?.ok) {
        toast.success('Login realizado com sucesso')
        router.push('/')
      } else {
        toast.error('Email ou senha incorretos')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh px-4">
      <Card className="w-full max-w-md shadow-lg border border-zinc-800 bg-zinc-950">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Entrar
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Acesse sua conta para encontrar oportunidades incríveis
          </CardDescription>
        </CardHeader>

        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit(handleLogin)}
        >
          <CardContent className="space-y-4 w-full">
            <div className="w-full space-y-1">
              <Input type="email" placeholder="Email" {...register('email')} />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="w-full space-y-1">
              <Input
                type="password"
                placeholder="Senha"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 w-full">
            <Button type="submit" className="w-full">
              Entrar
            </Button>

            <p className="text-sm text-zinc-400 text-center mt-4">
              Não possui uma conta?{' '}
              <Link
                href="/register"
                className="text-yellow-500 font-medium hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default LoginPage
