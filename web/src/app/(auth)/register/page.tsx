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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
      if (err.response?.status === 409 || err.status === 409) {
        toast.error('Este e-mail já está em uso')
      }
      console.log('ERROR: ', err)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-svh px-4">
      <div className="absolute bottom-[-20px] left-[-30px] size-20 bg-primary rounded-full z-[-1]" />
      <div className="absolute top-[-20px] right-[-13px] size-40 bg-primary rounded-full z-[-1]" />
      <div className="absolute top-[480px] right-[315px] size-30 bg-primary rounded-full z-[-1]" />
      <div className="absolute top-40 left-30 size-44 bg-primary rounded-full z-[-1]" />

      <Card className="w-full max-w-md shadow-lg border border-zinc-800 bg-zinc-950">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Criar conta
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Comece sua jornada com a DevJobs agora mesmo
          </CardDescription>
        </CardHeader>

        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit(handleRegister)}
        >
          <CardContent className="w-full space-y-4">
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
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
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
          </CardContent>

          <CardFooter className="flex flex-col gap-4 w-full">
            <Button type="submit" className="w-full">
              Criar conta
            </Button>

            <p className="text-sm text-center mt-4">
              Já possui uma conta?{' '}
              <Link
                href="/login"
                className="text-yellow-500 font-semibold hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default RegisterPage
