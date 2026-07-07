import { LogOut, User } from 'lucide-react';
import { Button } from './ui/button';

export default function AppHeader({ onLogout, username }) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 className="text-2xl font-bold">Task-Todo</h1>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <User className="h-4 w-4" />
          <span>{username || "Guest"}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}