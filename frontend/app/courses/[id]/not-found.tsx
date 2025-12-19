import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold mb-2">Course Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The course you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/courses">
        <Button>Back to Courses</Button>
      </Link>
    </div>
  );
}