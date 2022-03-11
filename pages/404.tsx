import { Button } from '@mantine/core';
import { useRouter } from 'next/router';

export default function NotFound() {
  const router = useRouter();
  
  return <Button onClick={() => router.push('/')}>Back to home</Button>;
}