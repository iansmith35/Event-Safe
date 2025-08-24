import { type ReactNode } from 'react';

export function MdxLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-6 py-8 pt-16 md:pt-20">
      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        {children}
      </div>
    </div>
  );
}

export default MdxLayout;