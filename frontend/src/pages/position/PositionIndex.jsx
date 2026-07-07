import { useCallback, useEffect, useMemo, useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import api from '../../api/axiosConfig';
import { getColumns } from './PositionColumns';
import PositionDialog from './partials/PositionDialog';
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

export default function PositionIndex() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [nameInput, setNameInput] = useState('');

  const fetchPositions = useCallback(async () => {
    try {
      const { data } = await api.get('/api/positions');
      setPositions(data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const handleAction = async () => {
    setLoading(true);

    if (modalType !== 'delete' && !nameInput.trim()) {
      toast.error('Nama position harus diisi.');
      setLoading(false);
      return;
    }

    const payload = {
      name: nameInput,
    };

    try {
      const positionId = selectedPosition?.uuid || selectedPosition?.id;

      if (modalType === 'add') await api.post('/api/positions', payload);
      else if (modalType === 'edit') await api.put(`/api/positions/${positionId}`, payload);
      else if (modalType === 'delete') await api.delete(`/api/positions/${positionId}`);

      setModalType(null);
      setSelectedPosition(null);
      setNameInput('');
      fetchPositions();
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
          setSelectedPosition(row);
          setNameInput(row.name);
          setModalType('edit');
        },
        onDelete: (row) => {
          setSelectedPosition(row);
          setModalType('delete');
        },
      }),
    []
  );

  const table = useReactTable({
    data: positions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Daftar Jabatan</h2>
        <Button
          onClick={() => {
            setNameInput('');
            setModalType('add');
          }}
        >
          Tambah Position
        </Button>
      </div>

      <PositionDialog
        open={!!modalType}
        onOpenChange={(value) => {
          if (!value) {
            setModalType(null);
            setSelectedPosition(null);
          }
        }}
        modalType={modalType}
        position={selectedPosition}
        nameInput={nameInput}
        setNameInput={setNameInput}
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
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
