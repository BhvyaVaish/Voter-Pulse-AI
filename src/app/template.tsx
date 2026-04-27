'use client';
import { usePathname } from 'next/navigation';
import { DesktopSidebar, MobileBottomNav, AskFAB } from '@/components/nav-bar';

const noShellRoutes = ['/', '/onboarding'];

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showShell = !noShellRoutes.includes(pathname);

  return (
    <>
      {showShell && <DesktopSidebar />}
      <div className={showShell ? 'flex-1 lg:ml-56 pt-20 pb-20 lg:pb-0 animate-fadeIn' : 'pt-20 animate-fadeIn'}>
        {children}
      </div>
      {showShell && <MobileBottomNav />}
      {showShell && <AskFAB />}
    </>
  );
}
