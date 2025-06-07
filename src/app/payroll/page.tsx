"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PayrollPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/payroll/Summary');
  }, [router]);

  return null;
}
