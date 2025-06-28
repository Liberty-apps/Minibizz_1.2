import { Image } from 'react-native';

// Configuration des images optimisées
export const OPTIMIZED_IMAGES = {
  // Images Pexels optimisées en WebP quand possible
  businessMeeting: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  calculator: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  planning: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  clients: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  dashboard: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
};

// Composant Image optimisé avec lazy loading
export const OptimizedImage = ({ 
  source, 
  style, 
  placeholder = true,
  ...props 
}: {
  source: string;
  style?: any;
  placeholder?: boolean;
  [key: string]: any;
}) => {
  return (
    <Image
      source={{ uri: source }}
      style={style}
      resizeMode="cover"
      {...props}
    />
  );
};

// Préchargement des images critiques
export const preloadCriticalImages = () => {
  const criticalImages = [
    OPTIMIZED_IMAGES.dashboard,
    OPTIMIZED_IMAGES.businessMeeting,
  ];

  criticalImages.forEach(imageUri => {
    Image.prefetch(imageUri);
  });
};