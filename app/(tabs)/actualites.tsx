import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Newspaper, Calendar, User, ChevronRight, ExternalLink, Bookmark, Share2 } from 'lucide-react-native';
import { useSubscription } from '../../src/contexts/SubscriptionContext';
import PremiumFeature from '../../components/PremiumFeature';

// Types
interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
  url: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  date: string;
  url: string;
}

export default function ActualitesEmplois() {
  const { hasAccess } = useSubscription();
  const [activeTab, setActiveTab] = useState<'actualites' | 'emplois'>('actualites');
  const [articles, setArticles] = useState<Article[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const hasFeatureAccess = hasAccess('actualites');

  useEffect(() => {
    // Simuler le chargement des données
    const loadData = async () => {
      setLoading(true);
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Articles fictifs
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'Nouvelles mesures fiscales pour les auto-entrepreneurs en 2025',
          excerpt: 'Découvrez les changements importants concernant la fiscalité des auto-entrepreneurs qui entreront en vigueur en janvier 2025.',
          date: '2024-06-15',
          author: 'Marie Dupont',
          category: 'Fiscalité',
          imageUrl: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg',
          url: 'https://example.com/article1'
        },
        {
          id: '2',
          title: 'Comment optimiser votre présence en ligne en tant qu\'indépendant',
          excerpt: 'Conseils pratiques pour améliorer votre visibilité sur le web et attirer plus de clients grâce aux réseaux sociaux et au référencement.',
          date: '2024-06-10',
          author: 'Thomas Martin',
          category: 'Marketing',
          imageUrl: 'https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg',
          url: 'https://example.com/article2'
        },
        {
          id: '3',
          title: 'Les meilleures applications pour gérer votre comptabilité',
          excerpt: 'Comparatif des outils de gestion comptable spécialement conçus pour les travailleurs indépendants et auto-entrepreneurs.',
          date: '2024-06-05',
          author: 'Sophie Leroy',
          category: 'Outils',
          imageUrl: 'https://images.pexels.com/photos/6693661/pexels-photo-6693661.jpeg',
          url: 'https://example.com/article3'
        },
        {
          id: '4',
          title: 'Comment fixer ses tarifs en tant que freelance',
          excerpt: 'Méthodologie et conseils pour déterminer des tarifs justes et rentables pour vos prestations de services.',
          date: '2024-05-28',
          author: 'Jean Dubois',
          category: 'Business',
          imageUrl: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg',
          url: 'https://example.com/article4'
        }
      ];
      
      // Offres d'emploi fictives
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Développeur web freelance',
          company: 'TechCorp',
          location: 'Paris / Remote',
          salary: '400-500€ / jour',
          type: 'Mission',
          date: '2024-06-18',
          url: 'https://example.com/job1'
        },
        {
          id: '2',
          title: 'Graphiste pour refonte de marque',
          company: 'Studio Design',
          location: 'Lyon',
          salary: '3000-4000€',
          type: 'Projet',
          date: '2024-06-16',
          url: 'https://example.com/job2'
        },
        {
          id: '3',
          title: 'Rédacteur web SEO',
          company: 'ContentMaster',
          location: 'Remote',
          salary: '50-80€ / article',
          type: 'Récurrent',
          date: '2024-06-15',
          url: 'https://example.com/job3'
        },
        {
          id: '4',
          title: 'Consultant marketing digital',
          company: 'GrowthAgency',
          location: 'Bordeaux / Remote',
          salary: '450€ / jour',
          type: 'Mission',
          date: '2024-06-12',
          url: 'https://example.com/job4'
        },
        {
          id: '5',
          title: 'Formateur Excel avancé',
          company: 'DataTraining',
          location: 'Marseille',
          salary: '1200€',
          type: 'Ponctuel',
          date: '2024-06-10',
          url: 'https://example.com/job5'
        }
      ];
      
      setArticles(mockArticles);
      setJobs(mockJobs);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <PremiumFeature 
      feature="actualites"
      title="Actualités & Emplois"
      description="Restez informé des dernières actualités du monde des indépendants et découvrez des opportunités d'emploi adaptées à votre profil."
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Actualités & Emplois</Text>
          <Text style={styles.subtitle}>Restez informé et trouvez des opportunités</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'actualites' && styles.activeTab]}
            onPress={() => setActiveTab('actualites')}
          >
            <Newspaper size={20} color={activeTab === 'actualites' ? "#2563eb" : "#6b7280"} />
            <Text style={[styles.tabText, activeTab === 'actualites' && styles.activeTabText]}>
              Actualités
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'emplois' && styles.activeTab]}
            onPress={() => setActiveTab('emplois')}
          >
            <Briefcase size={20} color={activeTab === 'emplois' ? "#2563eb" : "#6b7280"} />
            <Text style={[styles.tabText, activeTab === 'emplois' && styles.activeTabText]}>
              Opportunités
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'actualites' ? (
            <View style={styles.articlesContainer}>
              {articles.map(article => (
                <TouchableOpacity 
                  key={article.id} 
                  style={styles.articleCard}
                  onPress={() => handleOpenLink(article.url)}
                >
                  <Image 
                    source={{ uri: article.imageUrl }} 
                    style={styles.articleImage}
                    resizeMode="cover"
                  />
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{article.category}</Text>
                  </View>
                  <View style={styles.articleContent}>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Text style={styles.articleExcerpt} numberOfLines={2}>
                      {article.excerpt}
                    </Text>
                    <View style={styles.articleMeta}>
                      <View style={styles.metaItem}>
                        <Calendar size={14} color="#6b7280" />
                        <Text style={styles.metaText}>{formatDate(article.date)}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <User size={14} color="#6b7280" />
                        <Text style={styles.metaText}>{article.author}</Text>
                      </View>
                    </View>
                    <View style={styles.articleActions}>
                      <TouchableOpacity style={styles.articleAction}>
                        <Bookmark size={16} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.articleAction}>
                        <Share2 size={16} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.readMoreButton}
                        onPress={() => handleOpenLink(article.url)}
                      >
                        <Text style={styles.readMoreText}>Lire la suite</Text>
                        <ChevronRight size={16} color="#2563eb" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.jobsContainer}>
              {jobs.map(job => (
                <TouchableOpacity 
                  key={job.id} 
                  style={styles.jobCard}
                  onPress={() => handleOpenLink(job.url)}
                >
                  <View style={styles.jobHeader}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.jobTypeBadge}>
                      <Text style={styles.jobTypeText}>{job.type}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.jobDetails}>
                    <View style={styles.jobDetailItem}>
                      <Briefcase size={14} color="#6b7280" />
                      <Text style={styles.jobDetailText}>{job.company}</Text>
                    </View>
                    <View style={styles.jobDetailItem}>
                      <MapPin size={14} color="#6b7280" />
                      <Text style={styles.jobDetailText}>{job.location}</Text>
                    </View>
                    {job.salary && (
                      <View style={styles.jobDetailItem}>
                        <DollarSign size={14} color="#6b7280" />
                        <Text style={styles.jobDetailText}>{job.salary}</Text>
                      </View>
                    )}
                    <View style={styles.jobDetailItem}>
                      <Calendar size={14} color="#6b7280" />
                      <Text style={styles.jobDetailText}>Publié le {formatDate(job.date)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.jobActions}>
                    <TouchableOpacity 
                      style={styles.jobActionButton}
                      onPress={() => handleOpenLink(job.url)}
                    >
                      <Text style={styles.jobActionText}>Voir l'annonce</Text>
                      <ExternalLink size={16} color="#2563eb" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.jobSaveButton}>
                      <Bookmark size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </PremiumFeature>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#2563eb',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  articlesContainer: {
    gap: 16,
  },
  articleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  articleImage: {
    width: '100%',
    height: 180,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  articleActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  articleAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
    marginRight: 4,
  },
  jobsContainer: {
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  jobTypeBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563eb',
  },
  jobDetails: {
    marginBottom: 16,
    gap: 8,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  jobActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    flex: 1,
  },
  jobActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
  },
  jobSaveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});