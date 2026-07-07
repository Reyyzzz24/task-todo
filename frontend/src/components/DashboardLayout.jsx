import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';
import { SidebarProvider } from './ui/sidebar';

export default function DashboardLayout({ children, currentPage, onNavigate, onLogout, username }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader onLogout={onLogout} username={username} />
          
          <main className="flex-1 overflow-auto bg-slate-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
