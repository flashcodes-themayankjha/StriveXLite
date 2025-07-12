// components/ui/IconSymbol.tsx
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconPack = 'FontAwesome' | 'FontAwesome5' | 'MaterialCommunity';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  pack?: IconPack;
};

export const IconSymbol = ({
  name,
  size = 24,
  color = '#fff',
  pack = 'FontAwesome',
}: IconProps) => {
  const Icon =
    pack === 'FontAwesome5'
      ? FontAwesome5
      : pack === 'MaterialCommunity'
      ? MaterialCommunityIcons
      : FontAwesome;

  return <Icon name={name} size={size} color={color} />;
};

