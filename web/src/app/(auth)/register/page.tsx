'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import {
  registerSchema,
  type RegisterSchemaData,
} from '@/validations/register-schema'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

const RegisterPage = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<RegisterSchemaData>({ resolver: zodResolver(registerSchema) })
  const router = useRouter()

  const selectedRole = watch('role')

  const handleRegister = async (data: RegisterSchemaData) => {
    try {
      await api.post('/users/register', data)
      toast.success('Cadastro realizado com sucesso!')
      router.push('/login')
    } catch (error) {
      const err = error as AxiosError
      if (err.response?.status === 409) {
        toast.error('Este e-mail já está em uso')
      }
      console.log('ERROR: ', err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-svh w-full">
      <form
        className="flex flex-col items-center justify-center gap-4 w-md bg-zinc-900 rounded-md mt-10 p-4"
        onSubmit={handleSubmit(handleRegister)}
      >
        <div className="text-center">
          <h2>Faça seu cadastro</h2>
          <h3 className="text-xs font-bold">Rápido e fácil</h3>
        </div>
        <div className="w-full space-y-1">
          <Input type="text" placeholder="Nome" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
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

        <div className="w-full space-y-3">
          <Label>Tipo de conta:</Label>
          <Select
            value={selectedRole}
            onValueChange={value =>
              setValue('role', value as RegisterSchemaData['role'])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um tipo de conta" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="CANDIDATE">Candidato</SelectItem>
              <SelectItem value="RECRUITER">Recrutador</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-red-500" data-testid="role-error">
              {errors.role.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Criar conta
        </Button>
      </form>
      <p className="text-sm text-center mt-4">
        Já possui uma conta?{' '}
        <Link href="/login" className="text-base text-yellow-500 font-bold">
          Fazer login
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage
