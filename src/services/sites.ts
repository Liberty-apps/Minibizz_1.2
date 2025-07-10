import { supabase } from '../lib/supabase';

// Types pour les sites et templates
interface SiteVitrine {
  id: string;
  user_id: string;
  nom: string;
  sous_domaine: string | null;
  domaine_personnalise: string | null;
  template_id: string | null;
  configuration: any;
  contenu: any;
  styles: any;
  statut: string;
  ssl_actif: boolean | null;
  analytics_actif: boolean | null;
  seo_config: any | null;
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  nom: string;
  description: string | null;
  type_template: string;
  structure: any;
  styles_defaut: any;
  preview_url: string | null;
  actif: boolean | null;
  created_at: string;
}

interface PageSite {
  id: string;
  site_id: string;
  nom: string;
  slug: string;
  titre: string | null;
  contenu: any;
  meta_description: string | null;
  meta_keywords: string | null;
  ordre: number | null;
  visible: boolean | null;
  created_at: string;
  updated_at: string;
}

export const sitesService = {
  // Récupérer tous les sites d'un utilisateur
  async getUserSites(userId: string): Promise<SiteVitrine[]> {
    try {
      console.log('Fetching sites for user:', userId);
      const { data, error } = await supabase
        .from('sites_vitrines')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sites:', error);
        throw error;
      }
      
      console.log('Sites fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error in getUserSites:', error);
      return [];
    }
  },

  // Récupérer tous les templates disponibles
  async getTemplates(): Promise<Template[]> {
    try {
      console.log('Fetching templates');
      const { data, error } = await supabase
        .from('templates_sites')
        .select('*')
        .eq('actif', true)
        .order('nom');

      if (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }
      
      console.log('Templates fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error in getTemplates:', error);
      return [];
    }
  },

  // Créer un nouveau site
  async createSite(siteData: any): Promise<SiteVitrine> {
    try {
      console.log('Creating site:', siteData.nom);
      const { data, error } = await supabase
        .from('sites_vitrines')
        .insert(siteData)
        .select()
        .single();

      if (error) {
        console.error('Error creating site:', error);
        throw error;
      }
      
      console.log('Site created:', data.id);
      return data;
    } catch (error) {
      console.error('Error in createSite:', error);
      throw error;
    }
  },

  // Mettre à jour un site
  async updateSite(siteId: string, updates: any): Promise<SiteVitrine> {
    try {
      console.log('Updating site:', siteId);
      const { data, error } = await supabase
        .from('sites_vitrines')
        .update(updates)
        .eq('id', siteId)
        .select()
        .single();

      if (error) {
        console.error('Error updating site:', error);
        throw error;
      }
      
      console.log('Site updated:', data.id);
      return data;
    } catch (error) {
      console.error('Error in updateSite:', error);
      throw error;
    }
  },

  // Supprimer un site
  async deleteSite(siteId: string): Promise<void> {
    try {
      console.log('Deleting site:', siteId);
      const { error } = await supabase
        .from('sites_vitrines')
        .delete()
        .eq('id', siteId);

      if (error) {
        console.error('Error deleting site:', error);
        throw error;
      }
      
      console.log('Site deleted:', siteId);
    } catch (error) {
      console.error('Error in deleteSite:', error);
      throw error;
    }
  },

  // Récupérer un site par ID
  async getSiteById(siteId: string): Promise<SiteVitrine | null> {
    try {
      console.log('Fetching site by ID:', siteId);
      const { data, error } = await supabase
        .from('sites_vitrines')
        .select('*')
        .eq('id', siteId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Site not found:', siteId);
          return null;
        }
        console.error('Error fetching site:', error);
        throw error;
      }
      
      console.log('Site fetched:', data.id);
      return data;
    } catch (error) {
      console.error('Error in getSiteById:', error);
      return null;
    }
  },

  // Vérifier la disponibilité d'un sous-domaine
  async checkSubdomainAvailability(subdomain: string): Promise<boolean> {
    try {
      console.log('Checking subdomain availability:', subdomain);
      const { data, error } = await supabase
        .from('sites_vitrines')
        .select('id')
        .eq('sous_domaine', subdomain)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Subdomain available:', subdomain);
          return true;
        }
        console.error('Error checking subdomain:', error);
        throw error;
      }
      
      console.log('Subdomain already taken:', subdomain);
      return false;
    } catch (error) {
      console.error('Error in checkSubdomainAvailability:', error);
      return false;
    }
  },

  // Publier un site
  async publishSite(siteId: string): Promise<SiteVitrine> {
    return this.updateSite(siteId, { statut: 'publie' });
  },

  // Mettre un site en brouillon
  async unpublishSite(siteId: string): Promise<SiteVitrine> {
    return this.updateSite(siteId, { statut: 'brouillon' });
  },

  // Récupérer les pages d'un site
  async getSitePages(siteId: string): Promise<PageSite[]> {
    try {
      console.log('Fetching pages for site:', siteId);
      const { data, error } = await supabase
        .from('pages_sites')
        .select('*')
        .eq('site_id', siteId)
        .order('ordre');

      if (error) {
        console.error('Error fetching site pages:', error);
        throw error;
      }
      
      console.log('Pages fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error in getSitePages:', error);
      return [];
    }
  }
};