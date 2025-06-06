
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit, Trash2, Pin, PinOff } from 'lucide-react';
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
  const { deleteThread, pinThread, unpinThread } = useCommunityThreads();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check admin status
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      setIsAdmin(!!data);
    };
    
    checkAdminStatus();
  }, [user]);

  // Show actions if current user is the thread author OR if user is admin (for pinning)
  const canEdit = user && thread.author_id === user.id;
  const canPin = isAdmin;
  
  if (!canEdit && !canPin) {
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

  const handlePin = async () => {
    try {
      if (thread.is_pinned) {
        await unpinThread.mutateAsync(thread.id);
        toast.success('Thread unpinned');
      } else {
        await pinThread.mutateAsync(thread.id);
        toast.success('Thread pinned to top');
      }
    } catch (error) {
      toast.error('Failed to update pin status');
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

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlePin();
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
          {canEdit && (
            <>
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
            </>
          )}
          {canPin && (
            <DropdownMenuItem onClick={handlePinClick}>
              {thread.is_pinned ? (
                <>
                  <PinOff className="mr-2 h-4 w-4" />
                  Unpin
                </>
              ) : (
                <>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin to top
                </>
              )}
            </DropdownMenuItem>
          )}
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
