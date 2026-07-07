import { LayoutDashboard, CheckSquare, Briefcase, Users } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export default function AppSidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { label: 'Tasks', icon: CheckSquare, key: 'tasks' },
    { label: 'Positions', icon: Briefcase, key: 'positions' },
    { label: 'User Positions', icon: Users, key: 'user-positions' },
    { label: 'Users', icon: Users, key: 'users' },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.key)}
                    isActive={currentPage === item.key}
                    className={currentPage === item.key ? 'bg-slate-100' : ''}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
