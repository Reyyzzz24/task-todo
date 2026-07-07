import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function PositionDialog({
  open,
  onOpenChange,
  modalType,
  position,
  nameInput,
  setNameInput,
  onConfirm,
  loading,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {modalType === 'add' && 'Tambah Position'}
            {modalType === 'edit' && 'Edit Position'}
            {modalType === 'delete' && 'Konfirmasi Hapus'}
          </DialogTitle>
          <DialogDescription>
            {modalType === 'delete'
              ? `Apakah Anda yakin ingin menghapus "${position?.name}"? Tindakan ini tidak dapat dibatalkan.`
              : 'Masukkan nama position.'}
          </DialogDescription>
        </DialogHeader>

        {modalType !== 'delete' && (
          <div className="py-4">
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nama position..."
            />
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
