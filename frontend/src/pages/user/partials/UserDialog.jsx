import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function UserDialog({
    open,
    onOpenChange,
    modalType,
    user,
    nameInput,
    setNameInput,
    usernameInput,
    setUsernameInput,
    passwordInput,
    setPasswordInput,
    confirmPasswordInput,
    setConfirmPasswordInput,
    passwordError,
    onConfirm,
    loading,
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {modalType === 'add' && "Tambah User"}
                        {modalType === 'edit' && "Edit User"}
                        {modalType === 'delete' && "Konfirmasi Hapus"}
                    </DialogTitle>
                    <DialogDescription>
                        {modalType === 'delete'
                            ? `Apakah Anda yakin ingin menghapus user "${user?.name}"? Tindakan ini tidak dapat dibatalkan.`
                            : "Masukkan detail user."}
                    </DialogDescription>
                </DialogHeader>

                {modalType !== 'delete' && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nama</label>
                            <Input
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="Nama lengkap..."
                                autoComplete="off" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                placeholder="Username..."
                                autoComplete="off" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {modalType === 'edit' ? "Password Baru" : "Password"}
                            </label>
                            <Input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder={modalType === 'edit' ? "Kosongkan jika tidak berubah..." : "Password..."}
                                autoComplete="new-password" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Konfirmasi Password</label>
                            <Input
                                type="password"
                                value={confirmPasswordInput}
                                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                                placeholder={modalType === 'edit' ? "Ulangi password baru..." : "Ulangi password..."}
                                autoComplete="new-password"
                            />
                            {passwordError && (
                                <p className="text-sm text-red-600">{passwordError}</p>
                            )}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={modalType === 'delete' ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                        {loading ? "Memproses..." : modalType === 'delete' ? "Ya, Hapus" : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}