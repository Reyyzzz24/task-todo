import { useCallback, useEffect, useMemo, useState } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import api from "../../api/axiosConfig";
import { getColumns } from "./TaskColumns";
import TaskDialog from "./partials/TaskDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "sonner";

const formatToInput = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function TaskIndex() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [todoInput, setTodoInput] = useState("");
    const [startDateInput, setStartDateInput] = useState("");
    const [endDateInput, setEndDateInput] = useState("");
    const [userIdInput, setUserIdInput] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [taskRes, userRes] = await Promise.all([
                api.get("/api/tasks"),
                api.get("/api/users")
            ]);
            setTasks(taskRes.data || []);
            setUsers(userRes.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleAction = async () => {
        setLoading(true);

        if (modalType !== 'delete' && (!todoInput.trim() || !startDateInput || !endDateInput)) {
            toast.error('Todo, start date, dan end date harus diisi.');
            setLoading(false);
            return;
        }

        const payload = {
            todo: todoInput,
            user_id: userIdInput,
            start_date: startDateInput ? new Date(startDateInput).toISOString() : undefined,
            end_date: endDateInput ? new Date(endDateInput).toISOString() : undefined,
        };

        try {
            const taskId = selectedTask?.uuid || selectedTask?.UUID || selectedTask?.id || selectedTask?.ID;

            if (!taskId && modalType !== 'add') {
                toast.error('Task ID tidak tersedia untuk operasi ini');
                setLoading(false);
                return;
            }

            if (modalType === 'add') await api.post("/api/tasks", payload);
            else if (modalType === 'edit') await api.put(`/api/tasks/${taskId}`, payload);
            else if (modalType === 'delete') await api.delete(`/api/tasks/${taskId}`);

            setModalType(null);
            setSelectedTask(null);
            setTodoInput("");
            setStartDateInput("");
            setEndDateInput("");
            fetchData();
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const columns = useMemo(() => getColumns({
        onEdit: (row) => {
            setSelectedTask(row);
            setTodoInput(row.todo);
            setUserIdInput(String(row.user_id));
            setStartDateInput(formatToInput(row.start_date));
            setEndDateInput(formatToInput(row.end_date));
            setModalType('edit');
        },
        onDelete: (row) => { setSelectedTask(row); setModalType('delete'); },
    }), []);

    const table = useReactTable({ data: tasks, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Daftar Tugas</h2>
                <Button onClick={() => { setTodoInput(""); setModalType('add'); }}>Tambah Task</Button>
            </div>

            <TaskDialog
                open={!!modalType}
                onOpenChange={(value) => {
                    if (!value) {
                        setModalType(null);
                        setSelectedTask(null);
                    }
                }}
                modalType={modalType}
                task={selectedTask}
                todoInput={todoInput}
                users={users}
                userIdInput={userIdInput}
                setUserIdInput={setUserIdInput}
                setTodoInput={setTodoInput}
                startDateInput={startDateInput}
                setStartDateInput={setStartDateInput}
                endDateInput={endDateInput}
                setEndDateInput={setEndDateInput}
                onConfirm={handleAction}
                loading={loading}
            />

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                            {group.headers.map((header) => (
                                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">Tidak ada data.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}