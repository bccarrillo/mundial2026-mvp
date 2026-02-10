'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const translations = {
  es: {
    common: {
      loading: 'Cargando...'
    },
    dashboard: {
      welcome: '¡Bienvenido!',
      createMemory: 'Crear Nuevo Recuerdo',
      viewNFTs: 'Ver Mis NFTs',
      exploreEvents: 'Mis Recuerdos',
      inviteFriends: 'Invitar Amigos',
      viewGallery: 'Ver Galería Pública'
    },
    landing: {
      title: 'Memories26',
      subtitle: 'Comparte tus momentos del Mundial 2026',
      createAccount: 'Crear cuenta gratis',
      viewMemories: 'Ver recuerdos',
      ctaTitle: '¿Listo para guardar tus recuerdos?',
      ctaSubtitle: 'Únete a miles de fanáticos que ya están creando su álbum digital',
      ctaButton: 'Empezar ahora'
    },
    auth: {
      loginTitle: 'Iniciar Sesión',
      registerTitle: 'Crear Cuenta',
      email: 'Correo electrónico',
      password: 'Contraseña',
      loginButton: 'Entrar',
      registerButton: 'Crear Cuenta',
      hasAccount: '¿Ya tienes cuenta?',
      noAccount: '¿No tienes cuenta?',
      forgotPassword: '¿Olvidaste tu contraseña?'
    },
    create: {
      title: 'Crear Recuerdo',
      subtitle: 'Comparte tu momento del Mundial',
      imageRequired: 'Imagen del Recuerdo *',
      selectImage: 'Toca para seleccionar imagen',
      titleRequired: 'Título del Recuerdo *',
      titlePlaceholder: 'Ej: Gol histórico de Colombia',
      description: 'Descripción',
      descriptionPlaceholder: 'Cuenta la historia detrás de este momento...',
      team: 'Equipo',
      selectTeam: 'Seleccionar equipo',
      matchDate: 'Fecha del Partido',
      publicMemory: 'Recuerdo Público',
      publicDescription: 'Otros usuarios podrán ver y dar like a tu recuerdo',
      createButton: 'Crear Recuerdo',
      creating: 'Guardando...'
    },
    feed: {
      title: 'Recuerdos',
      subtitle: 'Explora los momentos del Mundial',
      search: 'Buscar recuerdos...',
      searching: 'Buscando...',
      noResults: 'No se encontraron recuerdos',
      loadingMore: 'Cargando más recuerdos...',
      noMore: 'No hay más recuerdos'
    },
    memory: {
      share: 'Compartir',
      like: 'Me gusta',
      liked: 'Te gusta',
      download: 'Descargar',
      description: 'Descripción',
      createNFT: 'Convertir en NFT',
      nftDescription: 'Crea un certificado digital conmemorativo único en la blockchain.',
      createNFTButton: 'Crear NFT Ahora',
      certified: 'Recuerdo Certificado como NFT',
      comments: 'Comentarios',
      writeComment: 'Escribe un comentario...',
      loginToComment: 'Inicia sesión para comentar',
      commentButton: 'Comentar',
      sending: 'Enviando...',
      noComments: 'No hay comentarios aún. ¡Sé el primero en comentar!',
      notFound: 'Recuerdo no encontrado',
      backToFeed: 'Volver al Feed'
    },
    rankings: {
      title: 'Rankings',
      subtitle: 'Compite con fanáticos de todo el mundo',
      loading: 'Cargando rankings...',
      yourPosition: 'Tu Posición',
      of: 'de',
      users: 'usuarios',
      refresh: 'Actualizar',
      updating: 'Actualizando...',
      noUsers: 'No hay usuarios en el ranking aún',
      wantToClimb: '¿Quieres subir en el ranking?',
      climbDescription: 'Crea recuerdos, recibe likes y obtén puntos de participación para escalar posiciones',
      createMemoryPoints: 'Crear Recuerdo (+10 puntos de participación)',
      viewGallery: 'Ver Galería Pública'
    },
    invite: {
      title: 'Invitar Amigos',
      subtitle: 'Obtén puntos de participación por cada amigo que se registre',
      loading: 'Cargando...',
      registered: 'Registrados',
      pending: 'Pendientes',
      total: 'Total',
      rewards: 'Recompensas',
      inviterBadge: 'Badge Invitador',
      ambassador: 'Embajador Mundial',
      vipLegend: 'Leyenda VIP',
      friends: 'amigos',
      inviteLink: 'Tu Link de Invitación',
      copyLink: 'Copiar Link',
      copied: 'Copiado!',
      shareInvite: 'Compartir Invitación',
      sendWhatsApp: 'Enviar por WhatsApp',
      howItWorks: '¿Cómo funciona?',
      step1: 'Comparte tu link de invitación',
      step2: 'Tus amigos se registran usando tu link',
      step3: 'Ambos reciben puntos bonus de participación',
      step4: 'Desbloqueas recompensas especiales'
    },
    nav: {
      feed: 'Recuerdos',
      dashboard: 'Dashboard',
      create: 'Crear',
      rankings: 'Rankings',
      menu: 'Menú',
      language: 'Idioma',
      logout: 'Cerrar Sesión'
    },
    buttons: {
      create: 'CREAR'
    },
    filters: {
      all: 'Todos',
      colombia: 'Colombia',
      mexico: 'México',
      argentina: 'Argentina',
      brazil: 'Brasil',
      usa: 'Estados Unidos',
      canada: 'Canadá'
    },
    footer: {
      home: 'Inicio',
      explore: 'Explorar',
      favorites: 'Favoritos',
      vip: 'VIP'
    },
    nft: {
      modalTitle: 'Certificar como NFT',
      description: 'Crea un certificado digital conmemorativo único en la blockchain.',
      benefitsTitle: 'Características de la Certificación',
      permanentCertificate: 'Certificado Permanente',
      permanentCertificateDesc: 'Tu recuerdo quedará registrado para siempre en la blockchain',
      auctionEligible: 'Elegible para Subasta',
      auctionEligibleDesc: 'Podrás ser elegible para participar en subastas opcionales. Los ingresos dependen del mercado y no están garantizados.',
      proofOfAuthorship: 'Prueba de Autoría',
      proofOfAuthorshipDesc: 'Certificado digital de que tú creaste este recuerdo',
      savings: 'Ahorras',
      freeForLegends: 'GRATIS para Leyendas',
      championDiscount: 'Descuento Campeón',
      starDiscount: 'Descuento Estrella',
      vipDiscount: 'Descuento VIP',
      importantTitle: 'Importante',
      notInvestment: 'No es una inversión financiera',
      commemorativeCertificate: 'Es un certificado conmemorativo digital',
      irreversibleProcess: 'El proceso es irreversible',
      productionMode: 'Modo producción activo',
      certifyButton: 'Certificar Ahora',
      footerText: 'Powered by Crossmint • Blockchain segura'
    },
    myMemories: {
      title: 'Mis Recuerdos',
      subtitle: 'Gestiona tus momentos del Mundial',
      noMemories: 'Aún no has creado recuerdos',
      createFirst: 'Crear mi primer recuerdo',
      loadingMore: 'Cargando más recuerdos...',
      noMore: 'No hay más recuerdos',
      private: 'Privado',
      public: 'Público',
      deleteTitle: '¿Eliminar este recuerdo?',
      deleteMessage: 'Esta acción no se puede deshacer',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      deleting: 'Eliminando...'
    },
    editMemory: {
      title: 'Editar Recuerdo',
      subtitle: 'Actualiza tu momento del Mundial',
      updateButton: 'Actualizar Recuerdo',
      updating: 'Actualizando...',
      updated: 'Recuerdo actualizado exitosamente',
      error: 'Error al actualizar el recuerdo'
    },
    myNFTs: {
      title: 'Mis NFTs',
      subtitle: 'Tus recuerdos certificados en blockchain',
      noNFTs: 'Aún no has creado NFTs',
      createFirst: 'Crear mi primer NFT',
      loadingMore: 'Cargando más NFTs...',
      noMore: 'No hay más NFTs',
      certified: 'Certificado',
      crossmintId: 'ID Crossmint',
      blockchainAddress: 'Dirección Blockchain',
      viewMemory: 'Ver Recuerdo',
      share: 'Compartir',
      benefits: {
        title: 'Beneficios de tus NFTs',
        permanent: 'Certificado permanente en blockchain',
        auction: 'Elegible para subasta final del Mundial',
        ownership: 'Prueba digital de propiedad'
      }
    },
    vip: {
      title: 'Zona VIP Exclusiva',
      subtitle: 'Bienvenido a tu área premium del Mundial 2026',
      memberSince: 'Miembro desde',
      nftDiscount: '10% Descuento NFTs',
      exclusiveFeatures: 'Funciones exclusivas',
      active: 'Activas',
      benefits: 'Tus Beneficios VIP',
      exclusiveBadge: 'Badge VIP Exclusivo',
      badgeDescription: 'Destaca en todos tus recuerdos',
      discount: '10% Descuento',
      discountDescription: 'En la creación de cualquier NFT',
      advancedStats: 'Estadísticas Avanzadas',
      statsDescription: 'Datos en tiempo real de tus activos',
      comingSoon: 'Próximamente',
      specialFilters: 'Filtros Especiales',
      vipChat: 'Chat VIP',
      mintVipNFT: 'Mintear NFT VIP',
      premiumSupport: 'Soporte Premium',
      fanClub: 'Club de Fans'
    },
    support: {
      title: 'Apoyar el Proyecto',
      subtitle: 'Plataforma para crear certificados conmemorativos digitales de eventos deportivos importantes',
      mainTitle: 'Impulsa el Futuro de los Certificados Digitales',
      mainDescription: 'Tu apoyo nos ayuda a mantener la app gratuita y agregar nuevas funciones increíbles.',
      donateButton: 'Donar con PayPal',
      securePayment: 'Pago 100% seguro con PayPal',
      reason1Title: 'Mantener Gratis',
      reason1Description: 'Sin anuncios molestos ni pagos obligatorios',
      reason2Title: 'Nuevas Funciones',
      reason2Description: 'Filtros, efectos y herramientas premium',
      reason3Title: 'Mejor Experiencia',
      reason3Description: 'Servidores más rápidos y estables',
      reason4Title: 'Comunidad Global',
      reason4Description: 'Conectar fanáticos de todo el mundo',
      benefitsTitle: 'Beneficios para Supporters',
      benefit1Title: 'Badge Especial',
      benefit1Description: 'Distintivo único en tu perfil',
      benefit2Title: 'Acceso Temprano',
      benefit2Description: 'Nuevas funciones antes que nadie',
      benefit3Title: 'Reconocimiento',
      benefit3Description: 'Apareces en nuestra página de agradecimientos',
      alternativeTitle: 'Otras Formas de Ayudar',
      alternativeDescription: 'Si no puedes donar, también puedes ayudarnos de estas maneras:',
      inviteFriends: 'Invitar Amigos',
      shareApp: 'Compartir App',
      footerMessage: 'Cada contribución, por pequeña que sea, hace una gran diferencia.',
      footerThanks: '¡Gracias por ser parte de esta increíble comunidad!'
    }
  },
  en: {
    common: {
      loading: 'Loading...'
    },
    dashboard: {
      welcome: 'Welcome!',
      createMemory: 'Create New Memory',
      viewNFTs: 'View My NFTs',
      exploreEvents: 'My Memories',
      inviteFriends: 'Invite Friends',
      viewGallery: 'View Public Gallery'
    },
    landing: {
      title: 'Memories26',
      subtitle: 'Share your World Cup 2026 moments',
      createAccount: 'Create free account',
      viewMemories: 'View memories',
      ctaTitle: 'Ready to save your memories?',
      ctaSubtitle: 'Join thousands of fans who are already creating their digital album',
      ctaButton: 'Get started now'
    },
    auth: {
      loginTitle: 'Login',
      registerTitle: 'Create Account',
      email: 'Email',
      password: 'Password',
      loginButton: 'Login',
      registerButton: 'Create Account',
      hasAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      forgotPassword: 'Forgot your password?'
    },
    create: {
      title: 'Create Memory',
      subtitle: 'Share your World Cup moment',
      imageRequired: 'Memory Image *',
      selectImage: 'Tap to select image',
      titleRequired: 'Memory Title *',
      titlePlaceholder: 'Ex: Historic Colombia goal',
      description: 'Description',
      descriptionPlaceholder: 'Tell the story behind this moment...',
      team: 'Team',
      selectTeam: 'Select team',
      matchDate: 'Match Date',
      publicMemory: 'Public Memory',
      publicDescription: 'Other users will be able to see and like your memory',
      createButton: 'Create Memory',
      creating: 'Saving...'
    },
    feed: {
      title: 'Memories',
      subtitle: 'Explore World Cup moments',
      search: 'Search memories...',
      searching: 'Searching...',
      noResults: 'No memories found',
      loadingMore: 'Loading more memories...',
      noMore: 'No more memories'
    },
    memory: {
      share: 'Share',
      like: 'Like',
      liked: 'Liked',
      download: 'Download',
      description: 'Description',
      createNFT: 'Convert to NFT',
      nftDescription: 'Protect your digital property and make this memory unique on the blockchain.',
      createNFTButton: 'Create NFT Now',
      certified: 'Memory Certified as NFT',
      comments: 'Comments',
      writeComment: 'Write a comment...',
      loginToComment: 'Login to comment',
      commentButton: 'Comment',
      sending: 'Sending...',
      noComments: 'No comments yet. Be the first to comment!',
      notFound: 'Memory not found',
      backToFeed: 'Back to Feed'
    },
    rankings: {
      title: 'Rankings',
      subtitle: 'Compete with fans worldwide',
      loading: 'Loading rankings...',
      yourPosition: 'Your Position',
      of: 'of',
      users: 'users',
      refresh: 'Refresh',
      updating: 'Updating...',
      noUsers: 'No users in ranking yet',
      wantToClimb: 'Want to climb the ranking?',
      climbDescription: 'Create memories, receive likes and earn participation points to climb positions',
      createMemoryPoints: 'Create Memory (+10 participation points)',
      viewGallery: 'View Public Gallery'
    },
    invite: {
      title: 'Invite Friends',
      subtitle: 'Earn participation points for each friend who registers',
      loading: 'Loading...',
      registered: 'Registered',
      pending: 'Pending',
      total: 'Total',
      rewards: 'Rewards',
      inviterBadge: 'Inviter Badge',
      ambassador: 'World Ambassador',
      vipLegend: 'VIP Legend',
      friends: 'friends',
      inviteLink: 'Your Invitation Link',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      shareInvite: 'Share Invitation',
      sendWhatsApp: 'Send via WhatsApp',
      howItWorks: 'How it works?',
      step1: 'Share your invitation link',
      step2: 'Your friends register using your link',
      step3: 'Both receive bonus participation points',
      step4: 'Unlock special rewards'
    },
    nav: {
      feed: 'Memories',
      dashboard: 'Dashboard',
      create: 'Create',
      rankings: 'Rankings',
      menu: 'Menu',
      language: 'Language',
      logout: 'Logout'
    },
    buttons: {
      create: 'CREATE'
    },
    filters: {
      all: 'All',
      colombia: 'Colombia',
      mexico: 'Mexico',
      argentina: 'Argentina',
      brazil: 'Brazil',
      usa: 'United States',
      canada: 'Canada'
    },
    footer: {
      home: 'Home',
      explore: 'Explore',
      favorites: 'Favorites',
      vip: 'VIP'
    },
    nft: {
      modalTitle: 'Certify as NFT',
      description: 'Create a unique digital commemorative certificate on the blockchain.',
      benefitsTitle: 'Certification Features',
      permanentCertificate: 'Permanent Certificate',
      permanentCertificateDesc: 'Your memory will be registered forever on the blockchain',
      auctionEligible: 'Auction Eligible',
      auctionEligibleDesc: 'You may be eligible to participate in optional auctions. Earnings depend on market interest and are not guaranteed.',
      proofOfAuthorship: 'Proof of Authorship',
      proofOfAuthorshipDesc: 'Digital certificate that you created this memory',
      savings: 'You save',
      freeForLegends: 'FREE for Legends',
      championDiscount: 'Champion Discount',
      starDiscount: 'Star Discount',
      vipDiscount: 'VIP Discount',
      importantTitle: 'Important',
      notInvestment: 'Not a financial investment',
      commemorativeCertificate: 'It is a digital commemorative certificate',
      irreversibleProcess: 'The process is irreversible',
      productionMode: 'Production mode active',
      certifyButton: 'Certify Now',
      footerText: 'Powered by Crossmint • Secure blockchain'
    },
    myMemories: {
      title: 'My Memories',
      subtitle: 'Manage your World Cup moments',
      noMemories: 'You haven\'t created memories yet',
      createFirst: 'Create my first memory',
      loadingMore: 'Loading more memories...',
      noMore: 'No more memories',
      private: 'Private',
      public: 'Public',
      deleteTitle: 'Delete this memory?',
      deleteMessage: 'This action cannot be undone',
      cancel: 'Cancel',
      delete: 'Delete',
      deleting: 'Deleting...'
    },
    editMemory: {
      title: 'Edit Memory',
      subtitle: 'Update your World Cup moment',
      updateButton: 'Update Memory',
      updating: 'Updating...',
      updated: 'Memory updated successfully',
      error: 'Error updating memory'
    },
    myNFTs: {
      title: 'My NFTs',
      subtitle: 'Your blockchain-certified memories',
      noNFTs: 'You haven\'t created NFTs yet',
      createFirst: 'Create my first NFT',
      loadingMore: 'Loading more NFTs...',
      noMore: 'No more NFTs',
      certified: 'Certified',
      crossmintId: 'Crossmint ID',
      blockchainAddress: 'Blockchain Address',
      viewMemory: 'View Memory',
      share: 'Share',
      benefits: {
        title: 'Your NFT Benefits',
        permanent: 'Permanent blockchain certificate',
        auction: 'Eligible for World Cup final auction',
        ownership: 'Digital proof of ownership'
      }
    },
    vip: {
      title: 'Exclusive VIP Zone',
      subtitle: 'Welcome to your premium World Cup 2026 area',
      memberSince: 'Member since',
      nftDiscount: '10% NFT Discount',
      exclusiveFeatures: 'Exclusive features',
      active: 'Active',
      benefits: 'Your VIP Benefits',
      exclusiveBadge: 'Exclusive VIP Badge',
      badgeDescription: 'Stand out in all your memories',
      discount: '10% Discount',
      discountDescription: 'On creating any NFT',
      advancedStats: 'Advanced Statistics',
      statsDescription: 'Real-time data of your assets',
      comingSoon: 'Coming Soon',
      specialFilters: 'Special Filters',
      vipChat: 'VIP Chat',
      mintVipNFT: 'Mint VIP NFT',
      premiumSupport: 'Premium Support',
      fanClub: 'Fan Club'
    },
    support: {
      title: 'Support the Project',
      subtitle: 'Entrepreneurship to monetize your memories in one of the most important events of the year',
      mainTitle: 'Drive the Future of your Memories',
      mainDescription: 'Your support helps us keep the app free and add amazing new features.',
      donateButton: 'Donate with PayPal',
      securePayment: '100% secure payment with PayPal',
      reason1Title: 'Keep it Free',
      reason1Description: 'No annoying ads or mandatory payments',
      reason2Title: 'New Features',
      reason2Description: 'Filters, effects and premium tools',
      reason3Title: 'Better Experience',
      reason3Description: 'Faster and more stable servers',
      reason4Title: 'Global Community',
      reason4Description: 'Connect fans from around the world',
      benefitsTitle: 'Benefits for Supporters',
      benefit1Title: 'Special Badge',
      benefit1Description: 'Unique badge on your profile',
      benefit2Title: 'Early Access',
      benefit2Description: 'New features before anyone else',
      benefit3Title: 'Recognition',
      benefit3Description: 'You appear on our thanks page',
      alternativeTitle: 'Other Ways to Help',
      alternativeDescription: 'If you cannot donate, you can also help us in these ways:',
      inviteFriends: 'Invite Friends',
      shareApp: 'Share App',
      footerMessage: 'Every contribution, no matter how small, makes a big difference.',
      footerThanks: 'Thank you for being part of this amazing community!'
    }
  },
  pt: {
    common: {
      loading: 'Carregando...'
    },
    dashboard: {
      welcome: 'Bem-vindo!',
      createMemory: 'Criar Nova Memória',
      viewNFTs: 'Ver Meus NFTs',
      exploreEvents: 'Minhas Memórias',
      inviteFriends: 'Convidar Amigos',
      viewGallery: 'Ver Galeria Pública'
    },
    landing: {
      title: 'Memories26',
      subtitle: 'Compartilhe seus momentos da Copa 2026',
      createAccount: 'Criar conta grátis',
      viewMemories: 'Ver memórias',
      ctaTitle: 'Pronto para salvar suas memórias?',
      ctaSubtitle: 'Junte-se a milhares de fãs que já estão criando seu álbum digital',
      ctaButton: 'Começar agora'
    },
    auth: {
      loginTitle: 'Entrar',
      registerTitle: 'Criar Conta',
      email: 'Email',
      password: 'Senha',
      loginButton: 'Entrar',
      registerButton: 'Criar Conta',
      hasAccount: 'Já tem uma conta?',
      noAccount: 'Não tem uma conta?',
      forgotPassword: 'Esqueceu sua senha?'
    },
    create: {
      title: 'Criar Memória',
      subtitle: 'Compartilhe seu momento da Copa',
      imageRequired: 'Imagem da Memória *',
      selectImage: 'Toque para selecionar imagem',
      titleRequired: 'Título da Memória *',
      titlePlaceholder: 'Ex: Gol histórico da Colômbia',
      description: 'Descrição',
      descriptionPlaceholder: 'Conte a história por trás deste momento...',
      team: 'Equipe',
      selectTeam: 'Selecionar equipe',
      matchDate: 'Data da Partida',
      publicMemory: 'Memória Pública',
      publicDescription: 'Outros usuários poderão ver e curtir sua memória',
      createButton: 'Criar Memória',
      creating: 'Salvando...'
    },
    feed: {
      title: 'Memórias',
      subtitle: 'Explore os momentos da Copa',
      search: 'Buscar memórias...',
      searching: 'Buscando...',
      noResults: 'Nenhuma memória encontrada',
      loadingMore: 'Carregando mais memórias...',
      noMore: 'Não há mais memórias'
    },
    memory: {
      share: 'Compartilhar',
      like: 'Curtir',
      liked: 'Curtido',
      download: 'Baixar',
      description: 'Descrição',
      createNFT: 'Converter em NFT',
      nftDescription: 'Proteja sua propriedade digital e torne esta memória única na blockchain.',
      createNFTButton: 'Criar NFT Agora',
      certified: 'Memória Certificada como NFT',
      comments: 'Comentários',
      writeComment: 'Escreva um comentário...',
      loginToComment: 'Faça login para comentar',
      commentButton: 'Comentar',
      sending: 'Enviando...',
      noComments: 'Ainda não há comentários. Seja o primeiro a comentar!',
      notFound: 'Memória não encontrada',
      backToFeed: 'Voltar ao Feed'
    },
    rankings: {
      title: 'Rankings',
      subtitle: 'Compete com fãs do mundo todo',
      loading: 'Carregando rankings...',
      yourPosition: 'Sua Posição',
      of: 'de',
      users: 'usuários',
      refresh: 'Atualizar',
      updating: 'Atualizando...',
      noUsers: 'Ainda não há usuários no ranking',
      wantToClimb: 'Quer subir no ranking?',
      climbDescription: 'Crie memórias, receba curtidas e ganhe pontos para escalar posições',
      createMemoryPoints: 'Criar Memória (+10 pontos)',
      viewGallery: 'Ver Galeria Pública'
    },
    invite: {
      title: 'Convidar Amigos',
      subtitle: 'Ganhe pontos para cada amigo que se registrar',
      loading: 'Carregando...',
      registered: 'Registrados',
      pending: 'Pendentes',
      total: 'Total',
      rewards: 'Recompensas',
      inviterBadge: 'Badge Convidador',
      ambassador: 'Embaixador Mundial',
      vipLegend: 'Lenda VIP',
      friends: 'amigos',
      inviteLink: 'Seu Link de Convite',
      copyLink: 'Copiar Link',
      copied: 'Copiado!',
      shareInvite: 'Compartilhar Convite',
      sendWhatsApp: 'Enviar via WhatsApp',
      howItWorks: 'Como funciona?',
      step1: 'Compartilhe seu link de convite',
      step2: 'Seus amigos se registram usando seu link',
      step3: 'Ambos recebem pontos bônus',
      step4: 'Desbloqueie recompensas especiais'
    },
    nav: {
      feed: 'Memórias',
      dashboard: 'Dashboard',
      create: 'Criar',
      rankings: 'Rankings',
      menu: 'Menu',
      language: 'Idioma',
      logout: 'Sair'
    },
    buttons: {
      create: 'CRIAR'
    },
    filters: {
      all: 'Todos',
      colombia: 'Colômbia',
      mexico: 'México',
      argentina: 'Argentina',
      brazil: 'Brasil',
      usa: 'Estados Unidos',
      canada: 'Canadá'
    },
    footer: {
      home: 'Início',
      explore: 'Explorar',
      favorites: 'Favoritos',
      vip: 'VIP'
    },
    nft: {
      modalTitle: 'Certificar como NFT',
      description: 'Crie um certificado digital comemorativo único na blockchain.',
      benefitsTitle: 'Características da Certificação',
      permanentCertificate: 'Certificado Permanente',
      permanentCertificateDesc: 'Sua memória ficará registrada para sempre na blockchain',
      auctionEligible: 'Elegível para Leilão',
      auctionEligibleDesc: 'Você poderá ser elegível para participar de leilões opcionais. Os ganhos dependem do interesse do mercado e não são garantidos.',
      proofOfAuthorship: 'Prova de Autoria',
      proofOfAuthorshipDesc: 'Certificado digital de que você criou esta memória',
      savings: 'Você economiza',
      freeForLegends: 'GRÁTIS para Lendas',
      championDiscount: 'Desconto Campeão',
      starDiscount: 'Desconto Estrela',
      vipDiscount: 'Desconto VIP',
      importantTitle: 'Importante',
      notInvestment: 'Não é um investimento financeiro',
      commemorativeCertificate: 'É um certificado digital comemorativo',
      irreversibleProcess: 'O processo é irreversível',
      productionMode: 'Modo produção ativo',
      certifyButton: 'Certificar Agora',
      footerText: 'Powered by Crossmint • Blockchain segura'
    },
    myMemories: {
      title: 'Minhas Memórias',
      subtitle: 'Gerencie seus momentos da Copa',
      noMemories: 'Você ainda não criou memórias',
      createFirst: 'Criar minha primeira memória',
      loadingMore: 'Carregando mais memórias...',
      noMore: 'Não há mais memórias',
      private: 'Privado',
      public: 'Público',
      deleteTitle: 'Excluir esta memória?',
      deleteMessage: 'Esta ação não pode ser desfeita',
      cancel: 'Cancelar',
      delete: 'Excluir',
      deleting: 'Excluindo...'
    },
    editMemory: {
      title: 'Editar Memória',
      subtitle: 'Atualize seu momento da Copa',
      updateButton: 'Atualizar Memória',
      updating: 'Atualizando...',
      updated: 'Memória atualizada com sucesso',
      error: 'Erro ao atualizar memória'
    },
    myNFTs: {
      title: 'Meus NFTs',
      subtitle: 'Suas memórias certificadas na blockchain',
      noNFTs: 'Você ainda não criou NFTs',
      createFirst: 'Criar meu primeiro NFT',
      loadingMore: 'Carregando mais NFTs...',
      noMore: 'Não há mais NFTs',
      certified: 'Certificado',
      crossmintId: 'ID Crossmint',
      blockchainAddress: 'Endereço Blockchain',
      viewMemory: 'Ver Memória',
      share: 'Compartilhar',
      benefits: {
        title: 'Benefícios dos seus NFTs',
        permanent: 'Certificado permanente na blockchain',
        auction: 'Elegível para leilão final da Copa',
        ownership: 'Prova digital de propriedade'
      }
    },
    vip: {
      title: 'Zona VIP Exclusiva',
      subtitle: 'Bem-vindo à sua área premium da Copa 2026',
      memberSince: 'Membro desde',
      nftDiscount: '10% Desconto NFTs',
      exclusiveFeatures: 'Recursos exclusivos',
      active: 'Ativo',
      benefits: 'Seus Benefícios VIP',
      exclusiveBadge: 'Badge VIP Exclusivo',
      badgeDescription: 'Destaque-se em todas as suas memórias',
      discount: '10% Desconto',
      discountDescription: 'Na criação de qualquer NFT',
      advancedStats: 'Estatísticas Avançadas',
      statsDescription: 'Dados em tempo real dos seus ativos',
      comingSoon: 'Em Breve',
      specialFilters: 'Filtros Especiais',
      vipChat: 'Chat VIP',
      mintVipNFT: 'Criar NFT VIP',
      premiumSupport: 'Suporte Premium',
      fanClub: 'Clube de Fãs'
    },
    support: {
      title: 'Apoiar o Projeto',
      subtitle: 'Empreendedorismo para monetizar suas memórias em um dos eventos mais importantes do ano',
      mainTitle: 'Impulsione o Futuro das suas Memórias',
      mainDescription: 'Seu apoio nos ajuda a manter o app gratuito e adicionar novos recursos incríveis.',
      donateButton: 'Doar com PayPal',
      securePayment: 'Pagamento 100% seguro com PayPal',
      reason1Title: 'Manter Gratuito',
      reason1Description: 'Sem anúncios chatos ou pagamentos obrigatórios',
      reason2Title: 'Novos Recursos',
      reason2Description: 'Filtros, efeitos e ferramentas premium',
      reason3Title: 'Melhor Experiência',
      reason3Description: 'Servidores mais rápidos e estáveis',
      reason4Title: 'Comunidade Global',
      reason4Description: 'Conectar fãs de todo o mundo',
      benefitsTitle: 'Benefícios para Apoiadores',
      benefit1Title: 'Badge Especial',
      benefit1Description: 'Distintivo único no seu perfil',
      benefit2Title: 'Acesso Antecipado',
      benefit2Description: 'Novos recursos antes de qualquer um',
      benefit3Title: 'Reconhecimento',
      benefit3Description: 'Você aparece na nossa página de agradecimentos',
      alternativeTitle: 'Outras Formas de Ajudar',
      alternativeDescription: 'Se você não pode doar, também pode nos ajudar dessas maneiras:',
      inviteFriends: 'Convidar Amigos',
      shareApp: 'Compartilhar App',
      footerMessage: 'Cada contribuição, por menor que seja, faz uma grande diferença.',
      footerThanks: 'Obrigado por fazer parte desta comunidade incrível!'
    }
  }
}

interface V2ContextType {
  language: string
  t: (key: string) => string
  changeLanguage: (lang: string) => void
}

const V2Context = createContext<V2ContextType | null>(null)

export function V2Provider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('es')

  useEffect(() => {
    const saved = localStorage.getItem('language') || 'es'
    if (['es', 'en', 'pt'].includes(saved)) {
      setLanguage(saved)
    }
  }, [])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language as keyof typeof translations]
    
    for (const k of keys) {
      value = value?.[k]
      if (!value) break
    }
    
    return typeof value === 'string' ? value : key
  }

  const changeLanguage = (lang: string) => {
    if (['es', 'en', 'pt'].includes(lang)) {
      setLanguage(lang)
      localStorage.setItem('language', lang)
    }
  }

  return (
    <V2Context.Provider value={{ language, t, changeLanguage }}>
      {children}
    </V2Context.Provider>
  )
}

export function useV2() {
  const context = useContext(V2Context)
  if (!context) {
    throw new Error('useV2 must be used within V2Provider')
  }
  return context
}