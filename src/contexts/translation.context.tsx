"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

interface TranslationContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.welcome': 'Welcome',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.blog_posts': 'Blog Posts',
    'nav.opportunities': 'Opportunities',
    'nav.events': 'Events',
    'nav.courses': 'Courses',
    'nav.about_us': 'About Us',
    'nav.contact_us': 'Contact Us',
    'nav.login': 'Log in',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.clear': 'Clear',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.confirm': 'Confirm',
    'common.required': 'Required',
    'common.optional': 'Optional',
    
    // Support
    'support.title': 'Customer Support',
    'support.ai_chat': 'AI Assistant',
    'support.live_agent': 'WhatsApp Agent',
    'support.help': 'Help & Support',
    'support.chat_with_ai': 'Chat with AI',
    'support.connect_agent': 'Connect to Live Agent',
    'support.available': 'Available',
    'support.busy': 'Busy',
    'support.offline': 'Offline',
    
    // Footer
    'footer.tagline': 'Empowering Your Digital Journey',
    'footer.discover': 'Discover',
    'footer.info': 'Info',
    'footer.join_mailing': 'Join Our Mailing List',
    'footer.mailing_description': 'Get notified and updated with our marketing emails.',
    'footer.email_placeholder': 'Your Email',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.admin_subtitle': 'Here\'s what\'s happening with your platform today',
    'dashboard.user_subtitle': 'Here\'s your learning progress and upcoming activities',
    'dashboard.total_users': 'Total Users',
    'dashboard.total_posts': 'Total Posts',
    'dashboard.total_events': 'Total Events',
    'dashboard.total_messages': 'Total Messages',
    'dashboard.courses': 'Courses',
    'dashboard.projects': 'Projects',
    'dashboard.teams': 'Teams',
    'dashboard.professionals': 'Professionals',
    'dashboard.platform_growth': 'Platform Growth',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.quick_actions': 'Quick Actions',
    'dashboard.manage_courses': 'Manage Courses',
    'dashboard.schedule_events': 'Schedule Events',
    'dashboard.view_messages': 'View Messages',
    'dashboard.user_management': 'User Management',
    'dashboard.enrolled_courses': 'Enrolled Courses',
    'dashboard.completed_lessons': 'Completed Lessons',
    'dashboard.upcoming_events': 'Upcoming Events',
    'dashboard.browse_courses': 'Browse Courses',
    'dashboard.explore_courses': 'Explore available courses',
    'dashboard.view_events': 'View Events',
    'dashboard.check_events': 'Check upcoming events',
    'dashboard.my_profile': 'My Profile',
    'dashboard.update_profile': 'Update your profile',
    'dashboard.contact_support': 'Contact Support',
    'dashboard.get_help': 'Get help and support',
    'dashboard.no_recent_activities': 'No recent activities',
    
    // Hero Section
    'hero.title': 'Empowering Your Digital Journey',
    'hero.description': 'We\'re committed to revolutionizing the digital landscape, offering cutting-edge solutions tailored to individuals, startups, enterprises, and organizations.',
    'hero.hire_services': 'Hire our services',
    'hero.our_mission': 'Our Mission',
    
    // Features Section
    'features.title': 'What we offer',
    'features.subtitle': 'Whether you\'re an individual entrepreneur or a multinational corporation, Cumi has got you covered.',
    'features.custom_solutions.title': 'Custom Digital Solutions',
    'features.custom_solutions.description': 'Cumi offers custom digital solutions for individuals and corporations, tailored to your unique needs. We collaborate closely with clients from concept to execution, delivering innovative solutions that yield tangible results.',
    'features.training.title': 'Software Development Training',
    'features.training.description': 'Cumi equips tech enthusiasts with expertise in JavaScript, Python, PHP, React, Laravel, Django, and React-Native. Our hands-on training empowers aspiring developers for success in the competitive tech industry.',
    'features.hire_expertise': 'Hire our expertise',
    
    // Service Section
    'service.ready_to_work': 'Ready to work with Cumi?',
    'service.description': 'Reach out to us today to learn more about our services and training programs.',
    'service.get_in_touch': 'Get In Touch',
    
    // About Note Section
    'about_note.title': 'Why Choose Cumi?',
    'about_note.subtitle': 'Together let\'s collaborate to turn your vision into reality and shape the future of technology together.',
    'about_note.expertise.title': 'Expertise',
    'about_note.expertise.description': 'Our team comprises professionals with extensive experience in software development and technology consulting. We leverage our expertise to deliver.',
    'about_note.innovation.title': 'Innovation',
    'about_note.innovation.description': 'We\'re constantly exploring new technologies and methodologies to stay ahead of the curve and deliver cutting-edge solutions that drive business growth.',
    'about_note.collaboration.title': 'Collaboration',
    'about_note.collaboration.description': 'We work closely with our clients, fostering open communication and collaboration every step of the way to ensure that we\'re aligned with their goals and objectives.',
    'about_note.excellence.title': 'Commitment to Excellence',
    'about_note.excellence.description': 'From the quality of our work to the level of service we provide, we strive for nothing less than perfection to ensure the success of our clients.',
    
    // FAQ Page
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to common questions about our services, processes, and how we can help your business grow.',
    'faq.services.question': 'What services does Cumi Digital Solutions offer?',
    'faq.services.answer': 'We offer comprehensive digital solutions including web development, mobile app development, UI/UX design, digital marketing, cloud solutions, and technical consulting. Our team specializes in modern technologies like React, Next.js, Node.js, and various cloud platforms.',
    'faq.timeline.question': 'How long does a typical project take?',
    'faq.timeline.answer': 'Project timelines vary depending on complexity and scope. Simple websites typically take 2-4 weeks, while complex web applications can take 2-6 months. We provide detailed timelines during our initial consultation and keep you updated throughout the development process.',
    'faq.support.question': 'Do you provide ongoing support after project completion?',
    'faq.support.answer': 'Yes, we offer comprehensive post-launch support including maintenance, updates, bug fixes, and feature enhancements. We have different support packages to suit your needs, from basic maintenance to full managed services.',
    'faq.technologies.question': 'What technologies do you work with?',
    'faq.technologies.answer': 'We work with modern, industry-standard technologies including React, Next.js, Node.js, TypeScript, Python, Django, React Native, Flutter, AWS, Google Cloud, Docker, and many more. We stay updated with the latest trends and best practices.',
    'faq.existing_projects.question': 'Can you help with existing projects?',
    'faq.existing_projects.answer': 'Absolutely! We can audit, improve, maintain, or completely rebuild existing projects. Our team has experience working with legacy systems and can help modernize your technology stack while maintaining business continuity.',
    'faq.pricing.question': 'What is your pricing structure?',
    'faq.pricing.answer': 'Our pricing is project-based and depends on scope, complexity, and timeline. We offer competitive rates and flexible payment terms. Contact us for a detailed quote tailored to your specific requirements.',
    'faq.startups.question': 'Do you work with startups?',
    'faq.startups.answer': 'Yes, we love working with startups! We understand the unique challenges startups face and offer flexible solutions, scalable architectures, and startup-friendly pricing. We can help you build an MVP or scale your existing product.',
    'faq.quality.question': 'How do you ensure project quality?',
    'faq.quality.answer': 'We follow industry best practices including code reviews, automated testing, continuous integration, and regular client feedback sessions. Our development process includes multiple quality checkpoints and we use modern development methodologies.',
    'faq.marketing.question': 'Can you help with SEO and digital marketing?',
    'faq.marketing.answer': 'Yes, we offer comprehensive digital marketing services including SEO optimization, social media marketing, content marketing, PPC advertising, and analytics setup. We can help improve your online visibility and drive more traffic to your website.',
    'faq.difference.question': 'What makes Cumi Digital Solutions different?',
    'faq.difference.answer': 'We combine technical expertise with business understanding. Our team doesn\'t just code - we think strategically about your business goals and create solutions that drive real results. We\'re committed to long-term partnerships and your success.',
    'faq.cta.title': 'Still Have Questions?',
    'faq.cta.description': 'Can\'t find the answer you\'re looking for? Our team is here to help. Contact us directly and we\'ll get back to you within 24 hours.',
    'faq.cta.email': 'Email Us',
    'faq.cta.whatsapp': 'WhatsApp',
    
    // Banner Component
    'banner.subtitle': 'Professional solutions tailored to your business needs',
    'banner.home': 'Home',
    'banner.get_started': 'Get Started',
    'banner.contact_us': 'Contact Us',
    
    // Events Page
    'events.title': 'Events & Workshops 📅',
    'events.subtitle': 'Discover upcoming events, workshops, and conferences',
    'events.search_placeholder': 'Search events...',
    'events.category_placeholder': 'Category',
    'events.all_categories': 'All Categories',
    'events.web_dev': 'Web Development',
    'events.ai_ml': 'AI & ML',
    'events.data_science': 'Data Science',
    'events.mobile_dev': 'Mobile Dev',
    'events.clear_filters': 'Clear Filters',
    
    // Courses Page
    'courses.title': 'Online Courses 📚',
    'courses.subtitle': 'Learn new skills with our comprehensive course library',
    'courses.search_placeholder': 'Search courses...',
    'courses.level_placeholder': 'Level',
    'courses.category_placeholder': 'Category',
    'courses.all_levels': 'All Levels',
    'courses.beginner': 'Beginner',
    'courses.intermediate': 'Intermediate',
    'courses.advanced': 'Advanced',
    'courses.all_categories': 'All Categories',
    'courses.web_dev': 'Web Development',
    'courses.programming': 'Programming',
    'courses.data_science': 'Data Science',
    'courses.mobile_dev': 'Mobile Development',
    'courses.clear_filters': 'Clear Filters',
    
    // Opportunities Page
    'opportunities.filter_title': 'Filter Opportunities',
    'opportunities.all_opportunities': 'All Opportunities',
    'opportunities.jobs': 'Jobs',
    'opportunities.scholarships': 'Scholarships',
    'opportunities.internships': 'Internships',
    'opportunities.fellowships': 'Fellowships',
    'opportunities.grants': 'Grants',
    
    // About Page
    'about.title': 'CumiTech - Empowering Startups Through Innovation',
    'about.subtitle': 'At CumiTech, we\'re passionate about empowering startup businesses through innovative web solutions. We combine software engineering expertise with creative design to deliver scalable websites and applications that drive success.',
    'about.get_in_touch': 'Get In Touch',
    'about.our_services': 'Our Services',
    'about.projects_completed': 'Projects Completed',
    'about.happy_clients': 'Happy Clients',
    'about.years_experience': 'Years Experience',
    'about.team_members': 'Team Members',
    'about.our_story': 'Our Story',
    'about.story_description': 'Founded in June 2024, CumiTech began with a vision to empower startup businesses through innovative web solutions. Based in Bamenda, Northwest, Cameroon, we operate in a hybrid model, combining software engineering expertise with creative design.',
    'about.our_mission': 'Our Mission',
    'about.mission_description': 'We are committed to empowering startup businesses through innovative web solutions. Our mission is to combine software engineering expertise with creative design to deliver scalable websites and applications that drive business success.',
    'about.innovation_driven': 'Innovation-driven approach',
    'about.react_laravel': 'React & Laravel expertise',
    'about.seo_marketing': 'SEO & Digital Marketing',
    'about.client_management': 'Client relationship management',
    'about.core_values': 'Our Core Values',
    'about.values_description': 'These values guide everything we do and shape our company culture.',
    'about.innovation': 'Innovation',
    'about.innovation_desc': 'We constantly explore new technologies and methodologies to deliver cutting-edge solutions.',
    'about.passion': 'Passion',
    'about.passion_desc': 'Our team is passionate about creating digital experiences that make a real difference.',
    'about.excellence': 'Excellence',
    'about.excellence_desc': 'We strive for excellence in every project, ensuring quality and attention to detail.',
    'about.collaboration': 'Collaboration',
    'about.collaboration_desc': 'We believe in the power of teamwork and collaboration to achieve extraordinary results.',
    'about.our_journey': 'Our Journey',
    'about.journey_description': 'A timeline of our growth and achievements over the years.',
    'about.meet_team': 'Meet Our Team',
    'about.team_description': 'The talented individuals who make Cumi Digital a success.',
    'about.skills': 'Skills:',
    'about.experience': 'Experience:',
    'about.location': 'Location:',
    'about.ready_to_work': 'Ready to Work With Us?',
    'about.work_description': 'Let\'s discuss your project and create something amazing together.',
    'about.start_project': 'Start Your Project',
    'about.contact_us': 'Contact Us',
    
    // Contact Page
    'contact.full_name': 'Full Name',
    'contact.working_mail': 'Working Mail',
    'contact.anything_else': 'Anything else?',
    'contact.message_placeholder': 'Message goes here...',
    'contact.submit': 'Submit',
    
    // Services Page
    'services.transform_vision': 'Transform Your Digital Vision Into Reality',
    'services.transform_description': 'We provide comprehensive digital solutions that drive growth, enhance user experience, and deliver measurable results for businesses of all sizes.',
    'services.get_started': 'Get Started',
    'services.learn_more': 'Learn More',
    'services.why_choose': 'Why Choose Cumi Digital?',
    'services.why_description': 'We combine technical expertise with creative innovation to deliver solutions that exceed expectations.',
    'services.fast_delivery': 'Fast Delivery',
    'services.fast_description': 'We deliver projects on time with exceptional quality',
    'services.innovative_solutions': 'Innovative Solutions',
    'services.innovative_description': 'Cutting-edge technology and creative problem solving',
    'services.performance_focused': 'Performance Focused',
    'services.performance_description': 'Optimized solutions for maximum efficiency and speed',
    'services.client_centric': 'Client Centric',
    'services.client_description': 'Your success is our priority in every project',
    'services.what_you_get': 'What You Get With Our Services',
    'services.benefits_description': 'Every project comes with comprehensive support and cutting-edge features designed to give you a competitive advantage.',
    'services.support_24_7': '24/7 Technical Support',
    'services.scalable_solutions': 'Scalable Solutions',
    'services.modern_tech': 'Modern Technology Stack',
    'services.seo_optimized': 'SEO Optimized',
    'services.mobile_responsive': 'Mobile Responsive',
    'services.security_first': 'Security First Approach',
    'services.ready_to_build': 'Ready to Build Your Next Project?',
    'services.build_description': 'Let\'s discuss your project requirements and create something amazing together.',
    
    // Projects Page
    'projects.innovative_projects': 'Innovative Projects That Drive Success',
    'projects.innovative_description': 'Explore our portfolio of cutting-edge digital solutions that have transformed businesses and delivered exceptional results across various industries.',
    'projects.start_project': 'Start Your Project',
    'projects.view_services': 'View Services',
    'projects.technologies_master': 'Technologies We Master',
    'projects.tech_description': 'We work with cutting-edge technologies to build robust, scalable, and high-performance applications.',
    'projects.featured_projects': 'Featured Projects',
    'projects.featured_description': 'Each project represents our commitment to excellence, innovation, and delivering solutions that exceed expectations.',
    'projects.no_projects': 'No projects available at the moment',
    'projects.ready_to_start': 'Ready to Get Started?',
    'projects.start_description': 'Let\'s discuss your project and bring your vision to life with our professional services.',
    'projects.get_quote': 'Get Quote',
  },
  fr: {
    // Navigation
    'nav.welcome': 'Bienvenue',
    'nav.services': 'Services',
    'nav.projects': 'Projets',
    'nav.blog_posts': 'Articles de blog',
    'nav.opportunities': 'Opportunités',
    'nav.events': 'Événements',
    'nav.courses': 'Cours',
    'nav.about_us': 'À propos de nous',
    'nav.contact_us': 'Nous contacter',
    'nav.login': 'Se connecter',
    'nav.dashboard': 'Tableau de bord',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.view': 'Voir',
    'common.create': 'Créer',
    'common.update': 'Mettre à jour',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.clear': 'Effacer',
    'common.submit': 'Soumettre',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.close': 'Fermer',
    'common.open': 'Ouvrir',
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.confirm': 'Confirmer',
    'common.required': 'Requis',
    'common.optional': 'Optionnel',
    
    // Support
    'support.title': 'Support Client',
    'support.ai_chat': 'Assistant IA',
    'support.live_agent': 'Agent WhatsApp',
    'support.help': 'Aide et support',
    'support.chat_with_ai': 'Discuter avec l\'IA',
    'support.connect_agent': 'Se connecter à un agent',
    'support.available': 'Disponible',
    'support.busy': 'Occupé',
    'support.offline': 'Hors ligne',
    
    // Footer
    'footer.tagline': 'Autonomiser votre parcours numérique',
    'footer.discover': 'Découvrir',
    'footer.info': 'Info',
    'footer.join_mailing': 'Rejoignez notre liste de diffusion',
    'footer.mailing_description': 'Soyez notifié et mis à jour avec nos emails marketing.',
    'footer.email_placeholder': 'Votre Email',
    
    // Dashboard
    'dashboard.welcome': 'Bon retour',
    'dashboard.admin_subtitle': 'Voici ce qui se passe sur votre plateforme aujourd\'hui',
    'dashboard.user_subtitle': 'Voici vos progrès d\'apprentissage et activités à venir',
    'dashboard.total_users': 'Total Utilisateurs',
    'dashboard.total_posts': 'Total Articles',
    'dashboard.total_events': 'Total Événements',
    'dashboard.total_messages': 'Total Messages',
    'dashboard.courses': 'Cours',
    'dashboard.projects': 'Projets',
    'dashboard.teams': 'Équipes',
    'dashboard.professionals': 'Professionnels',
    'dashboard.platform_growth': 'Croissance de la Plateforme',
    'dashboard.recent_activity': 'Activité Récente',
    'dashboard.quick_actions': 'Actions Rapides',
    'dashboard.manage_courses': 'Gérer les Cours',
    'dashboard.schedule_events': 'Programmer des Événements',
    'dashboard.view_messages': 'Voir les Messages',
    'dashboard.user_management': 'Gestion des Utilisateurs',
    'dashboard.enrolled_courses': 'Cours Inscrits',
    'dashboard.completed_lessons': 'Leçons Terminées',
    'dashboard.upcoming_events': 'Événements à Venir',
    'dashboard.browse_courses': 'Parcourir les Cours',
    'dashboard.explore_courses': 'Explorer les cours disponibles',
    'dashboard.view_events': 'Voir les Événements',
    'dashboard.check_events': 'Vérifier les événements à venir',
    'dashboard.my_profile': 'Mon Profil',
    'dashboard.update_profile': 'Mettre à jour votre profil',
    'dashboard.contact_support': 'Contacter le Support',
    'dashboard.get_help': 'Obtenir de l\'aide et du support',
    'dashboard.no_recent_activities': 'Aucune activité récente',
    
    // Hero Section
    'hero.title': 'Autonomiser Votre Parcours Numérique',
    'hero.description': 'Nous nous engageons à révolutionner le paysage numérique, en offrant des solutions de pointe adaptées aux particuliers, startups, entreprises et organisations.',
    'hero.hire_services': 'Engagez nos services',
    'hero.our_mission': 'Notre Mission',
    
    // Features Section
    'features.title': 'Ce que nous offrons',
    'features.subtitle': 'Que vous soyez un entrepreneur individuel ou une multinationale, Cumi vous couvre.',
    'features.custom_solutions.title': 'Solutions Numériques Personnalisées',
    'features.custom_solutions.description': 'Cumi offre des solutions numériques personnalisées pour les particuliers et les entreprises, adaptées à vos besoins uniques. Nous collaborons étroitement avec les clients de la conception à l\'exécution, en livrant des solutions innovantes qui donnent des résultats tangibles.',
    'features.training.title': 'Formation en Développement Logiciel',
    'features.training.description': 'Cumi équipe les passionnés de technologie avec une expertise en JavaScript, Python, PHP, React, Laravel, Django et React-Native. Notre formation pratique autonomise les développeurs aspirants pour le succès dans l\'industrie technologique compétitive.',
    'features.hire_expertise': 'Engagez notre expertise',
    
    // Service Section
    'service.ready_to_work': 'Prêt à travailler avec Cumi?',
    'service.description': 'Contactez-nous dès aujourd\'hui pour en savoir plus sur nos services et programmes de formation.',
    'service.get_in_touch': 'Entrer en Contact',
    
    // About Note Section
    'about_note.title': 'Pourquoi Choisir Cumi?',
    'about_note.subtitle': 'Ensemble, collaborons pour transformer votre vision en réalité et façonner l\'avenir de la technologie.',
    'about_note.expertise.title': 'Expertise',
    'about_note.expertise.description': 'Notre équipe comprend des professionnels avec une vaste expérience en développement logiciel et conseil technologique. Nous exploitons notre expertise pour livrer.',
    'about_note.innovation.title': 'Innovation',
    'about_note.innovation.description': 'Nous explorons constamment de nouvelles technologies et méthodologies pour rester en avance sur la courbe et livrer des solutions de pointe qui stimulent la croissance des entreprises.',
    'about_note.collaboration.title': 'Collaboration',
    'about_note.collaboration.description': 'Nous travaillons étroitement avec nos clients, favorisant une communication ouverte et une collaboration à chaque étape pour nous assurer que nous sommes alignés avec leurs objectifs.',
    'about_note.excellence.title': 'Engagement envers l\'Excellence',
    'about_note.excellence.description': 'De la qualité de notre travail au niveau de service que nous fournissons, nous visons rien de moins que la perfection pour assurer le succès de nos clients.',
    
    // FAQ Page
    'faq.title': 'Questions Fréquemment Posées',
    'faq.subtitle': 'Trouvez des réponses aux questions courantes sur nos services, processus et comment nous pouvons aider votre entreprise à croître.',
    'faq.services.question': 'Quels services Cumi Digital Solutions offre-t-il?',
    'faq.services.answer': 'Nous offrons des solutions numériques complètes incluant le développement web, le développement d\'applications mobiles, la conception UI/UX, le marketing numérique, les solutions cloud et le conseil technique. Notre équipe se spécialise dans les technologies modernes comme React, Next.js, Node.js et diverses plateformes cloud.',
    'faq.timeline.question': 'Combien de temps prend un projet typique?',
    'faq.timeline.answer': 'Les délais de projet varient selon la complexité et la portée. Les sites web simples prennent généralement 2-4 semaines, tandis que les applications web complexes peuvent prendre 2-6 mois. Nous fournissons des délais détaillés lors de notre consultation initiale et vous tenons informés tout au long du processus de développement.',
    'faq.support.question': 'Offrez-vous un support continu après l\'achèvement du projet?',
    'faq.support.answer': 'Oui, nous offrons un support post-lancement complet incluant la maintenance, les mises à jour, les corrections de bugs et les améliorations de fonctionnalités. Nous avons différents packages de support pour répondre à vos besoins, de la maintenance de base aux services gérés complets.',
    'faq.technologies.question': 'Avec quelles technologies travaillez-vous?',
    'faq.technologies.answer': 'Nous travaillons avec des technologies modernes et standard de l\'industrie incluant React, Next.js, Node.js, TypeScript, Python, Django, React Native, Flutter, AWS, Google Cloud, Docker et bien d\'autres. Nous restons à jour avec les dernières tendances et meilleures pratiques.',
    'faq.existing_projects.question': 'Pouvez-vous aider avec des projets existants?',
    'faq.existing_projects.answer': 'Absolument! Nous pouvons auditer, améliorer, maintenir ou complètement reconstruire des projets existants. Notre équipe a de l\'expérience avec les systèmes hérités et peut aider à moderniser votre pile technologique tout en maintenant la continuité des activités.',
    'faq.pricing.question': 'Quelle est votre structure de prix?',
    'faq.pricing.answer': 'Nos prix sont basés sur le projet et dépendent de la portée, de la complexité et du délai. Nous offrons des tarifs compétitifs et des conditions de paiement flexibles. Contactez-nous pour un devis détaillé adapté à vos besoins spécifiques.',
    'faq.startups.question': 'Travaillez-vous avec des startups?',
    'faq.startups.answer': 'Oui, nous aimons travailler avec des startups! Nous comprenons les défis uniques auxquels les startups font face et offrons des solutions flexibles, des architectures évolutives et des prix adaptés aux startups. Nous pouvons vous aider à construire un MVP ou à faire évoluer votre produit existant.',
    'faq.quality.question': 'Comment assurez-vous la qualité du projet?',
    'faq.quality.answer': 'Nous suivons les meilleures pratiques de l\'industrie incluant les revues de code, les tests automatisés, l\'intégration continue et les sessions régulières de feedback client. Notre processus de développement inclut plusieurs points de contrôle qualité et nous utilisons des méthodologies de développement modernes.',
    'faq.marketing.question': 'Pouvez-vous aider avec le SEO et le marketing numérique?',
    'faq.marketing.answer': 'Oui, nous offrons des services de marketing numérique complets incluant l\'optimisation SEO, le marketing des médias sociaux, le marketing de contenu, la publicité PPC et la configuration d\'analytics. Nous pouvons aider à améliorer votre visibilité en ligne et à attirer plus de trafic vers votre site web.',
    'faq.difference.question': 'Qu\'est-ce qui rend Cumi Digital Solutions différent?',
    'faq.difference.answer': 'Nous combinons l\'expertise technique avec la compréhension des affaires. Notre équipe ne fait pas que coder - nous pensons stratégiquement à vos objectifs commerciaux et créons des solutions qui donnent de vrais résultats. Nous nous engageons dans des partenariats à long terme et votre succès.',
    'faq.cta.title': 'Vous avez encore des questions?',
    'faq.cta.description': 'Vous ne trouvez pas la réponse que vous cherchez? Notre équipe est là pour vous aider. Contactez-nous directement et nous vous répondrons dans les 24 heures.',
    'faq.cta.email': 'Nous Écrire',
    'faq.cta.whatsapp': 'WhatsApp',
    
    // Banner Component
    'banner.subtitle': 'Solutions professionnelles adaptées à vos besoins commerciaux',
    'banner.home': 'Accueil',
    'banner.get_started': 'Commencer',
    'banner.contact_us': 'Nous Contacter',
    
    // Events Page
    'events.title': 'Événements et Ateliers 📅',
    'events.subtitle': 'Découvrez les événements, ateliers et conférences à venir',
    'events.search_placeholder': 'Rechercher des événements...',
    'events.category_placeholder': 'Catégorie',
    'events.all_categories': 'Toutes les Catégories',
    'events.web_dev': 'Développement Web',
    'events.ai_ml': 'IA et ML',
    'events.data_science': 'Science des Données',
    'events.mobile_dev': 'Développement Mobile',
    'events.clear_filters': 'Effacer les Filtres',
    
    // Courses Page
    'courses.title': 'Cours en Ligne 📚',
    'courses.subtitle': 'Apprenez de nouvelles compétences avec notre bibliothèque de cours complète',
    'courses.search_placeholder': 'Rechercher des cours...',
    'courses.level_placeholder': 'Niveau',
    'courses.category_placeholder': 'Catégorie',
    'courses.all_levels': 'Tous les Niveaux',
    'courses.beginner': 'Débutant',
    'courses.intermediate': 'Intermédiaire',
    'courses.advanced': 'Avancé',
    'courses.all_categories': 'Toutes les Catégories',
    'courses.web_dev': 'Développement Web',
    'courses.programming': 'Programmation',
    'courses.data_science': 'Science des Données',
    'courses.mobile_dev': 'Développement Mobile',
    'courses.clear_filters': 'Effacer les Filtres',
    
    // Opportunities Page
    'opportunities.filter_title': 'Filtrer les Opportunités',
    'opportunities.all_opportunities': 'Toutes les Opportunités',
    'opportunities.jobs': 'Emplois',
    'opportunities.scholarships': 'Bourses d\'Études',
    'opportunities.internships': 'Stages',
    'opportunities.fellowships': 'Bourses de Recherche',
    'opportunities.grants': 'Subventions',
    
    // About Page
    'about.title': 'CumiTech - Autonomiser les Startups par l\'Innovation',
    'about.subtitle': 'Chez CumiTech, nous sommes passionnés par l\'autonomisation des entreprises en démarrage grâce à des solutions web innovantes. Nous combinons l\'expertise en ingénierie logicielle avec le design créatif pour livrer des sites web et applications évolutifs qui conduisent au succès.',
    'about.get_in_touch': 'Entrer en Contact',
    'about.our_services': 'Nos Services',
    'about.projects_completed': 'Projets Terminés',
    'about.happy_clients': 'Clients Satisfaits',
    'about.years_experience': 'Années d\'Expérience',
    'about.team_members': 'Membres de l\'Équipe',
    'about.our_story': 'Notre Histoire',
    'about.story_description': 'Fondée en juin 2024, CumiTech a commencé avec une vision d\'autonomiser les entreprises en démarrage grâce à des solutions web innovantes. Basée à Bamenda, Nord-Ouest, Cameroun, nous opérons dans un modèle hybride, combinant l\'expertise en ingénierie logicielle avec le design créatif.',
    'about.our_mission': 'Notre Mission',
    'about.mission_description': 'Nous nous engageons à autonomiser les entreprises en démarrage grâce à des solutions web innovantes. Notre mission est de combiner l\'expertise en ingénierie logicielle avec le design créatif pour livrer des sites web et applications évolutifs qui conduisent au succès commercial.',
    'about.innovation_driven': 'Approche axée sur l\'innovation',
    'about.react_laravel': 'Expertise React & Laravel',
    'about.seo_marketing': 'SEO & Marketing Digital',
    'about.client_management': 'Gestion des relations clients',
    'about.core_values': 'Nos Valeurs Fondamentales',
    'about.values_description': 'Ces valeurs guident tout ce que nous faisons et façonnent notre culture d\'entreprise.',
    'about.innovation': 'Innovation',
    'about.innovation_desc': 'Nous explorons constamment de nouvelles technologies et méthodologies pour livrer des solutions de pointe.',
    'about.passion': 'Passion',
    'about.passion_desc': 'Notre équipe est passionnée par la création d\'expériences numériques qui font une vraie différence.',
    'about.excellence': 'Excellence',
    'about.excellence_desc': 'Nous visons l\'excellence dans chaque projet, en assurant qualité et attention aux détails.',
    'about.collaboration': 'Collaboration',
    'about.collaboration_desc': 'Nous croyons au pouvoir du travail d\'équipe et de la collaboration pour atteindre des résultats extraordinaires.',
    'about.our_journey': 'Notre Parcours',
    'about.journey_description': 'Une chronologie de notre croissance et de nos réalisations au fil des années.',
    'about.meet_team': 'Rencontrez Notre Équipe',
    'about.team_description': 'Les individus talentueux qui font le succès de Cumi Digital.',
    'about.skills': 'Compétences:',
    'about.experience': 'Expérience:',
    'about.location': 'Localisation:',
    'about.ready_to_work': 'Prêt à Travailler Avec Nous?',
    'about.work_description': 'Discutons de votre projet et créons quelque chose d\'incroyable ensemble.',
    'about.start_project': 'Commencer Votre Projet',
    'about.contact_us': 'Nous Contacter',
    
    // Contact Page
    'contact.full_name': 'Nom Complet',
    'contact.working_mail': 'Email de Travail',
    'contact.anything_else': 'Autre chose?',
    'contact.message_placeholder': 'Le message va ici...',
    'contact.submit': 'Soumettre',
    
    // Services Page
    'services.transform_vision': 'Transformez Votre Vision Numérique en Réalité',
    'services.transform_description': 'Nous fournissons des solutions numériques complètes qui stimulent la croissance, améliorent l\'expérience utilisateur et livrent des résultats mesurables pour les entreprises de toutes tailles.',
    'services.get_started': 'Commencer',
    'services.learn_more': 'En Savoir Plus',
    'services.why_choose': 'Pourquoi Choisir Cumi Digital?',
    'services.why_description': 'Nous combinons l\'expertise technique avec l\'innovation créative pour livrer des solutions qui dépassent les attentes.',
    'services.fast_delivery': 'Livraison Rapide',
    'services.fast_description': 'Nous livrons les projets à temps avec une qualité exceptionnelle',
    'services.innovative_solutions': 'Solutions Innovantes',
    'services.innovative_description': 'Technologie de pointe et résolution créative de problèmes',
    'services.performance_focused': 'Axé sur la Performance',
    'services.performance_description': 'Solutions optimisées pour une efficacité et vitesse maximales',
    'services.client_centric': 'Centré Client',
    'services.client_description': 'Votre succès est notre priorité dans chaque projet',
    'services.what_you_get': 'Ce Que Vous Obtenez Avec Nos Services',
    'services.benefits_description': 'Chaque projet vient avec un support complet et des fonctionnalités de pointe conçues pour vous donner un avantage concurrentiel.',
    'services.support_24_7': 'Support Technique 24/7',
    'services.scalable_solutions': 'Solutions Évolutives',
    'services.modern_tech': 'Stack Technologique Moderne',
    'services.seo_optimized': 'Optimisé SEO',
    'services.mobile_responsive': 'Responsive Mobile',
    'services.security_first': 'Approche Sécurité d\'Abord',
    'services.ready_to_build': 'Prêt à Construire Votre Prochain Projet?',
    'services.build_description': 'Discutons de vos exigences de projet et créons quelque chose d\'incroyable ensemble.',
    
    // Projects Page
    'projects.innovative_projects': 'Projets Innovants Qui Conduisent au Succès',
    'projects.innovative_description': 'Explorez notre portefeuille de solutions numériques de pointe qui ont transformé les entreprises et livré des résultats exceptionnels dans diverses industries.',
    'projects.start_project': 'Commencer Votre Projet',
    'projects.view_services': 'Voir les Services',
    'projects.technologies_master': 'Technologies Que Nous Maîtrisons',
    'projects.tech_description': 'Nous travaillons avec des technologies de pointe pour construire des applications robustes, évolutives et hautes performances.',
    'projects.featured_projects': 'Projets en Vedette',
    'projects.featured_description': 'Chaque projet représente notre engagement envers l\'excellence, l\'innovation et la livraison de solutions qui dépassent les attentes.',
    'projects.no_projects': 'Aucun projet disponible pour le moment',
    'projects.ready_to_start': 'Prêt à Commencer?',
    'projects.start_description': 'Discutons de votre projet et donnons vie à votre vision avec nos services professionnels.',
    'projects.get_quote': 'Obtenir un Devis',
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>('en');

  useEffect(() => {
    // Get locale from cookie or default to 'en'
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || 'en';
    setLocale(savedLocale);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    // Save to cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    // Reload page to apply translations
    window.location.reload();
  };

  const t = (key: string): string => {
    return translations[locale as keyof typeof translations]?.[key as keyof typeof translations['en']] || key;
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale: handleLocaleChange, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Language selector component
export const LanguageSelector: React.FC = () => {
  const { locale, setLocale, t } = useTranslation();

  const languageItems = [
    {
      key: 'en',
      label: (
        <Space>
          <span>🇺🇸</span>
          <span>English</span>
          {locale === 'en' && <span style={{ color: '#1890ff' }}>✓</span>}
        </Space>
      ),
      onClick: () => setLocale('en'),
    },
    {
      key: 'fr',
      label: (
        <Space>
          <span>🇫🇷</span>
          <span>Français</span>
          {locale === 'fr' && <span style={{ color: '#1890ff' }}>✓</span>}
        </Space>
      ),
      onClick: () => setLocale('fr'),
    },
  ];

  return (
    <Dropdown
      menu={{ items: languageItems }}
      placement="bottomRight"
      arrow
    >
      <Button
        type="text"
        icon={<GlobalOutlined />}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#666',
        }}
      >
        {locale === 'en' ? '🇺🇸' : '🇫🇷'}
      </Button>
    </Dropdown>
  );
};
