
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Thread } from '@/types/community';
import { useCommunityThreads } from '@/hooks/useCommunityThreads';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ThreadActionsProps {
  thread: Thread;
  onEdit: () => void;
  onDeleted?: () => void;
}

export const ThreadActions = ({ thread, onEdit, onDeleted }: ThreadActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteThread } = useCommunityThreads();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Only show actions if current user is the thread author
  if (!user || thread.author_id !== user.id) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteThread.mutateAsync(thread.id);
      toast.success('Thread deleted successfully');
      setShowDeleteDialog(false);
      
      // If we're on the thread page, navigate back to community
      if (window.location.pathname.includes('/thread/')) {
        const returnPath = thread.is_private ? '/community?topic=private' : '/community';
        navigate(returnPath);
      } else {
        // If we're on the community page, just call the onDeleted callback
        onDeleted?.();
      }
    } catch (error) {
      toast.error('Failed to delete thread');
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleDropdownClick}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Thread</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this thread? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteThread.isPending}
            >
              {deleteThread.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
