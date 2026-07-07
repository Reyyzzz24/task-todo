import { useCallback, useEffect, useMemo, useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import api from '../../api/axiosConfig';
import { getColumns } from './UserPositionColumns';
import UserPositionDialog from './partials/UserPositionDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export default function UserPositionIndex() {
  const [userPositions, setUserPositions] = useState([]);
  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedUserPosition, setSelectedUserPosition] = useState(null);
  const [userIdInput, setUserIdInput] = useState('');
  const [positionIdInput, setPositionIdInput] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [upRes, uRes, pRes] = await Promise.all([
        api.get('/api/user-positions'),
        api.get('/api/users'),
        api.get('/api/positions')
      ]);
      setUserPositions(upRes.data || []);
      setUsers(uRes.data || []);
      setPositions(pRes.data || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async () => {
    setLoading(true);

    if (modalType !== 'delete' && (!userIdInput || !positionIdInput)) {
      toast.error('User dan Position harus dipilih.');
      setLoading(false);
      return;
    }

    const payload = {
      user_id: userIdInput,
      position_id: positionIdInput,
    };

    try {
      const id = selectedUserPosition?.uuid || selectedUserPosition?.id;

      if (modalType === 'add') await api.post('/api/user-positions', payload);
      else if (modalType === 'edit') await api.put(`/api/user-positions/${id}`, payload);
      else if (modalType === 'delete') await api.delete(`/api/user-positions/${id}`);

      setModalType(null);
      setSelectedUserPosition(null);
      setUserIdInput('');
      setPositionIdInput('');
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: (row) => {
          setSelectedUserPosition(row);
          setUserIdInput(String(row.user_id));
          setPositionIdInput(String(row.position_id));
          setModalType('edit');
        },
        onDelete: (row) => {
          setSelectedUserPosition(row);
          setModalType('delete');
        },
      }),
    []
  );

  const table = useReactTable({
    data: userPositions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Assign Jabatan</h2>
        <Button
          onClick={() => {
            setUserIdInput('');
            setPositionIdInput('');
            setModalType('add');
          }}
        >
          Tambah User Position
        </Button>
      </div>

      <UserPositionDialog
        open={!!modalType}
        onOpenChange={(value) => {
          if (!value) {
            setModalType(null);
            setSelectedUserPosition(null);
          }
        }}
        modalType={modalType}
        userIdInput={userIdInput}
        setUserIdInput={setUserIdInput}
        positionIdInput={positionIdInput}
        setPositionIdInput={setPositionIdInput}
        onConfirm={handleAction}
        loading={loading}
        users={users}
        positions={positions}
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
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}