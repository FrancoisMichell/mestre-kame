import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SessionForm from "../components/session/SessionForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import {
  useFetchSession,
  useUpdateClassSession,
  useDeleteClassSession,
} from "../api/hooks";
import type { UpdateClassSessionDto } from "../components/session/SessionTypes";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import Button from "../components/common/Button";

const SessionEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { session, isLoading, isError, mutate } = useFetchSession(id || "");
  const updateSession = useUpdateClassSession();
  const deleteSession = useDeleteClassSession();

  useEffect(() => {
    if (!id) {
      navigate("/aulas");
    }
  }, [id, navigate]);

  const handleSubmit = async (data: UpdateClassSessionDto) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateSession(id, data);
      await mutate(); // Revalidate session data
      navigate("/aulas");
    } catch (error) {
      console.error("Error updating session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setDeleteError(null);
      await deleteSession(id);
      // Invalidate all session caches to refresh the list
      await mutate(
        (key) => typeof key === "string" && key.includes("/class-sessions"),
      );
      navigate("/aulas");
    } catch (error) {
      console.error("Error deleting session:", error);
      setDeleteError("Erro ao excluir aula. Tente novamente.");
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isError || !session) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <ErrorMessage message="Erro ao carregar aula. Tente novamente." />
        <div className="mt-4">
          <Button onClick={() => navigate("/aulas")} variant="secondary">
            Voltar para lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Editar Aula</h1>
        <p className="text-gray-600">Altere as informações da aula agendada</p>
      </div>

      {/* Delete Error */}
      {deleteError && (
        <div className="mb-4">
          <ErrorMessage message={deleteError} />
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <SessionForm
          session={session}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>

      {/* Delete Button */}
      <div className="flex justify-end">
        <Button
          variant="danger"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isSubmitting}
        >
          Excluir Aula
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Excluir Aula"
        message="Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteDialog(false)}
        variant="danger"
      />
    </div>
  );
};

export default SessionEdit;
