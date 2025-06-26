import {
  PrismaClient,
  type ApplicationStatus,
  type JobLevel,
  type JobType,
  type Role,
} from './generated/prisma'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function run() {
  await prisma.jobApplication.deleteMany()
  await prisma.job.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await hash('123456', 8)

  // Cria usuários por papel
  const roles: Role[] = ['ADMIN', 'RECRUITER', 'CANDIDATE']

  const usersByRole: Record<Role, any[]> = {
    ADMIN: [],
    RECRUITER: [],
    CANDIDATE: [],
  }

  for (const role of roles) {
    for (let i = 1; i <= 3; i++) {
      const user = await prisma.user.create({
        data: {
          name: `${role.toLowerCase()}-user-${i}`,
          email: `${role.toLowerCase()}${i}@email.com`,
          password: passwordHash,
          role,
        },
      })
      usersByRole[role].push(user)
    }
  }

  const recruiters = usersByRole.RECRUITER
  const candidates = usersByRole.CANDIDATE

  // Cria 10 vagas, distribuídas entre os recrutadores
  const jobs = await Promise.all(
    Array.from({ length: 10 }, (_, i) => {
      const recruiter = recruiters[i % recruiters.length]
      return prisma.job.create({
        data: {
          title: `Dev Pleno - ${i + 1}`,
          description: `Estamos contratando desenvolvedor para projeto ${i + 1}`,
          company: `Empresa ${i + 1}`,
          location: ['São Paulo', 'Remoto', 'BH'][i % 3],
          type: ['ONSITE', 'REMOTE', 'HYBRID'][i % 3] as JobType,
          level: ['JUNIOR', 'PLENO', 'SENIOR'][i % 3] as JobLevel,
          technologies: ['Node.js', 'React', 'TypeScript'].slice(
            0,
            (i % 3) + 1,
          ),
          recruiterId: recruiter.id,
        },
      })
    }),
  )

  // Cada candidato aplica para 3 jobs (sem duplicar combinação jobId + userId)
  const statuses: ApplicationStatus[] = ['PENDING', 'ACCEPTED', 'REJECTED']
  let statusCounter = 0

  for (const candidate of candidates) {
    const shuffledJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 3)

    for (const job of shuffledJobs) {
      await prisma.jobApplication.create({
        data: {
          jobId: job.id,
          userId: candidate.id,
          message: `Olá, gostaria de participar da vaga ${job.title}`,
          githubUrl: `https://github.com/${candidate.name}`,
          linkedinUrl: `https://linkedin.com/in/${candidate.name}`,
          status: statuses[statusCounter % statuses.length],
        },
      })

      statusCounter++
    }
  }

  console.log('✅ Seed populado com sucesso!')
}

run().finally(() => prisma.$disconnect())
