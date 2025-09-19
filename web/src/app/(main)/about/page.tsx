import Image from 'next/image'
import { Github, LinkedinIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Sobre a <strong className="text-primary">Devjobs</strong>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Conectando talentos a oportunidades - de forma rápida, justa e
          transparente.
        </p>
      </div>

      <div className="relative w-full h-64 md:h-80 lg:h-96 mb-4">
        <Image
          src="/images/hero.png"
          alt="Ilustração representando colaboração e tecnologia"
          fill
          className="object-contain"
          priority
        />
      </div>

      <Card>
        <CardContent className="prose prose-invert max-w-none p-8 leading-relaxed">
          <p>
            A <strong>DevJobs</strong> nasceu com o propósito de simplificar o
            processo de recrutamento e aplicação para vagas de tecnologia. Nós
            acreditamos que o talento deve falar mais alto que a burocracia, por
            isso criamos uma plataforma que conecta candidatos e recrutadores de
            forma simples, rápida e eficiente.
          </p>

          <p>
            Para os{' '}
            <span className="text-yellow-500 font-semibold">candidatos</span>,
            oferecemos uma experiência ágil, onde é possível encontrar vagas que
            realmente fazem sentido para sua carreira, se candidatar em poucos
            cliques e acompanhar o status de cada aplicação.
          </p>

          <p>
            Para os{' '}
            <span className="text-yellow-500 font-semibold">recrutadores</span>,
            proporcionamos um painel completo para acompanhar candidaturas,
            gerenciar vagas e encontrar os melhores talentos de maneira prática
            e organizada.
          </p>

          <p>
            Já para os{' '}
            <span className="text-yellow-500 font-semibold">
              administradores
            </span>
            , disponibilizamos ferramentas avançadas de monitoramento e
            estatísticas, garantindo segurança, transparência e qualidade em
            toda a plataforma.
          </p>

          <p>
            Nosso compromisso é com a <strong>inovação</strong>,{' '}
            <strong>inclusão</strong> e <strong>transparência</strong>. Queremos
            que cada profissional encontre a oportunidade certa e que cada
            empresa encontre o talento ideal.
          </p>
        </CardContent>
      </Card>

      <section className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Card>
          <CardContent className="p-6 space-y-2">
            <h3 className="text-xl font-semibold text-yellow-500">Inovação</h3>
            <p className="text-sm text-muted-foreground">
              Usamos tecnologia para transformar a forma como pessoas e empresas
              se conectam.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <h3 className="text-xl font-semibold text-yellow-500">Inclusão</h3>
            <p className="text-sm text-muted-foreground">
              Acreditamos que talento não tem fronteiras e oportunidades devem
              ser acessíveis a todos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-2">
            <h3 className="text-xl font-semibold text-yellow-500">
              Transparência
            </h3>
            <p className="text-sm text-muted-foreground">
              Priorizamos clareza e honestidade em cada etapa do processo.
            </p>
          </CardContent>
        </Card>
      </section>

      <footer className="flex flex-col items-center justify-center gap-6">
        <p className="text-sm text-muted-foreground">
          &copy; 2025 DevJobs. Todos os direitos reservados.
        </p>
        <p className="flex items-center gap-4">
          <a
            className="text-sm text-primary underline"
            href="https://github.com/dracarys"
          >
            <Github />
          </a>
          <a
            className="text-sm text-primary underline"
            href="https://linkedin.com/dracarys"
          >
            <LinkedinIcon />
          </a>
        </p>
      </footer>
    </div>
  )
}

export default AboutPage
