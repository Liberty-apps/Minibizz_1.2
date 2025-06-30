import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { ReactNode } from 'react';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: any;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}: ButtonProps) {
  const getButtonStyle = () => {
    let buttonStyle = [styles.button];
    
    // Variant styles
    if (variant === 'primary') buttonStyle.push(styles.primaryButton);
    if (variant === 'secondary') buttonStyle.push(styles.secondaryButton);
    if (variant === 'outline') buttonStyle.push(styles.outlineButton);
    if (variant === 'ghost') buttonStyle.push(styles.ghostButton);
    
    // Size styles
    if (size === 'small') buttonStyle.push(styles.smallButton);
    if (size === 'large') buttonStyle.push(styles.largeButton);
    
    // Full width
    if (fullWidth) buttonStyle.push(styles.fullWidth);
    
    // Disabled state
    if (disabled || loading) buttonStyle.push(styles.disabledButton);
    
    // Custom styles
    if (style) buttonStyle.push(style);
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let textStyle = [styles.buttonText];
    
    // Variant text styles
    if (variant === 'primary') textStyle.push(styles.primaryText);
    if (variant === 'secondary') textStyle.push(styles.secondaryText);
    if (variant === 'outline') textStyle.push(styles.outlineText);
    if (variant === 'ghost') textStyle.push(styles.ghostText);
    
    // Size text styles
    if (size === 'small') textStyle.push(styles.smallText);
    if (size === 'large') textStyle.push(styles.largeText);
    
    // Disabled state
    if (disabled || loading) textStyle.push(styles.disabledText);
    
    return textStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#ffffff' : '#3b82f6'} 
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: '#dbeafe',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#3b82f6',
  },
  outlineText: {
    color: '#3b82f6',
  },
  ghostText: {
    color: '#3b82f6',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});