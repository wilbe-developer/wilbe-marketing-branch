
import { useSprintTasks } from "./useSprintTasks.tsx";
import { toast } from "sonner";

export const useIpTaskSave = () => {
  const { updateProgress } = useSprintTasks();

  const saveIpTaskData = async (
    taskId: string,
    reliesOnUniIp: boolean | undefined,
    ttoConversation: string,
    ttoTerms: string,
    ttoPlan: string,
    ipOwnershipStatus: string,
    patentPlans: string,
    uploadedFileId?: string
  ) => {
    try {
      // Save to task_answers for the IP task
      const progressResult = await updateProgress.mutateAsync({
        taskId,
        completed: true,
        fileId: uploadedFileId,
        taskAnswers: {
          relies_on_uni_ip: reliesOnUniIp !== undefined ? (reliesOnUniIp ? "yes" : "no") : undefined,
          tto_conversation: ttoConversation,
          tto_terms: ttoTerms,
          tto_plan: ttoPlan,
          ip_ownership_status: ipOwnershipStatus,
          patent_plans: patentPlans
        }
      });
      
      toast.success("IP information saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving IP data:", error);
      toast.error("Failed to save IP information. Please try again.");
      return false;
    }
  };

  return {
    saveIpTaskData
  };
};
