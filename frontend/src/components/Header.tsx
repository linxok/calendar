'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/Button';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className=bg-white