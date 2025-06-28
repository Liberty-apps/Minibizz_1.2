import React, { memo, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

interface OptimizedListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListEmptyComponent?: React.ComponentType;
  estimatedItemSize?: number;
}

// Composant de liste optimisé avec virtualisation
function OptimizedListComponent<T>({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onEndReachedThreshold = 0.1,
  ListEmptyComponent,
  estimatedItemSize = 100,
}: OptimizedListProps<T>) {
  
  const memoizedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem]
  );

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: estimatedItemSize,
      offset: estimatedItemSize * index,
      index,
    }),
    [estimatedItemSize]
  );

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListEmptyComponent={ListEmptyComponent || DefaultEmptyComponent}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      showsVerticalScrollIndicator={false}
    />
  );
}

// Composant vide par défaut
const DefaultEmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>Aucun élément trouvé</Text>
  </View>
);

export const OptimizedList = memo(OptimizedListComponent) as typeof OptimizedListComponent;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});