
import React from "react";
import { AlertTriangle } from "lucide-react";

const HealthWarning: React.FC = () => {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div>
          <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Health Notice</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Your answers suggest your dog may have digestive issues. Regular tracking can help identify patterns, 
            but consider consulting with a veterinarian, especially if symptoms are persistent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthWarning;
