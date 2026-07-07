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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function TaskDialog({
    open,
    onOpenChange,
    modalType,
    task,
    todoInput,
    setTodoInput,
    users = [],
    userIdInput,
    setUserIdInput,
    startDateInput,
    setStartDateInput,
    endDateInput,
    setEndDateInput,
    onConfirm,
    loading
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {modalType === 'add' && "Tambah Task"}
                        {modalType === 'edit' && "Edit Task"}
                        {modalType === 'delete' && "Konfirmasi Hapus"}
                    </DialogTitle>
                    <DialogDescription>
                        {modalType === 'delete'
                            ? `Apakah Anda yakin ingin menghapus "${task?.todo}"? Tindakan ini tidak dapat dibatalkan.`
                            : "Masukkan detail task Anda."}
                    </DialogDescription>
                </DialogHeader>

                {modalType !== 'delete' && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">User</label>
                            <Select value={userIdInput ? String(userIdInput) : ""} onValueChange={setUserIdInput}>
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
                        <Input
                            value={todoInput}
                            onChange={(e) => setTodoInput(e.target.value)}
                            placeholder="Nama task..."
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
                                <Input
                                    type="datetime-local"
                                    value={startDateInput}
                                    onChange={(e) => setStartDateInput(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">End Date</label>
                                <Input
                                    type="datetime-local"
                                    value={endDateInput}
                                    onChange={(e) => setEndDateInput(e.target.value)}
                                />
                            </div>
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