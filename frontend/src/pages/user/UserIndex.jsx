import { useEffect, useMemo, useState } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import api from "../../api/axiosConfig";
import { getUserColumns } from "./UserColumns";
import UserDialog from "./partials/UserDialog"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function UserIndex() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [nameInput, setNameInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/users");
            setUsers(res.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const resetForm = () => {
        setNameInput("");
        setUsernameInput("");
        setPasswordInput("");
        setConfirmPasswordInput("");
        setPasswordError("");
    };

    const validatePassword = () => {
        if (modalType === 'add') {
            if (!passwordInput) {
                const message = "Password wajib diisi";
                setPasswordError(message);
                toast.error(message);
                return false;
            }
            if (passwordInput !== confirmPasswordInput) {
                const message = "Password dan konfirmasi password tidak cocok";
                setPasswordError(message);
                toast.error(message);
                return false;
            }
        } else if (modalType === 'edit' && passwordInput && passwordInput !== confirmPasswordInput) {
            const message = "Password dan konfirmasi password tidak cocok";
            setPasswordError(message);
            toast.error(message);
            return false;
        }

        setPasswordError("");
        return true;
    };

    const handleAction = async () => {
        if ((modalType === 'add' || modalType === 'edit') && !validatePassword()) {
            return;
        }

        setLoading(true);
        try {
            const payload = { name: nameInput, username: usernameInput };
            
            if (passwordInput) {
                payload.password = passwordInput;
            }

            if (modalType === 'add') await api.post("/api/users", payload);
            else if (modalType === 'edit') await api.put(`/api/users/${selectedUser.uuid}`, payload);
            else if (modalType === 'delete') await api.delete(`/api/users/${selectedUser.uuid}`);

            setModalType(null);
            fetchUsers();
            resetForm();
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const columns = useMemo(() => getUserColumns({
        onEdit: (user) => {
            setSelectedUser(user);
            setNameInput(user.name);
            setUsernameInput(user.username);
            setPasswordInput("");
            setConfirmPasswordInput("");
            setPasswordError("");
            setModalType('edit');
        },
        onDelete: (user) => {
            setSelectedUser(user);
            setModalType('delete');
        },
    }), []);

    const table = useReactTable({ data: users, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Daftar User</h2>
                <Button onClick={() => {
                    resetForm();
                    setModalType('add');
                }}>Tambah User</Button>
            </div>

            <UserDialog
                open={!!modalType}
                onOpenChange={(v) => !v && setModalType(null)}
                modalType={modalType}
                user={selectedUser}
                nameInput={nameInput}
                setNameInput={setNameInput}
                usernameInput={usernameInput}
                setUsernameInput={setUsernameInput}
                passwordInput={passwordInput}
                setPasswordInput={(value) => {
                    setPasswordInput(value);
                    if (passwordError) setPasswordError("");
                }}
                confirmPasswordInput={confirmPasswordInput}
                setConfirmPasswordInput={(value) => {
                    setConfirmPasswordInput(value);
                    if (passwordError) setPasswordError("");
                }}
                passwordError={passwordError}
                onConfirm={handleAction}
                loading={loading}
            />

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                            {group.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {loading ? "Memuat..." : "Tidak ada data."}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}