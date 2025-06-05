
import { ThreadCard } from './ThreadCard';
import { Thread } from '@/types/community';

interface ThreadListProps {
  threads: Thread[];
  selectedTopic: string;
  onThreadClick: (e: React.MouseEvent, threadId: string) => void;
  onReplyClick: (e: React.MouseEvent, threadId: string) => void;
  onEditThread: (thread: Thread) => void;
  onThreadDeleted: () => void;
}

export const ThreadList = ({ 
  threads, 
  selectedTopic, 
  onThreadClick, 
  onReplyClick, 
  onEditThread, 
  onThreadDeleted 
}: ThreadListProps) => {
  if (threads.length === 0) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
        <p className="text-gray-500">
          {selectedTopic === 'private' 
            ? "No private messages. Contact an admin using the 'Request Call' button on your BSF dashboard."
            : "No discussions yet. Start a new thread!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          onThreadClick={onThreadClick}
          onReplyClick={onReplyClick}
          onEdit={onEditThread}
          onDeleted={onThreadDeleted}
        />
      ))}
    </div>
  );
};
