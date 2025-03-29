
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, MessageSquare } from "lucide-react";

interface FormActionsProps {
  isUploading: boolean;
  hasPhoto: boolean;
  onSubmit: () => void;
  onChatWithAI?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isUploading,
  hasPhoto,
  onSubmit,
  onChatWithAI
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end pt-4">
        <Button 
          type="button" 
          className="flex items-center" 
          disabled={isUploading}
          onClick={onSubmit}
        >
          {isUploading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Entry
            </>
          )}
        </Button>
      </div>
      
      {hasPhoto && onChatWithAI && (
        <Button 
          type="button"
          variant="secondary"
          className="w-full mt-4"
          onClick={onChatWithAI}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Get AI Advice on This Sample
        </Button>
      )}
    </div>
  );
};

export default FormActions;
