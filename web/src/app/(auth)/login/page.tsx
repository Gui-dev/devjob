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
    <div className="flex flex-col items-center justify-center h-svh w-full">
      <form
        className="flex flex-col items-center justify-center gap-4 w-md bg-zinc-900 rounded-md mt-10 p-4"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="text-center">
          <h2>Faça login</h2>
          <h3 className="text-xs font-bold">Rápido e fácil</h3>
        </div>

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
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
      <p className="text-sm text-center mt-4">
        Não possui uma conta?{' '}
        <Link href="/register" className="text-base text-yellow-500 font-bold">
          Faça seu cadastro aqui
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
