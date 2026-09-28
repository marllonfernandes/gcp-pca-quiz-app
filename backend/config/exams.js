const EXAMS_CATALOG = [
  {
    id: 'gcp-pca',
    code: 'PCA',
    name: 'Google Cloud Professional Cloud Architect',
    name_pt: 'Google Cloud Professional Cloud Architect',
    shortName: 'Cloud Architect',
    level: 'Professional',
    badgeColor: '#1a73e8',
    status: 'active',
    totalQuizzes: 7,
    totalQuestions: 420,
    passingScore: '70%',
    durationMinutes: 120,
    examFeeUsd: 200,
    description: 'Planeje, desenvolva e gerencie soluções de arquitetura robustas, seguras, escaláveis e altamente disponíveis no Google Cloud.',
    description_en: 'Design, develop, and manage robust, secure, scalable, and highly available architectures on Google Cloud.',
    domainsCount: 6,
    sections: {
      "1": { name: "Designing and Planning a Cloud Solution Architecture", name_pt: "Projetando e Planejando a Arquitetura em Nuvem", weight: "25%", color: "#1a73e8" },
      "2": { name: "Managing and Provisioning Cloud Solution Infrastructure", name_pt: "Gerenciamento e Provisionamento de Infraestrutura", weight: "17.5%", color: "#34a853" },
      "3": { name: "Designing for Security and Compliance", name_pt: "Segurança e Conformidade", weight: "17.5%", color: "#ea4335" },
      "4": { name: "Analyzing and Optimizing Technical and Business Processes", name_pt: "Otimização de Processos Técnicos e de Negócio", weight: "15%", color: "#fbbc05" },
      "5": { name: "Managing Implementation", name_pt: "Gerenciamento de Implementação", weight: "12.5%", color: "#9334e8" },
      "6": { name: "Ensuring Solution and Operations Excellence", name_pt: "Excelência em Operações e Confiabilidade", weight: "12.5%", color: "#00acc1" }
    }
  },
  {
    id: 'gcp-ace',
    code: 'ACE',
    name: 'Google Cloud Associate Cloud Engineer',
    name_pt: 'Google Cloud Associate Cloud Engineer',
    shortName: 'Associate Cloud Engineer',
    level: 'Associate',
    badgeColor: '#34a853',
    status: 'coming_soon',
    totalQuizzes: 5,
    totalQuestions: 300,
    passingScore: '70%',
    durationMinutes: 120,
    examFeeUsd: 125,
    description: 'Implemente aplicativos, monitore operações e gerencie soluções corporativas fundamentais na nuvem Google.',
    description_en: 'Deploy applications, monitor operations, and manage enterprise solutions on Google Cloud.',
    domainsCount: 5,
    sections: {
      "1": { name: "Setting up a cloud solution environment", name_pt: "Configuração do ambiente em nuvem", weight: "18%", color: "#34a853" },
      "2": { name: "Planning and configuring a cloud solution", name_pt: "Planejamento e configuração de recursos", weight: "18%", color: "#1a73e8" },
      "3": { name: "Deploying and implementing a cloud solution", name_pt: "Implantação e implementação em nuvem", weight: "25%", color: "#ea4335" },
      "4": { name: "Ensuring successful operation of a cloud solution", name_pt: "Garantia de operação bem-sucedida", weight: "20%", color: "#fbbc05" },
      "5": { name: "Configuring access and security", name_pt: "Configuração de acessos e segurança", weight: "19%", color: "#9334e8" }
    }
  },
  {
    id: 'gcp-pde',
    code: 'PDE',
    name: 'Google Cloud Professional Data Engineer',
    name_pt: 'Google Cloud Professional Data Engineer',
    shortName: 'Data Engineer',
    level: 'Professional',
    badgeColor: '#ea4335',
    status: 'coming_soon',
    totalQuizzes: 5,
    totalQuestions: 300,
    passingScore: '70%',
    durationMinutes: 120,
    examFeeUsd: 200,
    description: 'Projete sistemas de dados escaláveis, pipelines com BigQuery, Dataflow, Dataproc, Pub/Sub e IA Generativa.',
    description_en: 'Design scalable data processing systems, ETL pipelines with BigQuery, Dataflow, and ML.',
    domainsCount: 4,
    sections: {
      "1": { name: "Designing data processing systems", name_pt: "Design de sistemas de processamento de dados", weight: "22%", color: "#ea4335" },
      "2": { name: "Ingesting and processing data", name_pt: "Ingestão e processamento de dados (Streaming/Batch)", weight: "25%", color: "#1a73e8" },
      "3": { name: "Storing data and managing pipelines", name_pt: "Armazenamento e governança de pipelines", weight: "28%", color: "#34a853" },
      "4": { name: "Security, compliance, and scalability", name_pt: "Segurança, conformidade e escalabilidade", weight: "25%", color: "#fbbc05" }
    }
  },
  {
    id: 'gcp-pcse',
    code: 'PCSE',
    name: 'Google Cloud Professional Cloud Security Engineer',
    name_pt: 'Google Cloud Professional Cloud Security Engineer',
    shortName: 'Security Engineer',
    level: 'Professional',
    badgeColor: '#fbbc05',
    status: 'coming_soon',
    totalQuizzes: 4,
    totalQuestions: 240,
    passingScore: '70%',
    durationMinutes: 120,
    examFeeUsd: 200,
    description: 'Implemente segurança de ponta a ponta, governança de acessos (IAM), CMEK/KMS e VPC Service Controls.',
    description_en: 'Implement end-to-end security, identity governance (IAM), encryption with CMEK, and VPC Service Controls.',
    domainsCount: 5,
    sections: {
      "1": { name: "Configuring access within cloud environments", name_pt: "Controle de acesso e identidades (IAM / Workload)", weight: "21%", color: "#fbbc05" },
      "2": { name: "Managing network security", name_pt: "Segurança de redes (Cloud Armor, Firewalls, VPC-SC)", weight: "21%", color: "#1a73e8" },
      "3": { name: "Ensuring data protection", name_pt: "Proteção de dados (CMEK, Cloud KMS, DLP, Secrets)", weight: "20%", color: "#ea4335" },
      "4": { name: "Managing operations within cloud environments", name_pt: "Monitoramento de segurança, Logging e SIEM", weight: "19%", color: "#34a853" },
      "5": { name: "Ensuring compliance and posture", name_pt: "Conformidade regulatória e postura (SCC)", weight: "19%", color: "#9334e8" }
    }
  },
  {
    id: 'gcp-devops',
    code: 'DevOps',
    name: 'Google Cloud Professional Cloud DevOps Engineer',
    name_pt: 'Google Cloud Professional Cloud DevOps Engineer',
    shortName: 'DevOps & SRE',
    level: 'Professional',
    badgeColor: '#9334e8',
    status: 'coming_soon',
    totalQuizzes: 4,
    totalQuestions: 240,
    passingScore: '70%',
    durationMinutes: 120,
    examFeeUsd: 200,
    description: 'Engenharia de Confiabilidade de Sites (SRE), esteiras de CI/CD automatizadas e observabilidade com SLOs.',
    description_en: 'Site Reliability Engineering (SRE), automated CI/CD pipelines, and observability with SLIs/SLOs.',
    domainsCount: 5,
    sections: {
      "1": { name: "Applying site reliability engineering (SRE) principles", name_pt: "Princípios de SRE e confiabilidade de serviços", weight: "22%", color: "#9334e8" },
      "2": { name: "Building and implementing CI/CD pipelines", name_pt: "Construção de pipelines de CI/CD e entrega contínua", weight: "24%", color: "#1a73e8" },
      "3": { name: "Implementing service monitoring strategies", name_pt: "Monitoramento de serviços, métricas e SLIs/SLOs", weight: "20%", color: "#34a853" },
      "4": { name: "Managing service availability and incidents", name_pt: "Gestão de incidentes e post-mortem", weight: "18%", color: "#ea4335" },
      "5": { name: "Optimizing service performance", name_pt: "Otimização de desempenho e governança de custos", weight: "16%", color: "#00acc1" }
    }
  }
];

module.exports = { EXAMS_CATALOG };
