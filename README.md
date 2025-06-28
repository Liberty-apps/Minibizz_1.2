# MiniBizz - Expo 5.3

Application de gestion pour auto-entrepreneurs développée avec Expo 5.3.

## Fonctionnalités

- 📱 Application cross-platform (iOS, Android, Web)
- 📊 Gestion des devis et factures
- 👥 Gestion des clients
- 📅 Planning et calendrier
- 🤝 Partage de missions
- 📰 Actualités et emplois
- ⚙️ Paramètres personnalisables

## Technologies

- **Expo 5.3** - Framework de développement React Native
- **React Native** - Framework mobile
- **TypeScript** - Langage de programmation
- **Tailwind CSS** - Framework CSS
- **Firebase** - Backend et authentification
- **Expo Router** - Navigation

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer le serveur de développement :
```bash
npm run dev
```

3. Scanner le QR code avec l'app Expo Go ou utiliser un émulateur

## Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run android` - Lance sur Android
- `npm run ios` - Lance sur iOS  
- `npm run web` - Lance sur le web
- `npm run build:android` - Build pour Android
- `npm run build:ios` - Build pour iOS
- `npm run build:web` - Build pour le web

## Configuration

1. Configurer Firebase dans `src/lib/firebase.ts`
2. Ajouter vos assets dans le dossier `assets/`
3. Configurer EAS Build dans `eas.json`

## Déploiement

### Web
```bash
npm run build:web
```

### Mobile (avec EAS Build)
```bash
npm run build:android
npm run build:ios
```

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── contexts/       # Contextes React
├── pages/          # Pages de l'application
├── types/          # Types TypeScript
├── utils/          # Utilitaires
└── lib/            # Configuration des services
```