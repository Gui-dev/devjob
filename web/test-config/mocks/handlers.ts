import { http, HttpResponse } from 'msw'

interface RegisterSchemaData {
  name: string
  email: string
  password: string
  role: 'CANDIDATE' | 'RECRUITER'
}

export const handlers = [
  http.post('http://localhost:3333/users/register', async ({ request }) => {
    const data = (await request.json()) as RegisterSchemaData

    if (data.email === 'emailexists@email.com') {
      return HttpResponse.json(
        { error: 'Email already exists' },
        { status: 409 },
      )
    }
    return HttpResponse.json({ userId: 'user-id' }, { status: 201 })
  }),

  http.get('http://localhost:3333/me/stats', () => {
    return HttpResponse.json({})
  }),

  http.get('http://localhost:3333/jobs/me/applications', () => {
    return HttpResponse.json({
      jobApplications: [],
      meta: {
        total: 0,
        page: 1,
        pages: 1,
      },
    })
  }),

  http.get('/api/auth/session', () => {
    return HttpResponse.json(
      {
        user: null, // Importante: deve ser um objeto ou null dentro de um objeto
        expires: '2025-07-02T10:00:00.000Z', // Data de expiração mockada
      },
      { status: 200 },
    )
  }),
]
