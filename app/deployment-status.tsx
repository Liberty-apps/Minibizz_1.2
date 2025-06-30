import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { CircleCheck as CheckCircle, Circle as XCircle, Clock, RefreshCw, ArrowLeft, ExternalLink } from 'lucide-react-native';

export default function DeploymentStatus() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'in_progress'>('loading');
  const [deploymentInfo, setDeploymentInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    checkDeploymentStatus();
    const interval = setInterval(checkDeploymentStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkDeploymentStatus = async () => {
    try {
      setStatus('loading');
      
      // Call the deployment status endpoint
      const response = await fetch('/api/deployment-status');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch deployment status: ${response.status}`);
      }
      
      const data = await response.json();
      setDeploymentInfo(data);
      setStatus(data.status);
      setLastChecked(new Date());
    } catch (err: any) {
      console.error('Error checking deployment status:', err);
      setError(err.message || 'Failed to check deployment status');
      setStatus('error');
    }
  };

  const handleRefresh = () => {
    checkDeploymentStatus();
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleVisitSite = () => {
    if (deploymentInfo?.url) {
      window.open(deploymentInfo.url, '_blank');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle size={64} color="#16a34a" />;
      case 'error':
        return <XCircle size={64} color="#dc2626" />;
      case 'in_progress':
        return <Clock size={64} color="#eab308" />;
      default:
        return <ActivityIndicator size="large" color="#2563eb" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Déploiement réussi !';
      case 'error':
        return 'Erreur de déploiement';
      case 'in_progress':
        return 'Déploiement en cours...';
      default:
        return 'Vérification du statut...';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'success':
        return 'Votre application a été déployée avec succès et est maintenant accessible en ligne.';
      case 'error':
        return 'Une erreur s\'est produite lors du déploiement. Veuillez vérifier les logs pour plus de détails.';
      case 'in_progress':
        return 'Votre application est en cours de déploiement. Cela peut prendre quelques minutes.';
      default:
        return 'Récupération des informations de déploiement...';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBuildTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} secondes`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statut du déploiement</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <RefreshCw size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statusIconContainer}>
          {getStatusIcon()}
        </View>

        <Text style={styles.statusTitle}>{getStatusTitle()}</Text>
        <Text style={styles.statusDescription}>{getStatusDescription()}</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {deploymentInfo && (
          <View style={styles.deploymentInfoCard}>
            <Text style={styles.cardTitle}>Informations de déploiement</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID :</Text>
              <Text style={styles.infoValue}>{deploymentInfo.id}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Statut :</Text>
              <View style={[
                styles.statusBadge,
                status === 'success' ? styles.successBadge : 
                status === 'error' ? styles.errorBadge : 
                styles.pendingBadge
              ]}>
                <Text style={styles.statusBadgeText}>
                  {status === 'success' ? 'Succès' : 
                   status === 'error' ? 'Erreur' : 
                   'En cours'}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date :</Text>
              <Text style={styles.infoValue}>{formatDate(deploymentInfo.created_at)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Branche :</Text>
              <Text style={styles.infoValue}>{deploymentInfo.branch}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Commit :</Text>
              <Text style={styles.infoValue}>{deploymentInfo.commit_message}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Temps de build :</Text>
              <Text style={styles.infoValue}>{formatBuildTime(deploymentInfo.build_time)}</Text>
            </View>
            
            {status === 'error' && deploymentInfo.error_message && (
              <View style={styles.errorMessageContainer}>
                <Text style={styles.errorMessageTitle}>Message d'erreur :</Text>
                <Text style={styles.errorMessageText}>{deploymentInfo.error_message}</Text>
              </View>
            )}
            
            {status === 'success' && deploymentInfo.url && (
              <View style={styles.urlContainer}>
                <Text style={styles.urlLabel}>URL du site :</Text>
                <View style={styles.urlRow}>
                  <Text style={styles.urlText}>{deploymentInfo.url}</Text>
                  <TouchableOpacity onPress={handleVisitSite}>
                    <ExternalLink size={16} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        <View style={styles.lastCheckedContainer}>
          <Text style={styles.lastCheckedText}>
            Dernière vérification : {lastChecked.toLocaleTimeString('fr-FR')}
          </Text>
        </View>

        <View style={styles.actions}>
          {status === 'success' && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleVisitSite}>
              <ExternalLink size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Visiter le site</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.secondaryButton, status === 'loading' && styles.disabledButton]} 
            onPress={handleRefresh}
            disabled={status === 'loading'}
          >
            <RefreshCw size={20} color={status === 'loading' ? '#9ca3af' : '#2563eb'} />
            <Text style={[styles.secondaryButtonText, status === 'loading' && styles.disabledButtonText]}>
              {status === 'loading' ? 'Actualisation...' : 'Actualiser le statut'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tertiaryButton} onPress={handleGoBack}>
            <ArrowLeft size={20} color="#6b7280" />
            <Text style={styles.tertiaryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  statusIconContainer: {
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
  },
  deploymentInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  successBadge: {
    backgroundColor: '#dcfce7',
  },
  errorBadge: {
    backgroundColor: '#fee2e2',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorMessageContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  errorMessageTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#dc2626',
    marginBottom: 4,
  },
  errorMessageText: {
    fontSize: 14,
    color: '#ef4444',
  },
  urlContainer: {
    marginTop: 16,
  },
  urlLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urlText: {
    fontSize: 14,
    color: '#2563eb',
    marginRight: 8,
  },
  lastCheckedContainer: {
    marginBottom: 24,
  },
  lastCheckedText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
  },
  tertiaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  tertiaryButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
});