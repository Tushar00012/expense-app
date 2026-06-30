import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCategoryById } from '../constants/categories';

interface CategoryIconProps {
  categoryId: string;
  size?: number;
}

export function CategoryIcon({ categoryId, size = 40 }: CategoryIconProps) {
  const category = getCategoryById(categoryId);
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: category.color + '22',
        },
      ]}
    >
      <MaterialCommunityIcons
        name={category.icon as any}
        size={size * 0.5}
        color={category.color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
