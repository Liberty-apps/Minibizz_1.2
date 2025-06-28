import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];
type SiteVitrine = Tables['sites_vitrines']['Row'];
type Template = Tables['templates_sites']['Row'];
type PageSite = Tables['pages_sites']['Row'];

export const sitesService = {
  // Récupérer tous les sites d'un utilisateur
  async getUserSites(userId: string): Promise<SiteVitrine[]> {
    const { data, error } = await supabase
      .from('sites_vitrines')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Récupérer tous les templates disponibles
  async getTemplates(): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates_sites')
      .select('*')
      .eq('actif', true)
      .order('nom');

    if (error) throw error;
    return data || [];
  },

  // Créer un nouveau site
  async createSite(siteData: Tables['sites_vitrines']['Insert']): Promise<SiteVitrine> {
    const { data, error } = await supabase
      .from('sites_vitrines')
      .insert(siteData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour un site
  async updateSite(siteId: string, updates: Tables['sites_vitrines']['Update']): Promise<SiteVitrine> {
    const { data, error } = await supabase
      .from('sites_vitrines')
      .update(updates)
      .eq('id', siteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un site
  async deleteSite(siteId: string): Promise<void> {
    const { error } = await supabase
      .from('sites_vitrines')
      .delete()
      .eq('id', siteId);

    if (error) throw error;
  },

  // Récupérer un site par ID
  async getSiteById(siteId: string): Promise<SiteVitrine | null> {
    const { data, error } = await supabase
      .from('sites_vitrines')
      .select('*')
      .eq('id', siteId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Récupérer un site par sous-domaine
  async getSiteBySubdomain(subdomain: string): Promise<SiteVitrine | null> {
    const { data, error } = await supabase
      .from('sites_vitrines')
      .select('*')
      .eq('sous_domaine', subdomain)
      .eq('statut', 'publie')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Publier un site
  async publishSite(siteId: string): Promise<SiteVitrine> {
    return this.updateSite(siteId, { statut: 'publie' });
  },

  // Mettre un site en brouillon
  async unpublishSite(siteId: string): Promise<SiteVitrine> {
    return this.updateSite(siteId, { statut: 'brouillon' });
  },

  // Gestion des pages
  async getSitePages(siteId: string): Promise<PageSite[]> {
    const { data, error } = await supabase
      .from('pages_sites')
      .select('*')
      .eq('site_id', siteId)
      .order('ordre');

    if (error) throw error;
    return data || [];
  },

  async createPage(pageData: Tables['pages_sites']['Insert']): Promise<PageSite> {
    const { data, error } = await supabase
      .from('pages_sites')
      .insert(pageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePage(pageId: string, updates: Tables['pages_sites']['Update']): Promise<PageSite> {
    const { data, error } = await supabase
      .from('pages_sites')
      .update(updates)
      .eq('id', pageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePage(pageId: string): Promise<void> {
    const { error } = await supabase
      .from('pages_sites')
      .delete()
      .eq('id', pageId);

    if (error) throw error;
  },

  // Vérifier la disponibilité d'un sous-domaine
  async checkSubdomainAvailability(subdomain: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('sites_vitrines')
      .select('id')
      .eq('sous_domaine', subdomain)
      .single();

    if (error && error.code === 'PGRST116') {
      // Aucun résultat trouvé, le sous-domaine est disponible
      return true;
    }

    if (error) throw error;
    
    // Un site existe déjà avec ce sous-domaine
    return false;
  },

  // Générer le HTML d'un site
  async generateSiteHTML(siteId: string): Promise<string> {
    const site = await this.getSiteById(siteId);
    if (!site) throw new Error('Site non trouvé');

    const pages = await this.getSitePages(siteId);
    
    // Template HTML de base
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.nom}</title>
  <style>
    ${this.generateCSS(site.styles)}
  </style>
</head>
<body>
  ${this.generateNavigation(pages)}
  ${this.generateContent(site.contenu, pages)}
  ${this.generateFooter(site)}
</body>
</html>`;

    return htmlTemplate;
  },

  // Générer le CSS du site
  generateCSS(styles: any): string {
    const defaultStyles = {
      couleur_primaire: '#2563eb',
      couleur_secondaire: '#f0f9ff',
      couleur_accent: '#16a34a',
      police_principale: 'Inter, sans-serif'
    };

    const siteStyles = { ...defaultStyles, ...styles };

    return `
      :root {
        --primary-color: ${siteStyles.couleur_primaire};
        --secondary-color: ${siteStyles.couleur_secondaire};
        --accent-color: ${siteStyles.couleur_accent};
        --font-family: ${siteStyles.police_principale};
      }
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: var(--font-family); line-height: 1.6; color: #333; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
      
      header { background: var(--primary-color); color: white; padding: 1rem 0; }
      nav ul { list-style: none; display: flex; gap: 2rem; }
      nav a { color: white; text-decoration: none; font-weight: 500; }
      
      .hero { background: var(--secondary-color); padding: 4rem 0; text-align: center; }
      .hero h1 { font-size: 3rem; margin-bottom: 1rem; color: var(--primary-color); }
      .hero p { font-size: 1.2rem; color: #666; }
      
      .section { padding: 3rem 0; }
      .card { background: white; border-radius: 8px; padding: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      
      footer { background: #333; color: white; text-align: center; padding: 2rem 0; }
    `;
  },

  // Générer la navigation
  generateNavigation(pages: PageSite[]): string {
    const navItems = pages
      .filter(page => page.visible)
      .map(page => `<li><a href="#${page.slug}">${page.nom}</a></li>`)
      .join('');

    return `
      <header>
        <div class="container">
          <nav>
            <ul>
              ${navItems}
            </ul>
          </nav>
        </div>
      </header>
    `;
  },

  // Générer le contenu
  generateContent(contenu: any, pages: PageSite[]): string {
    let html = '';

    pages.forEach(page => {
      if (page.visible) {
        html += `
          <section id="${page.slug}" class="section">
            <div class="container">
              <h2>${page.titre || page.nom}</h2>
              ${this.generatePageContent(page.contenu)}
            </div>
          </section>
        `;
      }
    });

    return html;
  },

  // Générer le contenu d'une page
  generatePageContent(contenu: any): string {
    if (!contenu || typeof contenu !== 'object') {
      return '<p>Contenu à venir...</p>';
    }

    // Ici vous pouvez implémenter la logique pour générer le HTML
    // basé sur la structure du contenu stocké en JSON
    return '<div class="content">Contenu personnalisé</div>';
  },

  // Générer le footer
  generateFooter(site: SiteVitrine): string {
    return `
      <footer>
        <div class="container">
          <p>&copy; ${new Date().getFullYear()} ${site.nom} • Créé avec MiniBizz</p>
        </div>
      </footer>
    `;
  }
};