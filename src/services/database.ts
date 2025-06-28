import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];
type Client = Tables['clients']['Row'];
type Devis = Tables['devis']['Row'];
type Facture = Tables['factures']['Row'];
type Planning = Tables['planning']['Row'];
type Mission = Tables['missions']['Row'];

// Services pour les clients
export const clientsService = {
  async getAll(userId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(client: Tables['clients']['Insert']): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['clients']['Update']): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Services pour les devis
export const devisService = {
  async getAll(userId: string): Promise<(Devis & { client: Client })[]> {
    const { data, error } = await supabase
      .from('devis')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<(Devis & { client: Client })> {
    const { data, error } = await supabase
      .from('devis')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(devis: Tables['devis']['Insert']): Promise<Devis> {
    const { data, error } = await supabase
      .from('devis')
      .insert(devis)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['devis']['Update']): Promise<Devis> {
    const { data, error } = await supabase
      .from('devis')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('devis')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async generateNumero(userId: string): Promise<string> {
    const year = new Date().getFullYear();
    const { count } = await supabase
      .from('devis')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .like('numero', `DEV-${year}-%`);

    const nextNumber = (count || 0) + 1;
    return `DEV-${year}-${nextNumber.toString().padStart(3, '0')}`;
  },

  async getLines(devisId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('devis_lignes')
      .select('*')
      .eq('devis_id', devisId)
      .order('ordre', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addLine(devisId: string, line: any): Promise<any> {
    const { data, error } = await supabase
      .from('devis_lignes')
      .insert({
        devis_id: devisId,
        description: line.description,
        quantite: line.quantite,
        prix_unitaire: line.prix_unitaire,
        taux_tva: line.taux_tva
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLine(lineId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('devis_lignes')
      .update(updates)
      .eq('id', lineId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLine(lineId: string): Promise<void> {
    const { error } = await supabase
      .from('devis_lignes')
      .delete()
      .eq('id', lineId);

    if (error) throw error;
  }
};

// Services pour les factures
export const facturesService = {
  async getAll(userId: string): Promise<(Facture & { client: Client })[]> {
    const { data, error } = await supabase
      .from('factures')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<(Facture & { client: Client })> {
    const { data, error } = await supabase
      .from('factures')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(facture: Tables['factures']['Insert']): Promise<Facture> {
    const { data, error } = await supabase
      .from('factures')
      .insert(facture)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['factures']['Update']): Promise<Facture> {
    const { data, error } = await supabase
      .from('factures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async generateNumero(userId: string): Promise<string> {
    const year = new Date().getFullYear();
    const { count } = await supabase
      .from('factures')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .like('numero', `FAC-${year}-%`);

    const nextNumber = (count || 0) + 1;
    return `FAC-${year}-${nextNumber.toString().padStart(3, '0')}`;
  },

  async getLines(factureId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('factures_lignes')
      .select('*')
      .eq('facture_id', factureId)
      .order('ordre', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addLine(factureId: string, line: any): Promise<any> {
    const { data, error } = await supabase
      .from('factures_lignes')
      .insert({
        facture_id: factureId,
        description: line.description,
        quantite: line.quantite,
        prix_unitaire: line.prix_unitaire,
        taux_tva: line.taux_tva
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLine(lineId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('factures_lignes')
      .update(updates)
      .eq('id', lineId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLine(lineId: string): Promise<void> {
    const { error } = await supabase
      .from('factures_lignes')
      .delete()
      .eq('id', lineId);

    if (error) throw error;
  }
};

// Services pour le planning
export const planningService = {
  async getAll(userId: string): Promise<(Planning & { client?: Client })[]> {
    const { data, error } = await supabase
      .from('planning')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('user_id', userId)
      .order('date_debut', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async create(event: Tables['planning']['Insert']): Promise<Planning> {
    const { data, error } = await supabase
      .from('planning')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['planning']['Update']): Promise<Planning> {
    const { data, error } = await supabase
      .from('planning')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('planning')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Services pour les missions
export const missionsService = {
  async getAll(): Promise<Mission[]> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('statut', 'ouverte')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMyMissions(userId: string): Promise<Mission[]> {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('createur_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(mission: Tables['missions']['Insert']): Promise<Mission> {
    const { data, error } = await supabase
      .from('missions')
      .insert(mission)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Tables['missions']['Update']): Promise<Mission> {
    const { data, error } = await supabase
      .from('missions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Services pour les statistiques du dashboard
export const dashboardService = {
  async getStats(userId: string) {
    const [clientsCount, devisCount, facturesCount, caThisMois] = await Promise.all([
      // Nombre de clients
      supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      
      // Nombre de devis
      supabase
        .from('devis')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      
      // Nombre de factures
      supabase
        .from('factures')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      
      // CA du mois en cours
      supabase
        .from('factures')
        .select('montant_ttc')
        .eq('user_id', userId)
        .eq('statut', 'payee')
        .gte('date_paiement', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    ]);

    const caTotal = caThisMois.data?.reduce((sum, facture) => sum + (facture.montant_ttc || 0), 0) || 0;

    return {
      clients: clientsCount.count || 0,
      devis: devisCount.count || 0,
      factures: facturesCount.count || 0,
      chiffreAffaires: caTotal
    };
  },

  async getRecentActivity(userId: string) {
    const [recentDevis, recentFactures, recentClients] = await Promise.all([
      supabase
        .from('devis')
        .select('id, numero, created_at, client:clients(nom)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3),
      
      supabase
        .from('factures')
        .select('id, numero, created_at, client:clients(nom)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3),
      
      supabase
        .from('clients')
        .select('id, nom, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3)
    ]);

    return {
      devis: recentDevis.data || [],
      factures: recentFactures.data || [],
      clients: recentClients.data || []
    };
  }
};