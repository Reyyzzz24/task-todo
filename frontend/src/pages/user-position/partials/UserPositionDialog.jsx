import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

export default function UserPositionDialog({
    open,
    onOpenChange,
    modalType,
    userIdInput,
    setUserIdInput,
    positionIdInput,
    setPositionIdInput,
    onConfirm,
    loading,
    users = [],
    positions = [],
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {modalType === 'add' && 'Tambah User Position'}
                        {modalType === 'edit' && 'Edit User Position'}
                        {modalType === 'delete' && 'Konfirmasi Hapus'}
                    </DialogTitle>
                    {modalType !== 'delete' && (
                        <DialogDescription>
                            Pilih user dan posisi yang ingin ditugaskan.
                        </DialogDescription>
                    )}
                </DialogHeader>

                {modalType === 'delete' ? (
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                User
                            </label>
                            <Select
                                value={userIdInput ? String(userIdInput) : ""}
                                onValueChange={setUserIdInput}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih User" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((u) => (
                                        <SelectItem key={u.uuid} value={u.uuid}>
                                            {u.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Position
                            </label>
                            <Select
                                value={positionIdInput ? String(positionIdInput) : ""}
                                onValueChange={setPositionIdInput}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Posisi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {positions.map((p) => (
                                        <SelectItem key={p.uuid} value={p.uuid}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={loading}
                        className={modalType === 'delete' ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                        {loading ? 'Memproses...' : modalType === 'delete' ? 'Ya, Hapus' : 'Simpan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}